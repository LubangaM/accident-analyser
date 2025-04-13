import { createFileRoute } from "@tanstack/react-router";
import { ProfileSettings } from "../components/ProfileSettings";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProfileSettings />;
}
