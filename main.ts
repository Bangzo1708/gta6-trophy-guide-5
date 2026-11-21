// Leonida Legend — GTA 6 Trophy Guide & Tracker (make.fun gta6-trophy-guide-01).
// Entrypoint: copies the app and screenshots into the output dir and writes
// the dossier via the vendored make.fun frontend builder.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const rootDir = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

const dossierCaps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
};

const appIndex = join(rootDir, "app", "index.html");
if (!existsSync(appIndex)) {
  throw new Error("Missing app/index.html");
}

const shotsDir = join(rootDir, "screenshots");
if (!existsSync(shotsDir)) {
  throw new Error("Missing screenshots/ directory");
}
const shots = readdirSync(shotsDir);
if (shots.length < 3) {
  throw new Error("Need at least 3 screenshots in screenshots/");
}

const trophiesPath = join(rootDir, "app", "data", "trophies.json");
if (!existsSync(trophiesPath)) {
  throw new Error("Missing app/data/trophies.json");
}
try {
  JSON.parse(readFileSync(trophiesPath, "utf8"));
} catch (err) {
  throw new Error("Invalid JSON in app/data/trophies.json: " + (err as Error).message);
}

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });
cpSync(join(rootDir, "app"), join(outputDir, "app"), { recursive: true });
cpSync(shotsDir, join(outputDir, "screenshots"), { recursive: true });

const dossier = buildDossier(outputDir, dossierCaps);
writeFileSync(join(outputDir, "dossier.json"), JSON.stringify(dossier, null, 2));
console.log("Wrote " + outputDir + "/dossier.json");
