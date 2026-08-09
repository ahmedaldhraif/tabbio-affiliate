import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const root = process.cwd();
const require = createRequire(import.meta.url);
const sharp = require(
  path.join(root, "node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js"),
);

const logoRoot =
  "C:/Users/DESKTOP PC/OneDrive/Tabbio Main 2025/tabbio last brand/Makeamark_Tabbio (Updated)/Base Assets/Tabbio — Exported Logos/Main Logo English";
const outputRoot = path.join(
  root,
  "apps/tabbio-partners/public/brand/badge-options/sticker-reference/merged-options",
);
const stripSvg = (source) =>
  source
    .replace(/^<\?xml[^>]*>\s*/i, "")
    .replace(/<svg[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "");
const [blackLogo, whiteLogo] = await Promise.all([
  fs
    .readFile(
      path.join(
        logoRoot,
        "Tabbio_MainLogoEnglish_Foundation Black/Tabbio_MainLogoEnglish-01.svg",
      ),
      "utf8",
    )
    .then(stripSvg),
  fs
    .readFile(
      path.join(
        logoRoot,
        "Tabbio_MainLogoEnglish_Future White/Tabbio_MainLogoEnglish-02.svg",
      ),
      "utf8",
    )
    .then(stripSvg),
]);

const contract = `
  <!-- THESIS: Tabbio and partner status are two visibly distinct fields that physically overlap into one sticker. -->
  <!-- OWN-WORLD: Official wordmark, Tabbio black, violet, white stock, and a single shared die-cut edge. -->
  <!-- STORY: Read the brand first and the current partner status immediately after it. -->
  <!-- FIRST VIEWPORT: Identity field and status field touch with no gap and share one outer silhouette. -->
  <!-- FORM: Two one-piece approval directions based on familiar partner sticker construction. -->`;

const horizontal = `
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tabbio active partner horizontal one-piece sticker" width="800" height="300" viewBox="0 0 800 300">
  <title>Tabbio active partner horizontal one-piece sticker</title>${contract}
  <!-- One shared white cutline around both connected fields. -->
  <rect x="30" y="34" width="740" height="206" rx="62" fill="#FFFFFF"/>
  <rect x="374" y="164" width="380" height="126" rx="42" fill="#FFFFFF"/>
  <rect x="48" y="52" width="704" height="170" rx="45" fill="#19181D"/>
  <svg x="128" y="83" width="420" height="101" viewBox="0 0 793.29 190.8">${whiteLogo}</svg>
  <!-- This tab overlaps the identity body; it is not a second sticker. -->
  <rect x="392" y="182" width="344" height="90" rx="28" fill="#5A2AFF"/>
  <text x="564" y="238" fill="#FFFFFF" text-anchor="middle" font-family="Arial, sans-serif" font-size="23" font-weight="700" letter-spacing="2.2">ACTIVE PARTNER 2026</text>
</svg>`;

const stacked = `
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tabbio active partner stacked one-piece sticker" width="560" height="610" viewBox="0 0 560 610">
  <title>Tabbio active partner stacked one-piece sticker</title>${contract}
  <!-- One shared die-cut carrier. -->
  <path d="M87 18h386c38 0 69 31 69 69v348c0 56-34 106-86 127l-132 36c-29 8-59 8-88 0l-132-36C52 541 18 491 18 435V87c0-38 31-69 69-69Z" fill="#FFFFFF"/>
  <!-- Identity and status fields meet directly at y=286. -->
  <path d="M92 38h376c30 0 54 24 54 54v194H38V92c0-30 24-54 54-54Z" fill="#FFFFFF"/>
  <svg x="102" y="119" width="356" height="86" viewBox="0 0 793.29 190.8">${blackLogo}</svg>
  <path d="M38 286h484v143c0 48-29 91-73 109l-128 35c-27 7-55 7-82 0l-128-35c-44-18-73-61-73-109V286Z" fill="#5A2AFF"/>
  <text x="280" y="376" fill="#FFFFFF" text-anchor="middle" font-family="Arial, sans-serif" font-size="31" font-weight="700" letter-spacing="3.3">ACTIVE PARTNER</text>
  <text x="280" y="470" fill="#FFFFFF" text-anchor="middle" font-family="Arial, sans-serif" font-size="76" font-weight="800" letter-spacing="2">2026</text>
</svg>`;

await fs.mkdir(outputRoot, { recursive: true });
for (const [name, svg] of [
  ["option-a-attached-tab", horizontal],
  ["option-b-stacked-shield", stacked],
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
    <filter id="shadow" x="-25%" y="-30%" width="150%" height="180%">
      <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#19181D" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="1600" height="1000" fill="#EEEEF1"/>
  <text x="100" y="100" fill="#19181D" font-family="Arial, sans-serif" font-size="48" font-weight="700" letter-spacing="-1.5">Two one-piece Tabbio Partner stickers</text>
  <text x="100" y="145" fill="#68646E" font-family="Arial, sans-serif" font-size="23">In both options, the identity and status fields touch and share one physical cutline.</text>

  <text x="100" y="235" fill="#19181D" font-family="Arial, sans-serif" font-size="22" font-weight="700">A · Attached tab</text>
  <text x="100" y="269" fill="#68646E" font-family="Arial, sans-serif" font-size="19">Compact for websites, profiles, and email signatures.</text>
  <rect x="100" y="300" width="870" height="390" rx="18" fill="#D7D7DD"/>
  <g transform="translate(135 340)" filter="url(#shadow)">
    <svg width="800" height="300" viewBox="0 0 800 300">${body(horizontal)}</svg>
  </g>

  <text x="1070" y="235" fill="#19181D" font-family="Arial, sans-serif" font-size="22" font-weight="700">B · Stacked shield</text>
  <text x="1070" y="269" fill="#68646E" font-family="Arial, sans-serif" font-size="19">Stronger for social posts, kits, and physical printing.</text>
  <rect x="1030" y="300" width="470" height="650" rx="18" fill="#D7D7DD"/>
  <g transform="translate(1045 340) scale(.8)" filter="url(#shadow)">
    <svg width="560" height="610" viewBox="0 0 560 610">${body(stacked)}</svg>
  </g>

  <text x="100" y="790" fill="#19181D" font-family="Arial, sans-serif" font-size="26" font-weight="700">Both are one sticker—not separate wordmark and status decals.</text>
</svg>`;

await fs.writeFile(
  path.join(outputRoot, "merged-sticker-options-preview.svg"),
  preview.trimStart(),
);
await sharp(Buffer.from(preview), { density: 144 })
  .png()
  .toFile(path.join(outputRoot, "merged-sticker-options-preview.png"));

console.log(`Rendered merged sticker options to ${outputRoot}`);
