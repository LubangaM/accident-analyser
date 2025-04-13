import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import { AccidentList } from "./components/AccidentList";
import { AccidentForm } from "./components/AccidentForm";
import { Analytics } from "./pages/Analytics";
import { Upload } from "./pages/Upload";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </QueryClientProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: AccidentList,
});

const accidentFormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/accidents/new",
  component: AccidentForm,
});

const accidentEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/accidents/$id/edit",
  component: AccidentForm,
  validateSearch: (search: Record<string, unknown>) => ({
    id: search.id as string,
  }),
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  component: Analytics,
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upload",
  component: Upload,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  accidentFormRoute,
  accidentEditRoute,
  analyticsRoute,
  uploadRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
