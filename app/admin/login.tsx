import { Form, redirect, useActionData, useNavigation } from "react-router";
import { checkSession } from "../services/auth.server";
import { createSupabaseServerClient } from "../lib/supabase.server";
import type { Route } from "./+types/login";
import { generateMeta } from "../lib/meta";

export function meta() {
  return generateMeta("Admin Login", "Sign in to the CMS");
}

export async function loader({ request }: Route.LoaderArgs) {
  const { session } = await checkSession(request);
  if (session) {
    return redirect("/admin");
  }
  return null;
}

// Simple in-memory rate limiter for login attempts (works in production Node.js)
// In a serverless environment (e.g. Vercel), this only limits per-instance, 
// but it still provides a basic layer of defense alongside Supabase's native limits.
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // Rate Limiting Logic (Max 5 attempts per 15 minutes per IP/Email)
  const ip = request.headers.get("x-forwarded-for") || "unknown-ip";
  const rateLimitKey = `${ip}-${email}`;
  const now = Date.now();
  const attemptRecord = loginAttempts.get(rateLimitKey);

  if (attemptRecord) {
    if (now > attemptRecord.resetAt) {
      // Time passed, reset
      loginAttempts.delete(rateLimitKey);
    } else if (attemptRecord.count >= 5) {
      // Blocked
      const minutesLeft = Math.ceil((attemptRecord.resetAt - now) / 1000 / 60);
      return { error: `Too many login attempts. Please try again in ${minutesLeft} minutes.` };
    }
  }

  const { supabase, headers } = createSupabaseServerClient(request);
  if (!supabase) {
    return { error: "Database configuration is missing. Check your environment variables." };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    // Record failed attempt
    const current = loginAttempts.get(rateLimitKey);
    loginAttempts.set(rateLimitKey, {
      count: (current?.count || 0) + 1,
      resetAt: current?.resetAt || now + 15 * 60 * 1000 // 15 minutes from first failure
    });
    return { error: "Invalid login credentials." };
  }

  // Double check admin role
  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
  if (rpcError || !isAdmin) {
    await supabase.auth.signOut();
    return { error: "Unauthorized account." };
  }

  // Successful login, clear attempts
  loginAttempts.delete(rateLimitKey);

  return redirect("/admin", { headers });
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col text-center space-y-2">
          <h1 className="text-xl font-medium tracking-tight text-[var(--foreground)]">
            heyy.zion / admin
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Sign in to manage the portfolio
          </p>
        </div>

        <Form method="post" className="flex flex-col gap-5">
          {actionData?.error && (
            <div className="bg-red-500/10 text-red-500 text-sm px-3 py-2 rounded-md border border-red-500/20 text-center">
              {actionData.error}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full bg-[var(--muted)]/50 border border-[var(--border)] rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 transition-all"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full bg-[var(--muted)]/50 border border-[var(--border)] rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[var(--foreground)] text-[var(--background)] rounded-md py-2 text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </Form>
      </div>
    </div>
  );
}
