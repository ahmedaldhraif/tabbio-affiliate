import crypto from "node:crypto";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const root = process.cwd();
const require = createRequire(
  path.join(root, "apps/tabbio-partners/package.json"),
);
const JSZip = require("jszip");
const sharp = require(
  path.join(root, "node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js"),
);

const brandRoot = path.join(root, "apps/tabbio-partners/public/brand");
const kitRoot = path.join(brandRoot, "partner-badges/2026");
const guidelinePath = path.join(brandRoot, "partner-badge-guidelines.md");

const badges = [
  {
    id: "stacked",
    name: "Tabbio Active Partner 2026 — stacked",
    source:
      "C:/Users/DESKTOP PC/Downloads/Frame 1984078168 (1).svg",
    width: 942,
    height: 526,
    use: "Profile credentials, media kits, proposals, LinkedIn Featured, and social announcements",
  },
  {
    id: "horizontal",
    name: "Tabbio Active Partner 2026 — horizontal",
    source: "C:/Users/DESKTOP PC/Downloads/Frame 1984078169.svg",
    width: 1658,
    height: 303,
    use: "Websites, email signatures, CVs, portfolios, presentations, and document footers",
  },
];

const sha256 = (buffer) =>
  crypto.createHash("sha256").update(buffer).digest("hex").toUpperCase();

const manifestAssets = [];
const packagedFiles = [];
await fs.mkdir(kitRoot, { recursive: true });

for (const badge of badges) {
  const source = await fs.readFile(badge.source);
  const basename = `tabbio-active-partner-2026-${badge.id}`;
  const files = {
    svg: `${basename}.svg`,
    png: `${basename}.png`,
    png2x: `${basename}@2x.png`,
    webp: `${basename}-preview.webp`,
  };

  await fs.writeFile(path.join(kitRoot, files.svg), source);
  await sharp(source, { density: 96 })
    .resize({ width: badge.width })
    .png()
    .toFile(path.join(kitRoot, files.png));
  await sharp(source, { density: 192 })
    .resize({ width: badge.width * 2 })
    .png()
    .toFile(path.join(kitRoot, files.png2x));
  await sharp(source, { density: 96 })
    .resize({ width: badge.width })
    .webp({ quality: 88, smartSubsample: true })
    .toFile(path.join(kitRoot, files.webp));

  const exports = {};
  for (const [format, filename] of Object.entries(files)) {
    const contents = await fs.readFile(path.join(kitRoot, filename));
    packagedFiles.push(filename);
    exports[format] = {
      filename,
      bytes: contents.byteLength,
      sha256: sha256(contents),
    };
  }

  manifestAssets.push({
    id: badge.id,
    name: badge.name,
    use: badge.use,
    dimensions: { width: badge.width, height: badge.height },
    aspectRatio: Number((badge.width / badge.height).toFixed(3)),
    exports,
  });
}

const guidelines = await fs.readFile(guidelinePath);
await fs.writeFile(path.join(kitRoot, "GUIDELINES.md"), guidelines);
packagedFiles.push("GUIDELINES.md");

const manifest = {
  name: "Tabbio Active Partner 2026 badge kit",
  version: "2026.2",
  status: "Approved artwork; production program and legal approval still required",
  issuedFor: "Active Tabbio Partner Program participants",
  validYear: 2026,
  altText: "Tabbio Active Partner 2026",
  assets: manifestAssets,
  guidelines: "GUIDELINES.md",
};
const manifestContents = `${JSON.stringify(manifest, null, 2)}\n`;
await fs.writeFile(path.join(kitRoot, "manifest.json"), manifestContents);
packagedFiles.push("manifest.json");

const zip = new JSZip();
const archiveDate = new Date(Date.UTC(2026, 0, 1, 0, 0, 0));
for (const filename of packagedFiles) {
  zip.file(filename, await fs.readFile(path.join(kitRoot, filename)), {
    date: archiveDate,
  });
}
const archive = await zip.generateAsync({
  type: "nodebuffer",
  compression: "DEFLATE",
  compressionOptions: { level: 9 },
});
await fs.writeFile(
  path.join(brandRoot, "tabbio-active-partner-2026-badge-kit.zip"),
  archive,
);

console.log(
  JSON.stringify(
    {
      output: kitRoot,
      archiveBytes: archive.byteLength,
      assets: manifestAssets,
    },
    null,
    2,
  ),
);
