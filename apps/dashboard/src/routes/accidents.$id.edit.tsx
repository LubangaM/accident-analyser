import { createFileRoute, useParams } from "@tanstack/react-router";
import { AccidentForm } from "../components/AccidentForm";

export const Route = createFileRoute("/accidents/$id/edit")({
  component: EditAccident,
});

function EditAccident() {
  const { id } = useParams({ from: "/accidents/$id/edit" });
  return <AccidentForm id={parseInt(id)} />;
}
