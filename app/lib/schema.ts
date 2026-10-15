import { CANONICAL_ORIGIN } from "./meta";

export interface PersonSchemaOptions {
  profileUrls?: string[];
}

/**
 * Valid Schema.org Person markup representing the portfolio owner.
 * Strictly reflects verified information from the visible site and Connect CMS.
 */
export function generatePersonSchema(options: PersonSchemaOptions = {}) {
  const defaultProfiles = [
    "https://github.com/heyy-zi0n",
    "https://www.fiverr.com/ziondatapro",
  ];
  const sameAs = options.profileUrls && options.profileUrls.length > 0
    ? options.profileUrls
    : defaultProfiles;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${CANONICAL_ORIGIN}/#person`,
    name: "Zion-faith Pelumi Omosanya",
    alternateName: ["Zion-faith Omosanya", "heyy.zion", "heyy-zi0n"],
    url: `${CANONICAL_ORIGIN}/`,
    jobTitle: "Software Developer",
    description:
      "Software developer and Computer Science student at Lagos State University building web applications, frontend experiences, and practical software systems.",
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Lagos State University",
      alternateName: "LASU FCIT",
      url: "https://lasu.infy.click/",
    },
    sameAs,
    knowsAbout: [
      "Software Development",
      "Frontend Engineering",
      "Web Applications",
      "React",
      "TypeScript",
      "JavaScript",
      "PHP",
      "MySQL",
      "Python",
      "Flask",
      "Tailwind CSS",
    ],
  };
}

/**
 * Valid Schema.org WebSite markup linking to the author person.
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${CANONICAL_ORIGIN}/#website`,
    url: `${CANONICAL_ORIGIN}/`,
    name: "Zion-faith Pelumi Omosanya",
    description:
      "Portfolio of Zion-faith Pelumi Omosanya, software developer building web applications and practical systems.",
    publisher: {
      "@id": `${CANONICAL_ORIGIN}/#person`,
    },
  };
}

/**
 * Valid Schema.org BreadcrumbList markup for inner pages.
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; path?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: `${CANONICAL_ORIGIN}${item.path.startsWith("/") ? item.path : `/${item.path}`}` } : {}),
    })),
  };
}
