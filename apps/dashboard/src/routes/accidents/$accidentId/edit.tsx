import { createFileRoute } from "@tanstack/react-router";
import { AccidentForm } from "../../../components/AccidentForm";

export const Route = createFileRoute("/accidents/$accidentId/edit")({
  component: EditAccident,
});

function EditAccident() {
  const { id } = Route.useParams();

  return <AccidentForm id={Number(id)} />;
}
