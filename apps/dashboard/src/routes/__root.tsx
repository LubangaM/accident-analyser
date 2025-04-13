import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { AuthProvider } from "../contexts/AuthContext";
import { createFileRoute } from "@tanstack/react-router";
import { ProfileSettings } from "../components/ProfileSettings";

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

// Create profile route
export const ProfileRoute = createFileRoute("/profile")({
  component: () => <ProfileSettings />,
});
