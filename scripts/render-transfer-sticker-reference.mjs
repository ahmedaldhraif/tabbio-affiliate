import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const root = process.cwd();
const require = createRequire(import.meta.url);
const sharp = require(
  path.join(root, "node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js"),
);

const logoPath =
  "C:/Users/DESKTOP PC/OneDrive/Tabbio Main 2025/tabbio last brand/Makeamark_Tabbio (Updated)/Base Assets/Tabbio — Exported Logos/Main Logo English/Tabbio_MainLogoEnglish_Foundation Black/Tabbio_MainLogoEnglish-01.svg";
const outputRoot = path.join(
  root,
  "apps/tabbio-partners/public/brand/badge-options/sticker-reference/transfer-final",
);
const logo = (await fs.readFile(logoPath, "utf8"))
  .replace(/^<\?xml[^>]*>\s*/i, "")
  .replace(/<svg[^>]*>/i, "")
  .replace(/<\/svg>\s*$/i, "");

const wordmark = (stroke, strokeWidth) => `
  <svg x="145" y="22" width="430" height="103" viewBox="0 0 793.29 190.8" style="stroke:${stroke};stroke-width:${strokeWidth};stroke-linejoin:round;paint-order:stroke fill">${logo}</svg>`;
const status = (stroke, strokeWidth) => `
  <text x="360" y="164" fill="#5A2AFF" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round" paint-order="stroke fill" text-anchor="middle" font-family="Arial, sans-serif" font-size="27" font-weight="700" letter-spacing="3.6">ACTIVE PARTNER 2026</text>`;

const sticker = `
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tabbio active partner 2026 transfer sticker" width="720" height="195" viewBox="0 0 720 195">
  <title>Tabbio active partner 2026 transfer sticker</title>
  <!-- THESIS: The letterforms are the sticker; no enclosing silhouette or background exists. -->
  <!-- OWN-WORLD: Official wordmark, violet status, a minimal white keyline, and a hairline violet cut edge. -->
  <!-- STORY: Tabbio and active partner status read as one compact transfer decal. -->
  <!-- FIRST VIEWPORT: Two closely stacked lines whose contours are cut directly around every letter. -->
  <!-- FORM: Transfer-style die-cut lettering, correcting the rejected plaque silhouettes. -->
  ${wordmark("#5A2AFF", 10)}
  ${wordmark("#FFFFFF", 6)}
  ${wordmark("none", 0)}
  ${status("#FFFFFF", 4)}
  <text x="360" y="164" fill="#5A2AFF" text-anchor="middle" font-family="Arial, sans-serif" font-size="27" font-weight="700" letter-spacing="3.6">ACTIVE PARTNER 2026</text>
</svg>`;

await fs.mkdir(outputRoot, { recursive: true });
await fs.writeFile(
  path.join(outputRoot, "tabbio-partner-transfer-sticker.svg"),
  sticker.trimStart(),
);
await sharp(Buffer.from(sticker), { density: 192 })
  .png()
  .toFile(path.join(outputRoot, "tabbio-partner-transfer-sticker.png"));

const body = sticker
  .replace(/^\s*<svg[^>]*>/i, "")
  .replace(/<\/svg>\s*$/i, "");
const preview = `
<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="820" viewBox="0 0 1500 820">
  <rect width="1500" height="820" fill="#F1F1F4"/>
  <text x="100" y="100" fill="#19181D" font-family="Arial, sans-serif" font-size="48" font-weight="700" letter-spacing="-1.5">Tabbio Partner transfer sticker</text>
  <text x="100" y="145" fill="#68646E" font-family="Arial, sans-serif" font-size="23">The letters are the sticker. No panel, plaque, blob, or enclosing shape.</text>
  <text x="100" y="230" fill="#19181D" font-family="Arial, sans-serif" font-size="22" font-weight="700">On a light surface</text>
  <rect x="100" y="255" width="1300" height="210" rx="16" fill="#DDDDE3"/>
  <svg x="390" y="263" width="720" height="195" viewBox="0 0 720 195">${body}</svg>
  <text x="100" y="565" fill="#19181D" font-family="Arial, sans-serif" font-size="22" font-weight="700">The same transfer sticker on a dark surface</text>
  <rect x="100" y="590" width="1300" height="190" rx="16" fill="#19181D"/>
  <svg x="426" y="594" width="648" height="176" viewBox="0 0 720 195">${body}</svg>
</svg>`;

await fs.writeFile(
  path.join(outputRoot, "tabbio-partner-transfer-sticker-preview.svg"),
  preview.trimStart(),
);
await sharp(Buffer.from(preview), { density: 144 })
  .png()
  .toFile(path.join(outputRoot, "tabbio-partner-transfer-sticker-preview.png"));

console.log(`Rendered transfer sticker reference to ${outputRoot}`);
