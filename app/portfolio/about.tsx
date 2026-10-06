import { Link } from "react-router";
import { Breadcrumb } from "../components/Breadcrumb";
import { generateMeta } from "../lib/meta";

export function meta() {
  return generateMeta(
    "About — Zion-faith Pelumi Omosanya",
    "Learn about Zion-faith Pelumi Omosanya, a software developer focused on web applications and frontend engineering."
  );
}

export default function About() {
  return (
    <div className="animate-in fade-in duration-500 slide-in-from-bottom-2">
      <Breadcrumb items={[{ label: "home", href: "/" }, { label: "about me" }]} />
      
      <div className="flex flex-col gap-6 text-[var(--muted-foreground)] text-sm md:text-base font-light leading-relaxed">
        <p>
          I am <span className="text-[var(--foreground)] font-medium">Zion-faith Pelumi Omosanya</span>, a Software Developer focused primarily on web applications and frontend engineering.
        </p>
        
        <p>
          My interest started with frontend development and expanded into building complete software systems using PHP, MySQL and Python/Flask.
        </p>
        
        <p>
          I study Computer Science at LASU FCIT and gained practical experience during my FCIT internship, where I assisted HTML/CSS/jQuery practical sessions and worked on responsive web development.
        </p>
        
        <p>
          I build examination workflow systems, school management software, context-aware image enhancement systems, and responsive frontend websites. You can view these in my <Link to="/projects" className="link-highlight text-[var(--foreground)] font-medium">projects</Link>.
        </p>
        
        <p>
          I currently work with HTML5, CSS3, JavaScript, TypeScript, Tailwind CSS, PHP, MySQL, PDO, React, Next.js, Python, Flask, Git/GitHub, and basic jQuery.
        </p>
        
        <p>
          If you have an idea you'd like to discuss or a project that needs a developer, feel free to <Link to="/contact" className="link-highlight text-[var(--foreground)] font-medium">connect</Link>.
        </p>
      </div>
    </div>
  );
}
