#!/usr/bin/env node

import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { Readable } from "node:stream";
import {
  createRsbuild,
  loadConfig,
  logger,
  type RsbuildDevServer,
} from "@rsbuild/core";
import { type Context, Hono, type Next } from "hono";
import { serverActions } from "./src/libs/server-actions";

const app = new Hono();
const cwd = process.cwd();

function toRequest(req: IncomingMessage): Request {
  const url = `http://${req.headers.host}${req.url}`;
  return new Request(url, {
    method: req.method,
    headers: req.headers as Record<string, string>,
    body:
      req.method !== "GET" && req.method !== "HEAD"
        ? (Readable.toWeb(req) as ReadableStream)
        : undefined,
  });
}

async function sendResponse(res: ServerResponse, response: Response) {
  res.writeHead(response.status, Object.fromEntries(response.headers));
  if (response.body) {
    const reader = response.body.getReader();
    const pump = async (): Promise<void> => {
      const { done, value } = await reader.read();
      if (done) {
        res.end();
        return;
      }
      res.write(value);
      await pump();
    };
    pump();
  } else {
    res.end();
  }
}

const serverRender =
  (rsbuildDevServer: RsbuildDevServer) => async (c: Context, _next: Next) => {
    const ssrModule = await rsbuildDevServer.environments.ssr.loadBundle<{
      render: () => string;
    }>("index");

    const ssrMarkup = ssrModule.render();
    const template =
      await rsbuildDevServer.environments.web.getTransformedHtml("index");

    return c.html(template.replace("<!--app-content-->", ssrMarkup));
  };

function runRsbuildMiddlewares(
  middlewares: any, // Connect server
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  return new Promise((resolve, reject) => {
    middlewares(req, res, (err: any) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

async function startDevServer() {
  const { content } = await loadConfig({});

  // Init Rsbuild
  const rsbuild = await createRsbuild({
    rsbuildConfig: content,
  });

  const rsbuildDevServer = await rsbuild.createDevServer();

  const serverRenderMiddleware = serverRender(rsbuildDevServer);

  for (const [_key, value] of Object.entries(serverActions)) {
    app.get(value.path, (c) => value.action(c, cwd));
  }

  app.get("/", async (c, next) => {
    try {
      await serverRenderMiddleware(c, next);
    } catch (err) {
      logger.error("SSR render error, downgrade to CSR...\n", err);
      next();
    }
  });

  const serve = createServer(async (req, res) => {
    try {
      const request = toRequest(req);
      const response = await app.fetch(request);

      // If Hono returned something other than 404, send it
      if (response.status !== 404) {
        await sendResponse(res, response);
        return;
      }

      // Step 2: otherwise, fall back to Rsbuild middlewares
      await runRsbuildMiddlewares(rsbuildDevServer.middlewares, req, res);

      if (!res.writableEnded) {
        res.statusCode = 404;
        res.end("Not Found");
      }
    } catch (err) {
      logger.error("Server error:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  const httpServer = serve.listen(rsbuildDevServer.port, () => {
    rsbuildDevServer.afterListen();
  });

  rsbuildDevServer.connectWebSocket({ server: httpServer });

  return {
    close: async () => {
      await rsbuildDevServer.close();
      httpServer.close();
    },
  };
}

// await startDevServer();
const server = await startDevServer();

// graceful shutdown
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  try {
    server.close();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
