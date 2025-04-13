import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { AccidentList } from "../../components/AccidentList";

export const Route = createFileRoute("/accidents/")({
  component: AccidentsComponent,
});

function AccidentsComponent() {
  return (
    <ProtectedRoute>
      <AccidentList />
    </ProtectedRoute>
  );
}
