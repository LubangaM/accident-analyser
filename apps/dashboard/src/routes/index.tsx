import { createFileRoute } from "@tanstack/react-router";
import { AccidentList } from "../components/AccidentList";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <AccidentList />;
}

export const routes = [Route];
