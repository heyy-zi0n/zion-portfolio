import type { Route } from "./+types/sitemap";
import { getPublishedProjects } from "../services/portfolio.server";
import { CANONICAL_ORIGIN } from "../lib/meta";

export async function loader({ request }: Route.LoaderArgs) {
  const projects = await getPublishedProjects(request);

  const staticPages = [
    { loc: `${CANONICAL_ORIGIN}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${CANONICAL_ORIGIN}/about`, changefreq: "monthly", priority: "0.8" },
    { loc: `${CANONICAL_ORIGIN}/projects`, changefreq: "weekly", priority: "0.9" },
    { loc: `${CANONICAL_ORIGIN}/experience`, changefreq: "monthly", priority: "0.8" },
    { loc: `${CANONICAL_ORIGIN}/contact`, changefreq: "monthly", priority: "0.8" },
  ];

  const projectUrls = projects.map((p) => {
    const rawDate = p.updatedAt || p.publishedAt || p.createdAt;
    let lastmodTag = "";
    if (rawDate) {
      try {
        const formatted = new Date(rawDate).toISOString().split("T")[0];
        lastmodTag = `\n    <lastmod>${formatted}</lastmod>`;
      } catch {
        // Ignore invalid dates
      }
    }
    return `  <url>
    <loc>${CANONICAL_ORIGIN}/projects/${encodeURIComponent(p.slug)}</loc>${lastmodTag}
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  const staticUrls = staticPages.map(
    (page) => `  <url>
    <loc>${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.join("\n")}
${projectUrls.join("\n")}
</urlset>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
