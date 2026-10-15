import type { Config } from "@react-router/dev/config";

import { vercelPreset } from "@vercel/react-router/vite";

const isVercel = process.env.VERCEL === "1";

export default {
  ssr: true,
  // /contact is intentionally NOT prerendered: its links come from Supabase and are managed in the
  // admin dashboard, so it must be rendered on the server per request.
  prerender: ["/", "/about"],
  presets: isVercel ? [vercelPreset()] : [],
} satisfies Config;
