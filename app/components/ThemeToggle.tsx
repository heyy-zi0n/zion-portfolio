import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 md:w-auto md:h-auto md:p-1.5 grid md:flex place-items-center bg-transparent border-0 md:rounded-md text-[var(--foreground)] transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? <Moon size={15} strokeWidth={1.7} /> : <Sun size={16} strokeWidth={1.6} />}
    </button>
  );
}
