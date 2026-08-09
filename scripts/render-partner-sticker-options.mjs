import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const root = process.cwd();
const require = createRequire(import.meta.url);
const sharp = require(
  path.join(root, "node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js"),
);

const brandRoot =
  "C:/Users/DESKTOP PC/OneDrive/Tabbio Main 2025/tabbio last brand/Makeamark_Tabbio (Updated)/Base Assets/Tabbio — Exported Logos/Main Logo English";
const blackLogoPath = path.join(
  brandRoot,
  "Tabbio_MainLogoEnglish_Foundation Black/Tabbio_MainLogoEnglish-01.svg",
);
const whiteLogoPath = path.join(
  brandRoot,
  "Tabbio_MainLogoEnglish_Future White/Tabbio_MainLogoEnglish-02.svg",
);
const outputRoot = path.join(
  root,
  "apps/tabbio-partners/public/brand/badge-options/sticker-reference",
);

const stripSvg = (source) =>
  source
    .replace(/^<\?xml[^>]*>\s*/i, "")
    .replace(/<svg[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "");

const [blackSource, whiteSource] = await Promise.all([
  fs.readFile(blackLogoPath, "utf8"),
  fs.readFile(whiteLogoPath, "utf8"),
]);
const blackLogo = stripSvg(blackSource);
const whiteLogo = stripSvg(whiteSource);

const contract = `
  <!-- THESIS: A partner credential should feel like a sticker someone is proud to display, not a second corporate logo. -->
  <!-- OWN-WORLD: Tabbio black, white, and violet arranged as a bold die-cut label with a visible white keyline. -->
  <!-- STORY: The official wordmark establishes identity once; the status panel establishes the relationship. -->
  <!-- FIRST VIEWPORT: A compact physical silhouette remains recognizable at profile, website, and social sizes. -->
  <!-- FORM: Two approval directions: horizontal label and stacked shield. Neither claims certification. -->`;

const horizontal = `
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tabbio active partner 2026 horizontal sticker" width="920" height="330" viewBox="0 0 920 330">
  <title>Tabbio active partner 2026 — horizontal sticker</title>${contract}
  <!-- White die-cut carrier -->
  <path d="M92 44H827c30 0 55 25 55 55v132c0 30-25 55-55 55H206l-74 34 12-34H92c-30 0-54-25-54-55V99c0-30 24-55 54-55Z" fill="#FFFFFF"/>
  <!-- Main label -->
  <path d="M100 62H819c25 0 45 20 45 45v116c0 25-20 45-45 45H179l-47 22 8-22h-40c-25 0-44-20-44-45V107c0-25 19-45 44-45Z" fill="#19181D"/>
  <!-- Official wordmark; no separate mark -->
  <svg x="102" y="105" width="410" height="99" viewBox="0 0 793.29 190.8">${whiteLogo}</svg>
  <!-- Integrated status tab -->
  <path d="M548 62h271c25 0 45 20 45 45v116c0 25-20 45-45 45H548V62Z" fill="#5A2AFF"/>
  <text x="706" y="143" fill="#FFFFFF" text-anchor="middle" font-family="Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="2.6">ACTIVE PARTNER</text>
  <text x="706" y="194" fill="#FFFFFF" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="800" letter-spacing="1.5">2026</text>
</svg>`;

const stacked = `
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tabbio active partner 2026 stacked sticker" width="600" height="650" viewBox="0 0 600 650">
  <title>Tabbio active partner 2026 — stacked sticker</title>${contract}
  <!-- White die-cut carrier -->
  <path d="M105 30h390c42 0 75 33 75 75v353c0 48-24 93-65 119l-157 50c-31 10-64 10-95 0l-158-50c-41-26-65-71-65-119V105c0-42 33-75 75-75Z" fill="#FFFFFF"/>
  <!-- Upper identity field -->
  <path d="M112 51h376c34 0 61 27 61 61v206H51V112c0-34 27-61 61-61Z" fill="#FFFFFF"/>
  <svg x="108" y="137" width="384" height="92" viewBox="0 0 793.29 190.8">${blackLogo}</svg>
  <!-- Lower status field and shield point -->
  <path d="M51 300h498v151c0 42-21 81-57 104l-151 48c-27 9-55 9-82 0l-151-48c-36-23-57-62-57-104V300Z" fill="#5A2AFF"/>
  <text x="300" y="393" fill="#FFFFFF" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="4">ACTIVE PARTNER</text>
  <text x="300" y="484" fill="#FFFFFF" text-anchor="middle" font-family="Arial, sans-serif" font-size="78" font-weight="800" letter-spacing="2">2026</text>
</svg>`;

await fs.mkdir(outputRoot, { recursive: true });

for (const [name, svg] of [
  ["tabbio-partner-sticker-horizontal", horizontal],
  ["tabbio-partner-sticker-stacked", stacked],
]) {
  await fs.writeFile(path.join(outputRoot, `${name}.svg`), svg.trimStart());
  await sharp(Buffer.from(svg), { density: 192 })
    .png()
    .toFile(path.join(outputRoot, `${name}.png`));
}

const body = (svg) =>
  svg.replace(/^\s*<svg[^>]*>/i, "").replace(/<\/svg>\s*$/i, "");

const preview = `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <filter id="stickerShadow" x="-30%" y="-30%" width="160%" height="180%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#19181D" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="1600" height="1000" fill="#EEEEF1"/>
  <text x="100" y="105" fill="#19181D" font-family="Arial, sans-serif" font-size="48" font-weight="700" letter-spacing="-1.5">Tabbio Partner stickers</text>
  <text x="100" y="151" fill="#68646E" font-family="Arial, sans-serif" font-size="23">One official wordmark. A real die-cut silhouette. No certification claim.</text>

  <text x="100" y="242" fill="#19181D" font-family="Arial, sans-serif" font-size="22" font-weight="700">01 · Horizontal label</text>
  <g transform="translate(63 247)" filter="url(#stickerShadow)">
    <svg width="920" height="330" viewBox="0 0 920 330">${body(horizontal)}</svg>
  </g>
  <text x="118" y="590" fill="#68646E" font-family="Arial, sans-serif" font-size="20">Best for website footers, email signatures, and LinkedIn banners.</text>

  <text x="1080" y="242" fill="#19181D" font-family="Arial, sans-serif" font-size="22" font-weight="700">02 · Stacked shield</text>
  <g transform="translate(1040 250) scale(.78)" filter="url(#stickerShadow)">
    <svg width="600" height="650" viewBox="0 0 600 650">${body(stacked)}</svg>
  </g>
  <text x="1080" y="790" fill="#68646E" font-family="Arial, sans-serif" font-size="20">Best for profile cards, social posts, and creator kits.</text>

  <rect x="100" y="875" width="1400" height="1" fill="#D5D3DA"/>
  <text x="100" y="924" fill="#19181D" font-family="Arial, sans-serif" font-size="21" font-weight="700">Approval reference only</text>
  <text x="390" y="924" fill="#68646E" font-family="Arial, sans-serif" font-size="21">The chosen version will be finalized as transparent SVG and PNG exports.</text>
</svg>`;

await fs.writeFile(
  path.join(outputRoot, "tabbio-partner-sticker-preview.svg"),
  preview.trimStart(),
);
await sharp(Buffer.from(preview), { density: 144 })
  .png()
  .toFile(path.join(outputRoot, "tabbio-partner-sticker-preview.png"));

console.log(`Rendered sticker approval options to ${outputRoot}`);
