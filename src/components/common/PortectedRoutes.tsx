import { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { JSX } from "react";
import { useQuery } from "@apollo/client/react";
import { ME_QUERY } from "../../apollo/graphql/queries/Profile";
import type { RootState } from "../../store/store";
import AppLoader from "./AppLoader";
import { toast } from "react-toastify";

import type { QueryResult } from "../../types/auth";
import { updateUser } from "../../features/auth/authSlice";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRole?: "investor" | "realtor" | "admin";
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const toastShown = useRef(false);

  const { data, loading, error } = useQuery<QueryResult>(ME_QUERY, {
    skip: !user,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.me) {
      dispatch(updateUser(data.me));
    }
  }, [data, dispatch]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (loading) return <AppLoader />;

  // 🔥 Session expired / invalid token
  if (error || !data?.me) {
    if (!toastShown.current) {
      toast.error("Session expired. Please login again.");
      toastShown.current = true;
    }

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, sessionExpired: true }}
      />
    );
  }

  if (allowedRole && data.me.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
