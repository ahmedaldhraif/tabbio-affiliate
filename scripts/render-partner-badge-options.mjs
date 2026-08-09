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
  "Tabbio_MainLogoEnglish_Foundation Black",
  "Tabbio_MainLogoEnglish-01.svg",
);
const whiteLogoPath = path.join(
  brandRoot,
  "Tabbio_MainLogoEnglish_Future White",
  "Tabbio_MainLogoEnglish-02.svg",
);
const faviconRoot = path.join(path.dirname(brandRoot), "Favicon");
const blackFaviconPath = path.join(
  faviconRoot,
  "Tabbio_Favicon_Foundation Black",
  "Tabbio_Favicon-01.svg",
);
const whiteFaviconPath = path.join(
  faviconRoot,
  "Tabbio_Favicon_Future White",
  "Tabbio_Favicon-03.svg",
);
const outputDir = path.join(
  root,
  "apps/tabbio-partners/public/brand/badge-options",
);

const stripSvg = (source) =>
  source
    .replace(/^<\?xml[^>]*>\s*/i, "")
    .replace(/<svg[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "");

const [blackSource, whiteSource, blackFaviconSource, whiteFaviconSource] =
  await Promise.all([
  fs.readFile(blackLogoPath, "utf8"),
  fs.readFile(whiteLogoPath, "utf8"),
  fs.readFile(blackFaviconPath, "utf8"),
  fs.readFile(whiteFaviconPath, "utf8"),
  ]);

const blackLogo = stripSvg(blackSource);
const whiteLogo = stripSvg(whiteSource);
const blackFavicon = stripSvg(blackFaviconSource);
const whiteFavicon = stripSvg(whiteFaviconSource);

const wordmark = ({ x, y, width, color = "black" }) => {
  const height = (width * 190.8) / 793.29;
  const content = color === "white" ? whiteLogo : blackLogo;
  return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 793.29 190.8">${content}</svg>`;
};

const favicon = ({ x, y, width, color = "black" }) => {
  const height = (width * 123.09) / 105.81;
  const content = color === "white" ? whiteFavicon : blackFavicon;
  return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 105.81 123.09">${content}</svg>`;
};

const optionA = `
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="168" viewBox="0 0 720 168">
  <!-- THESIS: A credential should look like an official identity lockup, not campaign art. -->
  <!-- OWN-WORLD: Tabbio black, transparent space, one hairline, one literal status word. -->
  <!-- STORY: Recognize Tabbio, then read the holder's relationship: Partner. -->
  <!-- FIRST VIEWPORT: The official wordmark leads; a divider and status complete the line. -->
  <!-- FORM: Unframed horizontal partner lockup, the most portable and familiar direction. -->
  ${wordmark({ x: 76, y: 53, width: 272 })}
  <path d="M384 46V122" stroke="#19181D" stroke-width="2"/>
  <text x="420" y="97" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="600" letter-spacing="-1">Partner</text>
</svg>`;

const optionB = `
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="200" viewBox="0 0 720 200">
  <!-- THESIS: Make the credential self-contained for busy or mixed backgrounds. -->
  <!-- OWN-WORLD: White field, Tabbio black, restrained outline, no ornamental symbol. -->
  <!-- STORY: The container says this is one approved, reusable asset. -->
  <!-- FIRST VIEWPORT: A quiet rectangular badge contains the official lockup and status. -->
  <!-- FORM: Outlined credential, optimized for websites, decks, and email signatures. -->
  <rect x="2" y="2" width="716" height="196" rx="16" fill="#FFFFFF" stroke="#19181D" stroke-width="2"/>
  ${wordmark({ x: 69, y: 67, width: 272 })}
  <path d="M382 61V139" stroke="#19181D" stroke-width="2"/>
  <text x="418" y="113" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="600" letter-spacing="-1">Partner</text>
</svg>`;

const optionC = `
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="200" viewBox="0 0 720 200">
  <!-- THESIS: Offer the same credential for dark or visually dense placements. -->
  <!-- OWN-WORLD: Foundation black field with the official Future White wordmark. -->
  <!-- STORY: The relationship stays clear without competing with the host profile. -->
  <!-- FIRST VIEWPORT: One dark bar, one white lockup, one literal status word. -->
  <!-- FORM: Reversed credential, a sanctioned colorway rather than a separate design. -->
  <rect width="720" height="200" rx="16" fill="#19181D"/>
  ${wordmark({ x: 69, y: 67, width: 272, color: "white" })}
  <path d="M382 61V139" stroke="#FFFFFF" stroke-opacity="0.52" stroke-width="2"/>
  <text x="418" y="113" fill="#FFFFFF" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="600" letter-spacing="-1">Partner</text>
</svg>`;

const optionD = `
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="200" viewBox="0 0 720 200">
  <!-- THESIS: Turn the Tabbio mark into the unmistakable credential anchor. -->
  <!-- OWN-WORLD: A black mark block joins a white identity field with no decoration. -->
  <!-- STORY: Icon first, official name second, relationship directly beneath it. -->
  <!-- FIRST VIEWPORT: The favicon leads at compact size while the full wordmark stays intact. -->
  <!-- FORM: Compact identity badge for profile modules and small digital placements. -->
  <rect x="1" y="1" width="718" height="198" rx="16" fill="#FFFFFF" stroke="#19181D" stroke-width="2"/>
  <path d="M17 1H176V199H17C8.16 199 1 191.84 1 183V17C1 8.16 8.16 1 17 1Z" fill="#19181D"/>
  ${favicon({ x: 55, y: 42, width: 66, color: "white" })}
  ${wordmark({ x: 222, y: 48, width: 264 })}
  <text x="222" y="151" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="600" letter-spacing="-0.8">Partner</text>
</svg>`;

const optionE = `
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="180" viewBox="0 0 720 180">
  <!-- THESIS: Let the partner relationship read as one balanced black-and-white signature. -->
  <!-- OWN-WORLD: Equal visual authority comes from a hard split, not extra symbols. -->
  <!-- STORY: Tabbio owns the dark field; Partner is the calm qualifying status. -->
  <!-- FIRST VIEWPORT: A white official logo and black status sit across a precise divide. -->
  <!-- FORM: Split signature badge for headers, footers, and co-branded materials. -->
  <rect x="1" y="1" width="718" height="178" rx="16" fill="#FFFFFF" stroke="#19181D" stroke-width="2"/>
  <path d="M17 1H430V179H17C8.16 179 1 171.84 1 163V17C1 8.16 8.16 1 17 1Z" fill="#19181D"/>
  ${wordmark({ x: 72, y: 57, width: 286, color: "white" })}
  <text x="505" y="104" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="600" letter-spacing="-1">Partner</text>
</svg>`;

const optionF = `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <!-- THESIS: Make a true square badge without turning the identity into a seal. -->
  <!-- OWN-WORLD: One black tile, official white wordmark, divider, status. -->
  <!-- STORY: The square travels well while the complete Tabbio name remains readable. -->
  <!-- FIRST VIEWPORT: The official wordmark sits above a centered, literal Partner label. -->
  <!-- FORM: Square credential tile for media kits and constrained profile placements. -->
  <rect width="400" height="400" rx="16" fill="#19181D"/>
  ${wordmark({ x: 64, y: 126, width: 272, color: "white" })}
  <path d="M96 229H304" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="2"/>
  <text x="200" y="294" fill="#FFFFFF" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="600" letter-spacing="-1">Partner</text>
</svg>`;

const optionDDark = `
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="200" viewBox="0 0 720 200">
  <rect width="720" height="200" rx="16" fill="#19181D"/>
  <path d="M16 0H176V200H16C7.16 200 0 192.84 0 184V16C0 7.16 7.16 0 16 0Z" fill="#FFFFFF"/>
  ${favicon({ x: 55, y: 42, width: 66 })}
  ${wordmark({ x: 222, y: 48, width: 264, color: "white" })}
  <text x="222" y="151" fill="#FFFFFF" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="600" letter-spacing="-0.8">Partner</text>
</svg>`;

const optionDCompact = `
<svg xmlns="http://www.w3.org/2000/svg" width="520" height="144" viewBox="0 0 520 144">
  <rect x="1" y="1" width="518" height="142" rx="14" fill="#FFFFFF" stroke="#19181D" stroke-width="2"/>
  <path d="M15 1H126V143H15C7.27 143 1 136.73 1 129V15C1 7.27 7.27 1 15 1Z" fill="#19181D"/>
  ${favicon({ x: 43, y: 31, width: 42, color: "white" })}
  ${wordmark({ x: 158, y: 35, width: 190 })}
  <text x="158" y="109" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="600" letter-spacing="-0.5">Partner</text>
</svg>`;

const optionEReverse = `
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="180" viewBox="0 0 720 180">
  <rect x="1" y="1" width="718" height="178" rx="16" fill="#19181D" stroke="#19181D" stroke-width="2"/>
  <path d="M17 1H430V179H17C8.16 179 1 171.84 1 163V17C1 8.16 8.16 1 17 1Z" fill="#FFFFFF"/>
  ${wordmark({ x: 72, y: 57, width: 286 })}
  <text x="505" y="104" fill="#FFFFFF" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="600" letter-spacing="-1">Partner</text>
</svg>`;

const optionECompact = `
<svg xmlns="http://www.w3.org/2000/svg" width="520" height="130" viewBox="0 0 520 130">
  <rect x="1" y="1" width="518" height="128" rx="14" fill="#FFFFFF" stroke="#19181D" stroke-width="2"/>
  <path d="M15 1H310V129H15C7.27 129 1 122.73 1 115V15C1 7.27 7.27 1 15 1Z" fill="#19181D"/>
  ${wordmark({ x: 51, y: 41, width: 208, color: "white" })}
  <text x="356" y="76" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="600" letter-spacing="-0.6">Partner</text>
</svg>`;

const optionFLight = `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect x="1" y="1" width="398" height="398" rx="16" fill="#FFFFFF" stroke="#19181D" stroke-width="2"/>
  ${wordmark({ x: 64, y: 126, width: 272 })}
  <path d="M96 229H304" stroke="#19181D" stroke-opacity="0.5" stroke-width="2"/>
  <text x="200" y="294" fill="#19181D" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="600" letter-spacing="-1">Partner</text>
</svg>`;

const optionFCompact = `
<svg xmlns="http://www.w3.org/2000/svg" width="280" height="280" viewBox="0 0 280 280">
  <rect width="280" height="280" rx="14" fill="#19181D"/>
  ${wordmark({ x: 42, y: 86, width: 196, color: "white" })}
  <path d="M67 162H213" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="2"/>
  <text x="140" y="208" fill="#FFFFFF" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="600" letter-spacing="-0.6">Partner</text>
</svg>`;

await fs.mkdir(outputDir, { recursive: true });

const options = [
  ["option-a-lockup", optionA],
  ["option-b-outline", optionB],
  ["option-c-reverse", optionC],
  ["option-d-identity", optionD],
  ["option-d-identity-dark", optionDDark],
  ["option-d-identity-compact", optionDCompact],
  ["option-e-split", optionE],
  ["option-e-split-reverse", optionEReverse],
  ["option-e-split-compact", optionECompact],
  ["option-f-square", optionF],
  ["option-f-square-light", optionFLight],
  ["option-f-square-compact", optionFCompact],
];

const svgBody = (source) =>
  source
    .replace(/^\s*<svg[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "");

for (const [name, svg] of options) {
  await fs.writeFile(path.join(outputDir, `${name}.svg`), svg.trimStart());
  await sharp(Buffer.from(svg)).png().toFile(path.join(outputDir, `${name}.png`));
}

const previewSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200">
  <rect width="1600" height="1200" fill="#F5F5F7"/>
  <text x="120" y="112" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="54" font-weight="700" letter-spacing="-2">Tabbio Partner badge</text>
  <text x="120" y="158" fill="#66636E" font-family="Inter, Arial, sans-serif" font-size="24">Three practical directions using the official Tabbio logo.</text>

  <text x="120" y="252" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">A</text>
  <text x="162" y="252" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="650">Open lockup</text>
  <text x="1310" y="252" fill="#5A5761" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="20">Profile · portfolio · website</text>
  <rect x="120" y="282" width="1360" height="226" rx="18" fill="#FFFFFF"/>
  <svg x="440" y="311" width="720" height="168" viewBox="0 0 720 168">${svgBody(optionA)}</svg>

  <text x="120" y="594" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">B</text>
  <text x="162" y="594" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="650">Outlined badge</text>
  <text x="1310" y="594" fill="#5A5761" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="20">Email · media kit · deck</text>
  <svg x="440" y="625" width="720" height="200" viewBox="0 0 720 200">${svgBody(optionB)}</svg>

  <text x="120" y="930" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">C</text>
  <text x="162" y="930" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="650">Reverse badge</text>
  <text x="1310" y="930" fill="#5A5761" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="20">Dark backgrounds</text>
  <svg x="440" y="961" width="720" height="200" viewBox="0 0 720 200">${svgBody(optionC)}</svg>
</svg>`;

await fs.writeFile(
  path.join(outputDir, "tabbio-partner-badge-options.svg"),
  previewSvg.trimStart(),
);
await sharp(Buffer.from(previewSvg))
  .png()
  .toFile(path.join(outputDir, "tabbio-partner-badge-options.png"));

const morePreviewSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1780" viewBox="0 0 1800 1780">
  <rect width="1800" height="1780" fill="#F5F5F7"/>
  <text x="120" y="112" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="54" font-weight="700" letter-spacing="-2">Three more directions</text>
  <text x="120" y="158" fill="#66636E" font-family="Inter, Arial, sans-serif" font-size="24">Each direction includes light, dark, and compact applications.</text>

  <text x="120" y="252" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">D</text>
  <text x="162" y="252" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="650">Compact identity</text>
  <text x="1580" y="252" fill="#5A5761" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="20">Profile modules · directories</text>
  <svg x="120" y="286" width="720" height="200" viewBox="0 0 720 200">${svgBody(optionD)}</svg>
  <svg x="900" y="286" width="720" height="200" viewBox="0 0 720 200">${svgBody(optionDDark)}</svg>
  <svg x="120" y="518" width="520" height="144" viewBox="0 0 520 144">${svgBody(optionDCompact)}</svg>

  <text x="120" y="770" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">E</text>
  <text x="162" y="770" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="650">Split signature</text>
  <text x="1580" y="770" fill="#5A5761" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="20">Website · deck · footer</text>
  <svg x="120" y="804" width="720" height="180" viewBox="0 0 720 180">${svgBody(optionE)}</svg>
  <svg x="900" y="804" width="720" height="180" viewBox="0 0 720 180">${svgBody(optionEReverse)}</svg>
  <svg x="120" y="1016" width="520" height="130" viewBox="0 0 520 130">${svgBody(optionECompact)}</svg>

  <text x="120" y="1254" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">F</text>
  <text x="162" y="1254" fill="#19181D" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="650">Square tile</text>
  <text x="1580" y="1254" fill="#5A5761" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="20">Media kit · compact placements</text>
  <svg x="120" y="1288" width="400" height="400" viewBox="0 0 400 400">${svgBody(optionF)}</svg>
  <svg x="580" y="1288" width="400" height="400" viewBox="0 0 400 400">${svgBody(optionFLight)}</svg>
  <svg x="1040" y="1288" width="280" height="280" viewBox="0 0 280 280">${svgBody(optionFCompact)}</svg>
</svg>`;

await fs.writeFile(
  path.join(outputDir, "tabbio-partner-badge-options-2.svg"),
  morePreviewSvg.trimStart(),
);
await sharp(Buffer.from(morePreviewSvg))
  .png()
  .toFile(path.join(outputDir, "tabbio-partner-badge-options-2.png"));

console.log(`Rendered ${options.length} badge directions to ${outputDir}`);
