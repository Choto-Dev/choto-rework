import { globSync } from "glob";
import { rimraf } from "rimraf";

async function cleanUP() {
  const targets = [
    "**/node_modules",
    "**/dist",
    "**/package-lock.json",
    "**/yarn.lock",
    "**/pnpm-lock.yaml",
  ];

  for (const target of targets) {
    const matches = globSync(target, { absolute: true, dot: true });

    for (const match of matches) {
      try {
        await rimraf(match);
        console.log(`Removed: ${match}`);
      } catch (err) {
        console.error(`Failed to remove ${match}:`, err);
      }
    }
  }

  console.log("Cleanup complete ✅");
}

cleanUP();
