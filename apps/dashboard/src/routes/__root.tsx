import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { AuthProvider } from "../contexts/AuthContext";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <AuthProvider>
      <React.Fragment>
        <Header />
        <Outlet />
      </React.Fragment>
    </AuthProvider>
  );
}
