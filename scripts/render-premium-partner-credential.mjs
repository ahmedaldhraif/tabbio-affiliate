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
  "apps/tabbio-partners/public/brand/badge-options/premium-credential",
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
  <!-- THESIS: A professional credential should behave like an official brand lockup, not a promotional sticker. -->
  <!-- OWN-WORLD: Official Tabbio wordmark, disciplined black and white, and one precise violet status accent. -->
  <!-- STORY: Read Tabbio, then Partner, then the current active year without visual competition. -->
  <!-- FIRST VIEWPORT: Wordmark on the left; a compact two-line credential block on the right with no divider. -->
  <!-- FORM: Premium partner credential for CVs, profiles, portfolios, websites, and media kits. -->`;

const credentialContent = ({ reverse = false }) => `
  <svg x="62" y="66" width="388" height="93" viewBox="0 0 793.29 190.8">${reverse ? whiteLogo : blackLogo}</svg>
  <text x="500" y="112" fill="${reverse ? "#FFFFFF" : "#19181D"}" font-family="Arial, sans-serif" font-size="46" font-weight="700" letter-spacing="-1.4">Partner</text>
  <circle cx="506" cy="143" r="5" fill="${reverse ? "#BFAEFF" : "#5A2AFF"}"/>
  <text x="523" y="150" fill="${reverse ? "#D5CCFF" : "#5A2AFF"}" font-family="Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="2.1">ACTIVE · 2026</text>`;

const open = `
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tabbio Partner active 2026 credential" width="900" height="220" viewBox="0 0 900 220">
  <title>Tabbio Partner — active 2026</title>${contract}
  ${credentialContent({ reverse: false })}
</svg>`;

const outlined = `
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tabbio Partner active 2026 outlined credential" width="900" height="220" viewBox="0 0 900 220">
  <title>Tabbio Partner — active 2026, outlined</title>${contract}
  <rect x="2" y="2" width="896" height="216" rx="18" fill="#FFFFFF" stroke="#D8D5DF" stroke-width="2"/>
  ${credentialContent({ reverse: false })}
</svg>`;

const reverse = `
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tabbio Partner active 2026 reverse credential" width="900" height="220" viewBox="0 0 900 220">
  <title>Tabbio Partner — active 2026, reverse</title>${contract}
  <rect width="900" height="220" rx="18" fill="#19181D"/>
  ${credentialContent({ reverse: true })}
</svg>`;

await fs.mkdir(outputRoot, { recursive: true });
for (const [name, svg] of [
  ["tabbio-partner-primary", open],
  ["tabbio-partner-outlined", outlined],
  ["tabbio-partner-reverse", reverse],
]) {
  await fs.writeFile(path.join(outputRoot, `${name}.svg`), svg.trimStart());
  await sharp(Buffer.from(svg), { density: 192 })
    .png()
    .toFile(path.join(outputRoot, `${name}.png`));
  await sharp(Buffer.from(svg), { density: 96 })
    .resize({ width: 450 })
    .png()
    .toFile(path.join(outputRoot, `${name}@compact.png`));
}

const body = (svg) =>
  svg.replace(/^\s*<svg[^>]*>/i, "").replace(/<\/svg>\s*$/i, "");
const preview = `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1240" viewBox="0 0 1600 1240">
  <rect width="1600" height="1240" fill="#F4F4F6"/>
  <text x="110" y="105" fill="#19181D" font-family="Arial, sans-serif" font-size="52" font-weight="700" letter-spacing="-1.7">Tabbio Partner credential</text>
  <text x="110" y="153" fill="#68646E" font-family="Arial, sans-serif" font-size="24">A professional identity system for CVs, profiles, portfolios, and websites.</text>

  <text x="110" y="245" fill="#19181D" font-family="Arial, sans-serif" font-size="23" font-weight="700">Primary lockup</text>
  <text x="1330" y="245" fill="#68646E" text-anchor="end" font-family="Arial, sans-serif" font-size="20">CV · LinkedIn · portfolio</text>
  <rect x="110" y="272" width="1380" height="250" rx="16" fill="#FFFFFF"/>
  <svg x="350" y="287" width="900" height="220" viewBox="0 0 900 220">${body(open)}</svg>

  <text x="110" y="620" fill="#19181D" font-family="Arial, sans-serif" font-size="23" font-weight="700">Outlined placement</text>
  <text x="1330" y="620" fill="#68646E" text-anchor="end" font-family="Arial, sans-serif" font-size="20">Website · media kit · email</text>
  <svg x="350" y="647" width="900" height="220" viewBox="0 0 900 220">${body(outlined)}</svg>

  <text x="110" y="965" fill="#19181D" font-family="Arial, sans-serif" font-size="23" font-weight="700">Reverse placement</text>
  <text x="1330" y="965" fill="#68646E" text-anchor="end" font-family="Arial, sans-serif" font-size="20">Dark websites · presentations</text>
  <svg x="350" y="992" width="900" height="220" viewBox="0 0 900 220">${body(reverse)}</svg>
</svg>`;

await fs.writeFile(
  path.join(outputRoot, "tabbio-partner-credential-preview.svg"),
  preview.trimStart(),
);
await sharp(Buffer.from(preview), { density: 144 })
  .png()
  .toFile(path.join(outputRoot, "tabbio-partner-credential-preview.png"));

console.log(`Rendered premium credential system to ${outputRoot}`);
