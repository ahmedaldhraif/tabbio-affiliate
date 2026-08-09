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
  "apps/tabbio-partners/public/brand/badge-options/sticker-reference/contour",
);

const stripSvg = (source) =>
  source
    .replace(/^<\?xml[^>]*>\s*/i, "")
    .replace(/<svg[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "");

const logo = stripSvg(await fs.readFile(logoPath, "utf8"));

const contentSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="270" viewBox="0 0 720 270">
  <svg x="155" y="38" width="410" height="99" viewBox="0 0 793.29 190.8">${logo}</svg>
  <text x="360" y="198" fill="#5A2AFF" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="4.2">ACTIVE PARTNER 2026</text>
</svg>`;

await fs.mkdir(outputRoot, { recursive: true });

// Build a real die-cut silhouette from the combined lettering alpha. The
// generous inner dilation joins both rows into one sticker while preserving
// the outside contour of the actual letters.
const contentBuffer = await sharp(Buffer.from(contentSvg), { density: 192 })
  .png()
  .toBuffer();
await fs.writeFile(path.join(outputRoot, "debug-content.png"), contentBuffer);
const { width, height } = await sharp(contentBuffer).metadata();
const alphaMask = await sharp(contentBuffer)
  .ensureAlpha()
  .extractChannel(3)
  .threshold(1)
  .png()
  .toBuffer();
await fs.writeFile(path.join(outputRoot, "debug-alpha.png"), alphaMask);
const innerMask = await sharp(alphaMask)
  .extractChannel(0)
  .blur(32)
  .threshold(2)
  .raw()
  .toBuffer();
const outerMask = await sharp(alphaMask)
  .extractChannel(0)
  .blur(38)
  .threshold(2)
  .raw()
  .toBuffer();

const colorLayer = async (background, mask) =>
  sharp({
    create: { width, height, channels: 3, background },
  })
    .joinChannel(mask, { raw: { width, height, channels: 1 } })
    .png()
    .toBuffer();

const [outerLayer, innerLayer] = await Promise.all([
  colorLayer("#5A2AFF", outerMask),
  colorLayer("#FFFFFF", innerMask),
]);
await fs.writeFile(path.join(outputRoot, "debug-outer.png"), outerLayer);
await fs.writeFile(path.join(outputRoot, "debug-inner.png"), innerLayer);

const stickerBuffer = await sharp({
  create: {
    width,
    height,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([
    { input: outerLayer },
    { input: innerLayer },
    { input: contentBuffer },
  ])
  .png()
  .toBuffer();

const embeddedSticker = stickerBuffer.toString("base64");
const sticker = `
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tabbio active partner 2026 contour sticker" width="720" height="270" viewBox="0 0 720 270">
  <title>Tabbio active partner 2026 contour sticker</title>
  <!-- THESIS: The cut line is generated from the combined lettering itself, with no card or invented background shape. -->
  <!-- OWN-WORLD: Official wordmark, violet status, white die-cut body, and a narrow violet edge. -->
  <!-- STORY: Tabbio is read first and partner status second; the silhouette makes them one displayable sticker. -->
  <!-- FIRST VIEWPORT: The border closely follows the real outer mass of both lines. -->
  <!-- FORM: Letter-derived contour cut refined from the user's marked-up reference. -->
  <image width="720" height="270" href="data:image/png;base64,${embeddedSticker}"/>
</svg>`;

await fs.writeFile(
  path.join(outputRoot, "tabbio-partner-contour-sticker.svg"),
  sticker.trimStart(),
);
await fs.writeFile(
  path.join(outputRoot, "tabbio-partner-contour-sticker.png"),
  stickerBuffer,
);

const body = sticker
  .replace(/^\s*<svg[^>]*>/i, "")
  .replace(/<\/svg>\s*$/i, "");

const preview = `
<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="900" viewBox="0 0 1500 900">
  <defs>
    <filter id="shadow" x="-25%" y="-30%" width="150%" height="170%">
      <feDropShadow dx="0" dy="14" stdDeviation="13" flood-color="#19181D" flood-opacity="0.17"/>
    </filter>
  </defs>
  <rect width="1500" height="900" fill="#F1F1F4"/>
  <text x="100" y="100" fill="#19181D" font-family="Arial, sans-serif" font-size="48" font-weight="700" letter-spacing="-1.5">Tabbio Partner contour sticker</text>
  <text x="100" y="145" fill="#68646E" font-family="Arial, sans-serif" font-size="23">No card. No rounded rectangle. The cut line follows the combined lettering.</text>

  <text x="100" y="230" fill="#19181D" font-family="Arial, sans-serif" font-size="22" font-weight="700">On a light surface</text>
  <rect x="100" y="255" width="1300" height="260" rx="16" fill="#DDDDE3"/>
  <g transform="translate(390 250)" filter="url(#shadow)">
    <svg width="720" height="270" viewBox="0 0 720 270">${body}</svg>
  </g>

  <text x="100" y="615" fill="#19181D" font-family="Arial, sans-serif" font-size="22" font-weight="700">The same sticker on a dark surface</text>
  <rect x="100" y="640" width="1300" height="220" rx="16" fill="#19181D"/>
  <g transform="translate(426 625) scale(.9)" filter="url(#shadow)">
    <svg width="720" height="270" viewBox="0 0 720 270">${body}</svg>
  </g>
</svg>`;

await fs.writeFile(
  path.join(outputRoot, "tabbio-partner-contour-sticker-preview.svg"),
  preview.trimStart(),
);
await sharp(Buffer.from(preview), { density: 144 })
  .png()
  .toFile(path.join(outputRoot, "tabbio-partner-contour-sticker-preview.png"));

console.log(`Rendered contour sticker reference to ${outputRoot}`);
