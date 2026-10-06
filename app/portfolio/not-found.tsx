import { Link } from "react-router";
import { generateMeta } from "../lib/meta";

export function meta() {
  return generateMeta("Not Found", "This page doesn't exist.");
}

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center min-h-[50vh] gap-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-light text-[var(--foreground)]">404</h1>
      
      <p className="text-[var(--muted-foreground)] font-light">
        This page doesn't exist.
      </p>
      
      <div>
        <Link to="/" className="link-sweep text-[var(--foreground)] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] rounded-sm">
          go home
        </Link>
      </div>
    </div>
  );
}
