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
  "apps/tabbio-partners/public/brand/badge-options/sticker-reference/diecut-final",
);

const stripSvg = (source) =>
  source
    .replace(/^<\?xml[^>]*>\s*/i, "")
    .replace(/<svg[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "");
const logo = stripSvg(await fs.readFile(logoPath, "utf8"));

const sticker = `
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tabbio active partner 2026 die-cut sticker" width="700" height="230" viewBox="0 0 700 230">
  <title>Tabbio active partner 2026 die-cut sticker</title>
  <!-- THESIS: The sticker is the lettering itself, joined by one close contour instead of a badge background. -->
  <!-- OWN-WORLD: Official Tabbio wordmark, violet status line, white stock, and one narrow violet cut edge. -->
  <!-- STORY: Tabbio leads; active partner status sits close beneath it as one displayable object. -->
  <!-- FIRST VIEWPORT: The top follows the compact wordmark and the lower edge widens only enough for the status line. -->
  <!-- FORM: Purpose-drawn die-cut contour based on the user's marked silhouette, without a card or rounded rectangle. -->
  <path
    d="M145 10H531C558 10 581 23 593 43C602 58 603 75 597 90L592 101C587 112 590 122 600 131L620 147C632 157 641 169 644 181C647 193 639 202 625 207C605 214 584 217 562 219H138C116 217 95 214 75 207C61 202 53 193 56 181C59 169 68 157 80 147L101 129C111 121 114 110 109 99L104 87C99 74 101 59 108 46C116 31 130 18 145 10Z"
    fill="#FFFFFF"
    stroke="#5A2AFF"
    stroke-width="5"
    stroke-linejoin="round"
  />
  <svg x="150" y="27" width="400" height="96" viewBox="0 0 793.29 190.8">${logo}</svg>
  <text x="350" y="177" fill="#5A2AFF" text-anchor="middle" font-family="Arial, sans-serif" font-size="27" font-weight="700" letter-spacing="3.8">ACTIVE PARTNER 2026</text>
</svg>`;

await fs.mkdir(outputRoot, { recursive: true });
await fs.writeFile(
  path.join(outputRoot, "tabbio-partner-diecut-sticker.svg"),
  sticker.trimStart(),
);
await sharp(Buffer.from(sticker), { density: 192 })
  .png()
  .toFile(path.join(outputRoot, "tabbio-partner-diecut-sticker.png"));

const body = sticker
  .replace(/^\s*<svg[^>]*>/i, "")
  .replace(/<\/svg>\s*$/i, "");
const preview = `
<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="860" viewBox="0 0 1500 860">
  <defs>
    <filter id="shadow" x="-20%" y="-30%" width="140%" height="170%">
      <feDropShadow dx="0" dy="12" stdDeviation="11" flood-color="#19181D" flood-opacity="0.16"/>
    </filter>
  </defs>
  <rect width="1500" height="860" fill="#F1F1F4"/>
  <text x="100" y="100" fill="#19181D" font-family="Arial, sans-serif" font-size="48" font-weight="700" letter-spacing="-1.5">Tabbio Partner die-cut sticker</text>
  <text x="100" y="145" fill="#68646E" font-family="Arial, sans-serif" font-size="23">One close contour around the lettering. No card and no rounded background.</text>
  <text x="100" y="228" fill="#19181D" font-family="Arial, sans-serif" font-size="22" font-weight="700">Light surface</text>
  <rect x="100" y="252" width="1300" height="250" rx="16" fill="#DDDDE3"/>
  <g transform="translate(400 252)" filter="url(#shadow)">
    <svg width="700" height="230" viewBox="0 0 700 230">${body}</svg>
  </g>
  <text x="100" y="603" fill="#19181D" font-family="Arial, sans-serif" font-size="22" font-weight="700">The same sticker on a dark surface</text>
  <rect x="100" y="627" width="1300" height="200" rx="16" fill="#19181D"/>
  <g transform="translate(435 612) scale(.9)" filter="url(#shadow)">
    <svg width="700" height="230" viewBox="0 0 700 230">${body}</svg>
  </g>
</svg>`;

await fs.writeFile(
  path.join(outputRoot, "tabbio-partner-diecut-sticker-preview.svg"),
  preview.trimStart(),
);
await sharp(Buffer.from(preview), { density: 144 })
  .png()
  .toFile(path.join(outputRoot, "tabbio-partner-diecut-sticker-preview.png"));

console.log(`Rendered final die-cut sticker reference to ${outputRoot}`);
