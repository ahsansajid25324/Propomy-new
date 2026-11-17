import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/client/react";
import type { JSX } from "react";
import { ME_QUERY } from "../../apollo/graphql/queries/Profile";
import type { RootState } from "../../store/store";
import AppLoader from "./AppLoader";

type Role = "investor" | "realtor" | "admin";

type QueryResult = {
me: {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  sub: string;
};
};

const ROLE_ROUTES: Record<Role, string> = {
investor: "/investor",
realtor: "/realtor",
admin: "/admin",
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
const location = useLocation();
const user = useSelector((state: RootState) => state.auth.user);

const { data, loading } = useQuery<QueryResult>(ME_QUERY, {
  skip: !user,
});

if (user?.role) {
  const targetRoute = ROLE_ROUTES[user.role as Role];
  if (targetRoute) {
    return <Navigate to={targetRoute} replace state={{ from: location }} />;
  }
}

if (loading) return <AppLoader />;

if (user && data?.me?.role) {
  const targetRoute = ROLE_ROUTES[data.me.role];
  if (targetRoute) {
    return <Navigate to={targetRoute} replace state={{ from: location }} />;
  }
}

return children;
};

export default PublicRoute;