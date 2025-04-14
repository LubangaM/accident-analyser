import { createFileRoute } from "@tanstack/react-router";
import AccidentDetails from "../../../components/AccidentDetails";

export const Route = createFileRoute("/accidents/$accidentId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { accidentId } = Route.useParams();
  return <AccidentDetails accidentId={accidentId} />;
}
