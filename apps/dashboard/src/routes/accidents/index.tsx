import { createFileRoute } from "@tanstack/react-router";
import { AccidentList } from "../../components/AccidentList";

export const Route = createFileRoute("/accidents/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AccidentList />;
}
