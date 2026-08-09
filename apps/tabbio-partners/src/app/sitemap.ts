import type { MetadataRoute } from "next";

import { programDocuments } from "@/data/program-policy";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const policies: MetadataRoute.Sitemap = programDocuments.map((document) => ({
    url: `https://www.tabbio.com/partners/policies/${document.slug}`,
    lastModified: new Date("2026-08-10"),
    changeFrequency: "monthly",
    priority: 0.3,
  }));

  return [
    {
      url: "https://www.tabbio.com/partners",
      lastModified: new Date("2026-08-09"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.tabbio.com/partners/policies",
      lastModified: new Date("2026-08-10"),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...policies,
  ];
}
