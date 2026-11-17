import { Outlet } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import client from "../../apollo/client";
import "bootstrap/dist/css/bootstrap.min.css";

const ApolloLayout = () => (
  <ApolloProvider client={client}>
    <Outlet />
  </ApolloProvider>
);

export default ApolloLayout;
