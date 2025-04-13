import { createFileRoute } from "@tanstack/react-router";
import { AccidentForm } from "../../../components/AccidentForm";

export const Route = createFileRoute("/accidents/$id/edit")({
  component: EditAccident,
});

function EditAccident() {
  const { id } = Route.useParams();

  return <AccidentForm id={Number(id)} />;
}
