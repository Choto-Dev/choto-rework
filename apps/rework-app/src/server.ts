#!/usr/bin/env node

import fs from "node:fs/promises";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { router } from "./libs/routes";
import { serverActions } from "./libs/server-actions";

const app = new Hono();
const cwd = process.cwd();

router.map((route) =>
  app.get(`${route.path}`, async (c) => {
    const htmlContent = await fs.readFile("./dist/index.html", "utf-8");

    return c.html(htmlContent);
  })
);

for (const [_key, value] of Object.entries(serverActions)) {
  app.get(value.path, (c) => value.action(c, cwd));
}

app.use(
  "*",
  serveStatic({
    root: "./dist/",
  })
);

app.get("/*", async (c) => {
  const htmlContent = await fs.readFile("./dist/index.html", "utf-8");

  return c.html(htmlContent);
});

const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`server is running on http://localhost:${info.port}`);
  }
);

// graceful shutdown
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});

export default app;
