import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const root = process.cwd();
const require = createRequire(import.meta.url);
const sharp = require(
  path.join(root, "node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js"),
);

const officialLogoPath =
  "C:/Users/DESKTOP PC/OneDrive/Tabbio Main 2025/tabbio last brand/Makeamark_Tabbio (Updated)/Base Assets/Tabbio — Exported Logos/Main Logo English/Tabbio_MainLogoEnglish_Foundation Black/Tabbio_MainLogoEnglish-01.svg";
const outputRoot = path.join(
  root,
  "apps/tabbio-partners/public/brand/badge-options/m3-premium-final",
);

const officialLogo = (await fs.readFile(officialLogoPath, "utf8"))
  .replace(/^<\?xml[^>]*>\s*/i, "")
  .replace(/<svg[^>]*>/i, "")
  .replace(/<\/svg>\s*$/i, "");

const lockup = `
  <g id="credential">
    <!-- Exact, unedited paths from the official Foundation Black wordmark. -->
    <svg x="28" y="38" width="590" height="142" viewBox="0 0 793.29 190.8">
      ${officialLogo}
    </svg>
    <text x="636" y="143" fill="#5A2AFF"
      font-family="Inter, Arial, sans-serif" font-size="46" font-weight="700"
      letter-spacing="-1">Partner</text>
  </g>`;

const digitalBadge = `
<svg xmlns="http://www.w3.org/2000/svg" role="img"
  aria-label="Tabbio Partner" width="900" height="220" viewBox="0 0 900 220">
  <title>Tabbio Partner</title>
  ${lockup}
</svg>`;

const stickerBadge = `
<svg xmlns="http://www.w3.org/2000/svg" role="img"
  aria-label="Tabbio Partner sticker" width="940" height="260" viewBox="-20 -20 940 260">
  <title>Tabbio Partner sticker</title>
  <defs>
    <filter id="cutline" x="-15%" y="-25%" width="130%" height="150%"
      color-interpolation-filters="sRGB">
      <feMorphology in="SourceAlpha" operator="dilate" radius="12" result="edge"/>
      <feFlood flood-color="#FFFFFF" result="paper"/>
      <feComposite in="paper" in2="edge" operator="in" result="whiteEdge"/>
      <feMerge><feMergeNode in="whiteEdge"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <g filter="url(#cutline)">${lockup}</g>
</svg>`;

await fs.mkdir(outputRoot, { recursive: true });
await fs.writeFile(path.join(outputRoot, "tabbio-partner-lockup.svg"), digitalBadge.trimStart());
await fs.writeFile(path.join(outputRoot, "tabbio-partner-sticker.svg"), stickerBadge.trimStart());
await fs.writeFile(path.join(outputRoot, "tabbio-partner-badge.svg"), digitalBadge.trimStart());

await sharp(Buffer.from(digitalBadge), { density: 240 })
  .png()
  .toFile(path.join(outputRoot, "tabbio-partner-lockup.png"));
await sharp(Buffer.from(stickerBadge), { density: 240 })
  .png()
  .toFile(path.join(outputRoot, "tabbio-partner-sticker.png"));
await sharp(Buffer.from(digitalBadge), { density: 144 })
  .resize({ width: 450 })
  .png()
  .toFile(path.join(outputRoot, "tabbio-partner-badge@compact.png"));

const preview = `
<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="900" viewBox="0 0 1500 900">
  <rect width="1500" height="900" fill="#F5F5F7"/>
  <text x="110" y="105" fill="#19181D" font-family="Arial, sans-serif"
    font-size="50" font-weight="700" letter-spacing="-1.5">Official partner lockup</text>
  <text x="110" y="150" fill="#68646E" font-family="Arial, sans-serif" font-size="23">
    Exact Tabbio wordmark. One evergreen role. No badge decoration.
  </text>

  <text x="110" y="235" fill="#19181D" font-family="Arial, sans-serif" font-size="22" font-weight="700">Digital</text>
  <rect x="110" y="265" width="1280" height="250" rx="12" fill="#FFFFFF"/>
  <svg x="300" y="280" width="900" height="220" viewBox="0 0 900 220">${lockup}</svg>

  <text x="110" y="610" fill="#19181D" font-family="Arial, sans-serif" font-size="22" font-weight="700">Die-cut sticker</text>
  <rect x="110" y="640" width="1280" height="190" rx="12" fill="#D7D7DC"/>
  <svg x="395" y="632" width="710" height="196" viewBox="-20 -20 940 260">
    <defs>
      <filter id="previewCutline" x="-15%" y="-25%" width="130%" height="150%" color-interpolation-filters="sRGB">
        <feMorphology in="SourceAlpha" operator="dilate" radius="12" result="edge"/>
        <feFlood flood-color="#FFFFFF" result="paper"/>
        <feComposite in="paper" in2="edge" operator="in" result="whiteEdge"/>
        <feMerge><feMergeNode in="whiteEdge"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <g filter="url(#previewCutline)">${lockup}</g>
  </svg>
</svg>`;

await fs.writeFile(path.join(outputRoot, "tabbio-partner-badge-preview.svg"), preview.trimStart());
await sharp(Buffer.from(preview), { density: 144 })
  .png()
  .toFile(path.join(outputRoot, "tabbio-partner-badge-preview.png"));

console.log(`Rendered official Tabbio partner lockup to ${outputRoot}`);
