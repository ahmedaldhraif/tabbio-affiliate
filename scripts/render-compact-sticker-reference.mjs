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
  "apps/tabbio-partners/public/brand/badge-options/sticker-reference/compact",
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
  <!-- THESIS: Preserve the compact approved hierarchy and make the perimeter—not extra graphics—create the sticker character. -->
  <!-- OWN-WORLD: Official Tabbio wordmark, one violet status line, a compact rectangular label, and a thick white die-cut edge. -->
  <!-- STORY: Tabbio is read first; active partner status is read second. -->
  <!-- FIRST VIEWPORT: The wordmark sits directly above one status line inside a tactile sticker silhouette. -->
  <!-- FORM: Compact stacked credential, refined from the user's selected reference. -->`;

const badge = ({ dark = false }) => `
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tabbio active partner 2026 sticker" width="660" height="220" viewBox="0 0 660 220">
  <title>Tabbio active partner 2026 sticker</title>${contract}
  <!-- The label itself is the sticker: one fill and one border. -->
  <rect x="8" y="8" width="644" height="204" rx="24" fill="${dark ? "#19181D" : "#FFFFFF"}" stroke="${dark ? "#8061FF" : "#5A2AFF"}" stroke-width="6"/>
  <svg x="175" y="31" width="310" height="75" viewBox="0 0 793.29 190.8">${dark ? whiteLogo : blackLogo}</svg>
  <text x="330" y="155" fill="${dark ? "#C9BCFF" : "#5A2AFF"}" text-anchor="middle" font-family="Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="4">ACTIVE PARTNER 2026</text>
</svg>`;

const light = badge({ dark: false });
const dark = badge({ dark: true });

await fs.mkdir(outputRoot, { recursive: true });

for (const [name, svg] of [
  ["tabbio-partner-sticker-light", light],
  ["tabbio-partner-sticker-dark", dark],
]) {
  await fs.writeFile(path.join(outputRoot, `${name}.svg`), svg.trimStart());
  await sharp(Buffer.from(svg), { density: 192 })
    .png()
    .toFile(path.join(outputRoot, `${name}.png`));
}

const body = (svg) =>
  svg.replace(/^\s*<svg[^>]*>/i, "").replace(/<\/svg>\s*$/i, "");

const preview = `
<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="980" viewBox="0 0 1500 980">
  <defs>
    <filter id="shadow" x="-25%" y="-35%" width="150%" height="180%">
      <feDropShadow dx="0" dy="15" stdDeviation="14" flood-color="#19181D" flood-opacity="0.16"/>
    </filter>
  </defs>
  <rect width="1500" height="980" fill="#F1F1F4"/>
  <text x="100" y="100" fill="#19181D" font-family="Arial, sans-serif" font-size="48" font-weight="700" letter-spacing="-1.5">Compact Tabbio Partner sticker</text>
  <text x="100" y="145" fill="#68646E" font-family="Arial, sans-serif" font-size="23">A tighter lockup with one border and nothing extra.</text>

  <text x="100" y="230" fill="#19181D" font-family="Arial, sans-serif" font-size="22" font-weight="700">Light</text>
  <rect x="100" y="255" width="1300" height="240" rx="18" fill="#DEDEE4"/>
  <g transform="translate(420 265)" filter="url(#shadow)">
    <svg width="660" height="220" viewBox="0 0 660 220">${body(light)}</svg>
  </g>

  <text x="100" y="590" fill="#19181D" font-family="Arial, sans-serif" font-size="22" font-weight="700">Dark</text>
  <rect x="100" y="615" width="1300" height="240" rx="18" fill="#111115"/>
  <g transform="translate(420 625)" filter="url(#shadow)">
    <svg width="660" height="220" viewBox="0 0 660 220">${body(dark)}</svg>
  </g>
</svg>`;

await fs.writeFile(
  path.join(outputRoot, "tabbio-partner-sticker-preview.svg"),
  preview.trimStart(),
);
await sharp(Buffer.from(preview), { density: 144 })
  .png()
  .toFile(path.join(outputRoot, "tabbio-partner-sticker-preview.png"));

console.log(`Rendered compact sticker reference to ${outputRoot}`);
