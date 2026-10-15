import { Link } from "react-router";
import { generateMeta } from "../lib/meta";
import { generatePersonSchema, generateWebsiteSchema } from "../lib/schema";
import { getVisibleSocialLinks } from "../services/portfolio.server";
import { getProfileUrls } from "../lib/social-links";
import type { Route } from "./+types/home";

export async function loader({ request }: Route.LoaderArgs) {
  const links = await getVisibleSocialLinks(request);
  const profileUrls = getProfileUrls(links);
  return { profileUrls };
}

export function meta({ data }: Route.MetaArgs) {
  const profileUrls = data?.profileUrls;
  return generateMeta(
    "Zion-faith Pelumi Omosanya | Software Developer",
    "Explore the portfolio of Zion-faith Pelumi Omosanya, a software developer and Computer Science student at Lagos State University, building web applications, frontend experiences and practical software systems.",
    {
      path: "/",
      schema: [
        generatePersonSchema({ profileUrls }),
        generateWebsiteSchema(),
      ],
    }
  );
}

export default function Home() {
  return (
    <div className="flex flex-col justify-center min-h-[50vh] gap-6 animate-in fade-in duration-500">
      <p className="text-xl md:text-2xl font-light leading-tight text-[var(--foreground)]">
        Hi, I’m <Link to="/about" className="link-highlight font-medium">Zion-faith Pelumi Omosanya</Link>, a <span className="font-semibold">Software Developer</span> turning ideas into thoughtful <Link to="/projects" className="link-highlight font-medium">web experiences</Link> and practical software systems.
      </p>
      
      <p className="text-[var(--muted-foreground)] text-sm md:text-base font-light leading-relaxed">
        Currently studying Computer Science at <a href="https://lasu.infy.click/" target="_blank" rel="noopener noreferrer" className="link-highlight font-medium">LASU FCIT</a> while building across <Link to="/experience" className="link-highlight font-medium">frontend development</Link>, PHP/MySQL applications, and Python/Flask systems.
      </p>

      <div className="mt-1 flex flex-col gap-2.5 md:hidden">
        <span className="text-sm font-semibold text-[var(--foreground)] opacity-90">Explore</span>
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link to="/about" className="link-sweep text-[var(--foreground)] opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm">about</Link>
          <span className="text-[var(--foreground)] opacity-30 select-none">·</span>
          <Link to="/projects" className="link-sweep text-[var(--foreground)] opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm">projects</Link>
          <span className="text-[var(--foreground)] opacity-30 select-none">·</span>
          <Link to="/experience" className="link-sweep text-[var(--foreground)] opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm">career</Link>
          <span className="text-[var(--foreground)] opacity-30 select-none">·</span>
          <Link to="/contact" className="link-sweep text-[var(--foreground)] opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm">connect</Link>
        </nav>
      </div>
    </div>
  );
}
