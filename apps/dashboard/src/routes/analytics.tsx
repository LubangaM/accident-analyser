import { createFileRoute } from "@tanstack/react-router";
import { Analytics } from "../components/Analytics";

export const Route = createFileRoute("/analytics")({
  component: AnalyticsRoute,
});

export default function AnalyticsRoute() {
  return <Analytics />;
}
