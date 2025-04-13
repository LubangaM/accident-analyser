import { createFileRoute } from "@tanstack/react-router";
import { AccidentForm } from "../../../components/AccidentForm";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
export const Route = createFileRoute("/accidents/$accidentId/edit")({
  component: EditAccident,
});

function EditAccident() {
  const { accidentId } = Route.useParams();

  return (
    <ProtectedRoute>
      <AccidentForm accidentId={accidentId} />
    </ProtectedRoute>
  );
}
