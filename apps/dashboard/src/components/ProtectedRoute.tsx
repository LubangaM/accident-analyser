import React from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  if (requireAuth && !isAuthenticated) {
    // Redirect to login if trying to access protected route while not authenticated
    return <Navigate to="/auth/login" />;
  }

  if (!requireAuth && isAuthenticated) {
    // Redirect to accidents page if trying to access public route while authenticated
    return <Navigate to="/accidents" />;
  }

  return <>{children}</>;
}
