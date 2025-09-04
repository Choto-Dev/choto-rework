import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { ShebangPrependPlugin } from "./plugins/ShebangPrependPlugin";

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    base: "/",
  },
  environments: {
    web: {
      source: {
        entry: {
          index: "./src/app/index.tsx",
        },
      },
      output: {
        target: "web",
        distPath: {
          root: "./dist",
        },
      },
      tools: {
        rspack: {
          name: "app",
        },
      },
    },
    ssr: {
      source: {
        entry: {
          index: "./src/app/index.server.tsx",
        },
      },
      output: {
        target: "node",
        distPath: {
          root: "./dist",
        },
      },
    },
    node: {
      source: {
        entry: {
          index: "./src/server.ts",
        },
      },
      output: {
        target: "node",
        module: true,
        distPath: {
          root: "./dist",
        },
        filename: {
          js: "server.js",
        },
      },
      tools: {
        rspack: {
          name: "server",
          dependencies: ["app"],
          plugins: [new ShebangPrependPlugin()],
        },
      },
    },
  },
  html: {
    title: "ReWork App",
  },
});
