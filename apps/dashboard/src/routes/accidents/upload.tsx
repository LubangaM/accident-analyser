import { createFileRoute } from "@tanstack/react-router";
import { CsvUploadForm } from "../../components/CsvUploadForm";
import { ProtectedRoute } from "../../components/ProtectedRoute";

export const Route = createFileRoute("/accidents/upload")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute>
      <CsvUploadForm />
    </ProtectedRoute>
  );
}
