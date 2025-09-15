import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createHead, UnheadProvider } from "@unhead/react/server";
import { ThemeProvider } from "@workspace/shadcn-ui/components/theme";
import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./App";

const head = createHead({
  init: [
    {
      htmlAttrs: { lang: "en" },
    },
  ],
});

const queryClient = new QueryClient();

export function render() {
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <UnheadProvider value={head}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </QueryClientProvider>
      </UnheadProvider>
    </React.StrictMode>
  );
}
