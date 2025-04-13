import { createFileRoute } from "@tanstack/react-router";
import { AccidentForm } from "../../components/AccidentForm";
import { ProtectedRoute } from "../../components/ProtectedRoute";

export const Route = createFileRoute("/accidents/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute>
      <AccidentForm />
    </ProtectedRoute>
  );
}
