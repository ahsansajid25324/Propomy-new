import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloLink,
  Observable,
} from "@apollo/client";
import axios from "axios";
import { store } from "../store/store";
import { logout } from "../features/auth/authSlice";
import type ZenObservable from "zen-observable-ts";

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

// Resolve all queued requests after refresh
const resolvePendingRequests = () => {
  pendingRequests.forEach((callback) => callback());
  pendingRequests = [];
};

// Axios call to refresh token
const refreshToken = async () => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/refresh`,
      {},
      { withCredentials: true },
    );
  } catch (err) {
    store.dispatch(logout());
    throw err;
  }
};

// Handle 401 / UNAUTHENTICATED errors
const handleUnauthorized = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    pendingRequests.push(resolve);

    if (!isRefreshing) {
      isRefreshing = true;

      refreshToken()
        .then(() => {
          isRefreshing = false;
          resolvePendingRequests();
        })
        .catch((err) => {
          isRefreshing = false;
          pendingRequests = [];
          reject(err);
        });
    }
  });
};

const errorLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    let sub: ZenObservable.Subscription;
    let isRetrying = false;

    const start = () => {
      sub = forward(operation).subscribe({
        next: async (result) => {
          const hasAuthError = result.errors?.some(
            (err) =>
              err.extensions?.code === "UNAUTHENTICATED" ||
              err.message === "Unauthorized",
          );

          if (hasAuthError) {
            isRetrying = true;
            try {
              await handleUnauthorized();
              // FIX: Overwrite 'sub' so this new stream can be cleaned up if unmounted
              sub = forward(operation).subscribe({
                next: (val) => observer.next(val),
                error: (err) => observer.error(err),
                complete: () => observer.complete(),
              });
            } catch (refreshErr) {
              observer.error(refreshErr);
            }
          } else {
            observer.next(result);
          }
        },
        error: async (networkError) => {
          if (networkError?.statusCode === 401) {
            isRetrying = true;
            try {
              await handleUnauthorized();
              // FIX: Overwrite 'sub' here as well
              sub = forward(operation).subscribe({
                next: (val) => observer.next(val),
                error: (err) => observer.error(err),
                complete: () => observer.complete(),
              });
            } catch (err) {
              observer.error(err);
            }
          } else {
            observer.error(networkError);
          }
        },
        complete: () => {
          if (!isRetrying) {
            observer.complete();
          }
        },
      });
    };

    start();

    return () => {
      if (sub) sub.unsubscribe();
    };
  });
});

// Apollo client
const client = new ApolloClient({
  link: from([
    errorLink,
    new HttpLink({
      uri: import.meta.env.VITE_API_BASE_URL,
      credentials: "include",
    }),
  ]),
  cache: new InMemoryCache(),
});

export default client;
