import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createHead, UnheadProvider } from "@unhead/react/server";
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
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <UnheadProvider value={head}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </UnheadProvider>
    </React.StrictMode>
  );

  return { head, html };
}
