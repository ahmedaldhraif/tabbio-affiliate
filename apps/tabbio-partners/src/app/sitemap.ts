import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.tabbio.com/partners",
      lastModified: new Date("2026-08-09"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.tabbio.com/partners/terms",
      lastModified: new Date("2026-08-09"),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}
