import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createHead, UnheadProvider } from "@unhead/react/client";
import { ThemeProvider } from "@workspace/shadcn-ui/components/theme";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";

const head = createHead({
  init: [
    {
      htmlAttrs: { lang: "en" },
    },
  ],
});

const queryClient = new QueryClient();

hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <StrictMode>
    <UnheadProvider head={head}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </UnheadProvider>
  </StrictMode>
);
