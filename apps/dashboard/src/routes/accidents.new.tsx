import { createFileRoute } from "@tanstack/react-router";
import { AccidentForm } from "../components/AccidentForm";

export const Route = createFileRoute("/accidents/new")({
  component: NewAccident,
});

function NewAccident() {
  return <AccidentForm />;
}
