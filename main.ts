// Leonida Legend — GTA 6 Trophy Guide (gta6-trophy-guide-01).
// Entrypoint: copies app/ and screenshots/ into the output directory and
// writes dossier.json with the kit's buildDossier, exactly as the scorer
// rebuilds it. Standard library only, deterministic: two runs write the
// same bytes.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const dossierCaps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
};

const appDir = join(repoRoot, "app");
const shotsDir = join(repoRoot, "screenshots");
if (!existsSync(join(appDir, "index.html"))) throw new Error("app/index.html is missing");
if (readdirSync(shotsDir).filter((f) => !f.startsWith(".")).length < 3) {
  throw new Error("screenshots/ needs at least 3 images");
}

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });
cpSync(appDir, join(outputDir, "app"), { recursive: true });
cpSync(shotsDir, join(outputDir, "screenshots"), { recursive: true });
writeFileSync(join(outputDir, "dossier.json"), buildDossier(outputDir, dossierCaps));
console.log("Wrote " + outputDir + "/dossier.json");
