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

const exportedLogos =
  "C:/Users/DESKTOP PC/OneDrive/Tabbio Main 2025/tabbio last brand/Makeamark_Tabbio (Updated)/Base Assets/Tabbio — Exported Logos";
const blackWordmarkPath = path.join(
  exportedLogos,
  "Main Logo English/Tabbio_MainLogoEnglish_Foundation Black/Tabbio_MainLogoEnglish-01.svg",
);
const whiteWordmarkPath = path.join(
  exportedLogos,
  "Main Logo English/Tabbio_MainLogoEnglish_Future White/Tabbio_MainLogoEnglish-02.svg",
);
const blackMarkPath = path.join(
  exportedLogos,
  "Favicon/Tabbio_Favicon_Foundation Black/Tabbio_Favicon-01.svg",
);
const whiteMarkPath = path.join(
  exportedLogos,
  "Favicon/Tabbio_Favicon_Future White/Tabbio_Favicon-03.svg",
);

const outputRoot = path.join(
  root,
  "apps/tabbio-partners/public/brand/partner-credential",
);
const expectedOutputRoot = path.resolve(
  root,
  "apps/tabbio-partners/public/brand/partner-credential",
);
const compatibilityRoot = path.join(root, "apps/tabbio-partners/public/brand");

const stripSvg = (source) =>
  source
    .replace(/^<\?xml[^>]*>\s*/i, "")
    .replace(/<svg[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "");

const [
  blackWordmarkSource,
  whiteWordmarkSource,
  blackMarkSource,
  whiteMarkSource,
] = await Promise.all([
  fs.readFile(blackWordmarkPath, "utf8"),
  fs.readFile(whiteWordmarkPath, "utf8"),
  fs.readFile(blackMarkPath, "utf8"),
  fs.readFile(whiteMarkPath, "utf8"),
]);

const marks = {
  blackWordmark: stripSvg(blackWordmarkSource),
  whiteWordmark: stripSvg(whiteWordmarkSource),
  blackMark: stripSvg(blackMarkSource),
  whiteMark: stripSvg(whiteMarkSource),
};

const wordmark = ({ x, y, width, tone }) => {
  const height = (width * 190.8) / 793.29;
  const content = tone === "white" ? marks.whiteWordmark : marks.blackWordmark;
  return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 793.29 190.8">${content}</svg>`;
};

const mark = ({ x, y, width, tone }) => {
  const height = (width * 123.09) / 105.81;
  const content = tone === "white" ? marks.whiteMark : marks.blackMark;
  return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 105.81 123.09">${content}</svg>`;
};

const roles = [
  { slug: "partner", label: "Partner", alt: "Tabbio Partner, active 2026" },
  {
    slug: "creator",
    label: "Creator Partner",
    alt: "Tabbio Creator Partner, active 2026",
  },
  {
    slug: "career",
    label: "Career Partner",
    alt: "Tabbio Career Partner, active 2026",
  },
  {
    slug: "agency",
    label: "Agency Partner",
    alt: "Tabbio Agency Partner, active 2026",
  },
];

const colorways = {
  color: {
    tile: "#5A2AFF",
    tileMark: "white",
    wordmark: "black",
    text: "#19181D",
    rule: "#19181D",
  },
  black: {
    tile: "#19181D",
    tileMark: "white",
    wordmark: "black",
    text: "#19181D",
    rule: "#19181D",
  },
  white: {
    tile: "#FFFFFF",
    tileMark: "black",
    wordmark: "white",
    text: "#FFFFFF",
    rule: "#FFFFFF",
  },
};

const contract = `
  <!-- THESIS: Partner status is an institutional credential lockup, never campaign decoration. -->
  <!-- OWN-WORLD: Official Tabbio artwork, one emblem field, one rule, and literal status copy. -->
  <!-- STORY: Tabbio identity leads; approved role and current active year complete the credential. -->
  <!-- FIRST VIEWPORT: Mark left, wordmark and role right, annual status aligned as the final proof line. -->
  <!-- FORM: Transparent horizontal lockup inspired by professional membership systems, adapted to Tabbio. -->`;

const horizontalSvg = (role, palette) => `
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${role.alt}" width="900" height="300" viewBox="0 0 900 300">
  <title>${role.alt}</title>${contract}
  <rect x="20" y="30" width="210" height="240" rx="14" fill="${palette.tile}"/>
  ${mark({ x: 83, y: 76, width: 84, tone: palette.tileMark })}
  ${wordmark({ x: 282, y: 42, width: 286, tone: palette.wordmark })}
  <path d="M282 129H860" stroke="${palette.rule}" stroke-width="3"/>
  <text x="282" y="212" fill="${palette.text}" font-family="Inter, Arial, sans-serif" font-size="52" font-weight="700" letter-spacing="-1.4">${role.label}</text>
  <text x="860" y="263" fill="${palette.text}" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="600" letter-spacing="-0.3">Active 2026</text>
</svg>`;

const compactSvg = (role, palette) => `
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${role.alt}" width="660" height="200" viewBox="0 0 660 200">
  <title>${role.alt}</title>${contract}
  <rect x="12" y="20" width="142" height="160" rx="12" fill="${palette.tile}"/>
  ${mark({ x: 55, y: 52, width: 56, tone: palette.tileMark })}
  ${wordmark({ x: 194, y: 25, width: 216, tone: palette.wordmark })}
  <path d="M194 91H640" stroke="${palette.rule}" stroke-width="2"/>
  <text x="194" y="139" fill="${palette.text}" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="-0.9">${role.label}</text>
  <text x="640" y="176" fill="${palette.text}" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="600">Active 2026</text>
</svg>`;

const socialSvg = (role) => `
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${role.alt}" width="1080" height="1080" viewBox="0 0 1080 1080">
  <title>${role.alt}</title>
  <rect width="1080" height="1080" fill="#5A2AFF"/>
  <rect x="118" y="152" width="238" height="272" rx="16" fill="#FFFFFF"/>
  ${mark({ x: 190, y: 214, width: 96, tone: "black" })}
  ${wordmark({ x: 118, y: 528, width: 420, tone: "white" })}
  <path d="M118 662H962" stroke="#FFFFFF" stroke-width="4"/>
  <text x="118" y="780" fill="#FFFFFF" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="700" letter-spacing="-2">${role.label}</text>
  <text x="962" y="904" fill="#FFFFFF" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="600">Active 2026</text>
</svg>`;

const generated = [];

if (path.resolve(outputRoot) !== expectedOutputRoot) {
  throw new Error(`Refusing to clean unexpected output path: ${outputRoot}`);
}
await fs.rm(outputRoot, { recursive: true, force: true });

const writeAsset = async ({ role, colorway, layout, svg }) => {
  const directory = path.join(outputRoot, role.slug, colorway);
  await fs.mkdir(directory, { recursive: true });
  const roleName =
    role.slug === "partner" ? "tabbio-partner" : `tabbio-${role.slug}-partner`;
  const basename = `${roleName}-${layout}-${colorway}`;
  const svgPath = path.join(directory, `${basename}.svg`);
  const pngPath = path.join(directory, `${basename}.png`);
  await fs.writeFile(svgPath, svg.trimStart());
  await sharp(Buffer.from(svg)).png().toFile(pngPath);
  const [svgStat, pngStat] = await Promise.all([
    fs.stat(svgPath),
    fs.stat(pngPath),
  ]);
  generated.push({
    role: role.slug,
    label: role.label,
    colorway,
    layout,
    svg: path.relative(outputRoot, svgPath).replaceAll("\\", "/"),
    png: path.relative(outputRoot, pngPath).replaceAll("\\", "/"),
    svgBytes: svgStat.size,
    pngBytes: pngStat.size,
  });
  return { svgPath, pngPath };
};

let compatibilityBadge;
let compatibilitySocial;

for (const role of roles) {
  for (const [colorway, palette] of Object.entries(colorways)) {
    const horizontal = await writeAsset({
      role,
      colorway,
      layout: "horizontal",
      svg: horizontalSvg(role, palette),
    });
    await writeAsset({
      role,
      colorway,
      layout: "compact",
      svg: compactSvg(role, palette),
    });
    if (role.slug === "partner" && colorway === "color") {
      compatibilityBadge = horizontal;
    }
  }
  const social = await writeAsset({
    role,
    colorway: "color",
    layout: "social",
    svg: socialSvg(role),
  });
  if (role.slug === "partner") compatibilitySocial = social;
}

if (!compatibilityBadge || !compatibilitySocial) {
  throw new Error("Universal credential aliases were not generated.");
}

await Promise.all([
  fs.copyFile(
    compatibilityBadge.svgPath,
    path.join(compatibilityRoot, "tabbio-partner-badge.svg"),
  ),
  fs.copyFile(
    compatibilityBadge.pngPath,
    path.join(compatibilityRoot, "tabbio-partner-badge.png"),
  ),
  fs.copyFile(
    compatibilitySocial.svgPath,
    path.join(compatibilityRoot, "tabbio-partner-social-card.svg"),
  ),
  fs.copyFile(
    compatibilitySocial.pngPath,
    path.join(compatibilityRoot, "tabbio-partner-social-card.png"),
  ),
]);

const manifest = {
  name: "Tabbio Partner Credential System",
  version: "2026.1-prototype",
  status: "Frontend prototype; production brand and legal approval required",
  activeYear: 2026,
  roles: roles.map(({ slug, label }) => ({ slug, label })),
  colorways: {
    color: "Preferred on light neutral backgrounds",
    black: "Monochrome use on light backgrounds",
    white: "Use only on dark, uncluttered backgrounds",
  },
  layouts: {
    horizontal: "Websites, proposals, media kits, and presentations",
    compact: "Email signatures, compact profile modules, and footers",
    social: "Announcement posts and Featured media; never an avatar",
  },
  verification:
    "Production digital badges should link to the partner's public Tabbio status page. No verification service is connected in this frontend prototype.",
  assets: generated,
};

await fs.writeFile(
  path.join(outputRoot, "credential-system.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`Rendered ${generated.length} credential assets to ${outputRoot}`);
