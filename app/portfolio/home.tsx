import { Link } from "react-router";
import { generateMeta } from "../lib/meta";

export function meta() {
  return generateMeta(
    "Zion-faith Pelumi Omosanya — Software Developer",
    "Portfolio of Zion-faith Pelumi Omosanya, a software developer in Lagos building responsive web experiences and practical software systems."
  );
}

export default function Home() {
  return (
    <div className="flex flex-col justify-center min-h-[50vh] gap-6 animate-in fade-in duration-500">
      <p className="text-xl md:text-2xl font-light leading-tight text-[var(--foreground)]">
        Hi, I’m <Link to="/about" className="link-highlight font-medium">Zion-faith Pelumi Omosanya</Link>, a <span className="font-semibold">Software Developer</span> turning ideas into thoughtful <Link to="/projects" className="link-highlight font-medium">web experiences</Link> and practical software systems.
      </p>
      
      <p className="text-[var(--muted-foreground)] text-sm md:text-base font-light leading-relaxed">
        Currently studying Computer Science at LASU FCIT while building across <Link to="/experience" className="link-highlight font-medium">frontend development</Link>, PHP/MySQL applications, and Python/Flask systems.
      </p>
    </div>
  );
}
