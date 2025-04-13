import { createFileRoute } from "@tanstack/react-router";
import { Analytics } from "../components/Analytics";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const Route = createFileRoute("/analytics")({
  component: AnalyticsRoute,
});

export default function AnalyticsRoute() {
  return (
    <ProtectedRoute>
      <Analytics />
    </ProtectedRoute>
  );
}
