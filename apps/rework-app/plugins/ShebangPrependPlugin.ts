import fs from "node:fs";
import path from "node:path";
import type { Compilation, Compiler } from "@rspack/core";

export class ShebangPrependPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tap(
      "ShebangPrependPlugin",
      (compilation: Compilation) => {
        const file = "server.js"; // only target server.js
        if (compiler.options.output.path === undefined) {
          return;
        }
        const outputPath = compilation.getPath(compiler.options.output.path);
        const filePath = path.join(outputPath, file);

        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, "utf-8");
          if (!content.startsWith("#!/usr/bin/env node")) {
            fs.writeFileSync(
              filePath,
              `#!/usr/bin/env node\n${content}`,
              "utf-8"
            );
          }
        }
      }
    );
  }
}
