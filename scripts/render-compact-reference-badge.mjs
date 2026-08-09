import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const root = process.cwd();
const require = createRequire(import.meta.url);
const sharp = require(
  path.join(
    root,
    "node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js",
  ),
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
  "apps/tabbio-partners/public/brand/badge-options/compact-reference",
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

const wordmark = ({ tone }) => {
  const content = tone === "white" ? whiteLogo : blackLogo;
  return `<svg x="170" y="46" width="340" height="82" viewBox="0 0 793.29 190.8">${content}</svg>`;
};

const contract = `
  <!-- THESIS: The official wordmark is already the complete Tabbio identity; the credential only adds status. -->
  <!-- OWN-WORLD: One compact rounded frame, official wordmark, violet, black, and white. -->
  <!-- STORY: Read Tabbio first, then the literal current relationship in one glance. -->
  <!-- FIRST VIEWPORT: Centered wordmark above a small status line with no repeated mark or divider. -->
  <!-- FORM: Compact partner lockup derived from familiar certification-badge proportions without claiming certification. -->`;

const lightBadge = `
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tabbio active partner 2026" width="680" height="250" viewBox="0 0 680 250">
  <title>Tabbio active partner 2026</title>${contract}
  <rect x="4" y="4" width="672" height="242" rx="26" fill="#FFFFFF" stroke="#5A2AFF" stroke-width="6"/>
  ${wordmark({ tone: "black" })}
  <text x="340" y="196" fill="#5A2AFF" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="4.5">ACTIVE PARTNER 2026</text>
</svg>`;

const darkBadge = `
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tabbio active partner 2026" width="680" height="250" viewBox="0 0 680 250">
  <title>Tabbio active partner 2026</title>${contract}
  <rect x="4" y="4" width="672" height="242" rx="26" fill="#19181D" stroke="#8061FF" stroke-width="6"/>
  ${wordmark({ tone: "white" })}
  <text x="340" y="196" fill="#C9BCFF" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="4.5">ACTIVE PARTNER 2026</text>
</svg>`;

await fs.mkdir(outputRoot, { recursive: true });

for (const [name, svg] of [
  ["tabbio-partner-compact-light", lightBadge],
  ["tabbio-partner-compact-dark", darkBadge],
]) {
  await fs.writeFile(path.join(outputRoot, `${name}.svg`), svg.trimStart());
  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(outputRoot, `${name}.png`));
}

const body = (svg) =>
  svg.replace(/^\s*<svg[^>]*>/i, "").replace(/<\/svg>\s*$/i, "");

const preview = `
<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="900" viewBox="0 0 1500 900">
  <rect width="1500" height="900" fill="#F5F5F7"/>
  <text x="110" y="104" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="50" font-weight="700" letter-spacing="-1.8">Compact Tabbio Partner badge</text>
  <text x="110" y="148" fill="#68646E" font-family="Inter, Arial, sans-serif" font-size="23">One wordmark. One status line. No repeated symbol.</text>
  <text x="110" y="242" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700">Light</text>
  <rect x="110" y="270" width="1280" height="250" rx="16" fill="#FFFFFF"/>
  <svg x="410" y="270" width="680" height="250" viewBox="0 0 680 250">${body(lightBadge)}</svg>
  <text x="110" y="620" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700">Dark</text>
  <rect x="110" y="648" width="1280" height="250" rx="16" fill="#19181D"/>
  <svg x="410" y="648" width="680" height="250" viewBox="0 0 680 250">${body(darkBadge)}</svg>
</svg>`;

await fs.writeFile(
  path.join(outputRoot, "tabbio-partner-compact-preview.svg"),
  preview.trimStart(),
);
await sharp(Buffer.from(preview))
  .png()
  .toFile(path.join(outputRoot, "tabbio-partner-compact-preview.png"));

console.log(`Rendered compact reference badge to ${outputRoot}`);
