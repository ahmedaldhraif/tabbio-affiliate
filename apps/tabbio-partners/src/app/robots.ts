import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/partners", "/partners/terms", "/llms.txt"],
      disallow: ["/partner/", "/r/"],
    },
    sitemap: "https://www.tabbio.com/sitemap.xml",
  };
}
