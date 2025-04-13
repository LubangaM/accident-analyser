import { createFileRoute } from "@tanstack/react-router";
import { AccidentForm } from "../components/AccidentForm";

export const Route = createFileRoute("/accidents/$id/edit")({
  component: EditAccident,
});

function EditAccident() {
  return <AccidentForm />;
}
