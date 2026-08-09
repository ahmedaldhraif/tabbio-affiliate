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
  "apps/tabbio-partners/public/brand/badge-options/sticker-reference/compact-merged-final",
);
const logo = (await fs.readFile(logoPath, "utf8"))
  .replace(/^<\?xml[^>]*>\s*/i, "")
  .replace(/<svg[^>]*>/i, "")
  .replace(/<\/svg>\s*$/i, "");

const wordmark = (stroke, strokeWidth) => `
  <svg x="120" y="8" width="400" height="96" viewBox="0 0 793.29 190.8" style="stroke:${stroke};stroke-width:${strokeWidth};stroke-linejoin:round;paint-order:stroke fill">${logo}</svg>`;

const sticker = `
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Compact Tabbio active partner 2026 die-cut sticker" width="640" height="155" viewBox="0 0 640 155">
  <title>Compact Tabbio active partner 2026 die-cut sticker</title>
  <!-- THESIS: The official wordmark and a tiny status ribbon overlap into one compact die-cut sticker. -->
  <!-- OWN-WORLD: Black wordmark, violet ribbon, minimal white keyline, and a hairline violet cut edge. -->
  <!-- STORY: Tabbio reads first; active partner status is physically attached directly beneath it. -->
  <!-- FIRST VIEWPORT: A tight wordmark silhouette with one small centered ribbon overlapping its lower edge. -->
  <!-- FORM: Compact one-piece die-cut badge refined from the user's transfer-sticker reference. -->

  <!-- Shared cut stock: the ribbon overlaps the wordmark keyline, making one physical piece. -->
  <rect x="310" y="94" width="20" height="22" rx="5" fill="#FFFFFF" stroke="#5A2AFF" stroke-width="1.5"/>
  <rect x="169" y="105" width="302" height="46" rx="9" fill="#FFFFFF" stroke="#5A2AFF" stroke-width="1.5"/>
  ${wordmark("#5A2AFF", 6)}
  ${wordmark("#FFFFFF", 4)}
  ${wordmark("none", 0)}

  <!-- A narrow visible bridge joins the identity and status fields. -->
  <rect x="315" y="98" width="10" height="17" rx="3" fill="#5A2AFF"/>
  <rect x="175" y="111" width="290" height="34" rx="6" fill="#5A2AFF"/>
  <text x="320" y="133" fill="#FFFFFF" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="1.45">ACTIVE PARTNER 2026</text>
</svg>`;

await fs.mkdir(outputRoot, { recursive: true });
await fs.writeFile(
  path.join(outputRoot, "tabbio-partner-compact-diecut.svg"),
  sticker.trimStart(),
);
await sharp(Buffer.from(sticker), { density: 192 })
  .png()
  .toFile(path.join(outputRoot, "tabbio-partner-compact-diecut.png"));

const body = sticker
  .replace(/^\s*<svg[^>]*>/i, "")
  .replace(/<\/svg>\s*$/i, "");
const preview = `
<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="850" viewBox="0 0 1500 850">
  <defs>
    <filter id="shadow" x="-20%" y="-35%" width="140%" height="180%">
      <feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="#19181D" flood-opacity="0.16"/>
    </filter>
  </defs>
  <rect width="1500" height="850" fill="#F1F1F4"/>
  <text x="100" y="100" fill="#19181D" font-family="Arial, sans-serif" font-size="48" font-weight="700" letter-spacing="-1.5">Compact one-piece Tabbio Partner sticker</text>
  <text x="100" y="145" fill="#68646E" font-family="Arial, sans-serif" font-size="23">A tight die-cut wordmark with the status ribbon physically merged beneath it.</text>

  <text x="100" y="230" fill="#19181D" font-family="Arial, sans-serif" font-size="22" font-weight="700">Actual construction on a light surface</text>
  <rect x="100" y="255" width="1300" height="220" rx="16" fill="#DDDDE3"/>
  <g transform="translate(430 285)" filter="url(#shadow)">
    <svg width="640" height="155" viewBox="0 0 640 155">${body}</svg>
  </g>

  <text x="100" y="575" fill="#19181D" font-family="Arial, sans-serif" font-size="22" font-weight="700">The same sticker on a dark surface</text>
  <rect x="100" y="600" width="1300" height="190" rx="16" fill="#19181D"/>
  <g transform="translate(462 607) scale(.9)" filter="url(#shadow)">
    <svg width="640" height="155" viewBox="0 0 640 155">${body}</svg>
  </g>
</svg>`;

await fs.writeFile(
  path.join(outputRoot, "tabbio-partner-compact-diecut-preview.svg"),
  preview.trimStart(),
);
await sharp(Buffer.from(preview), { density: 144 })
  .png()
  .toFile(path.join(outputRoot, "tabbio-partner-compact-diecut-preview.png"));

console.log(`Rendered compact merged die-cut sticker to ${outputRoot}`);
