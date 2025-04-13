import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "../../components/LoginPage";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LoginPage />;
}
