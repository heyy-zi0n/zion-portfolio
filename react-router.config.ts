import type { Config } from "@react-router/dev/config";

import { vercelPreset } from "@vercel/react-router/vite";

const isVercel = process.env.VERCEL === "1";

export default {
  ssr: true,
  prerender: ["/", "/about", "/contact"],
  presets: isVercel ? [vercelPreset()] : [],
} satisfies Config;
