import { redirect } from "react-router";
import { createSupabaseServerClient } from "../lib/supabase.server";

/**
 * Ensures the user is authenticated and is an admin.
 * If not, redirects to the login page.
 * Returns the Supabase client and the user session.
 */
export async function requireAdmin(request: Request) {
  const { supabase, headers } = createSupabaseServerClient(request);

  if (!supabase) {
    // If Supabase isn't configured, we redirect to a setup warning or throw an error.
    // For now, we'll throw a 500 so the admin route catches it and displays a setup warning.
    throw new Response("Supabase is not configured.", { status: 500 });
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw redirect("/admin/login", { headers });
  }

  // Verify the user is in the admin_users table via the is_admin() RPC.
  // Note: RLS normally protects data, but we want to explicitly reject unauthorized users from the admin panel.
  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");

  if (rpcError || !isAdmin) {
    // Optionally log them out if they are not an admin
    await supabase.auth.signOut();
    throw redirect("/admin/login?error=unauthorized", { headers });
  }

  return { supabase, session, headers };
}

/**
 * Checks if a user is logged in, but does not enforce it (used for login page redirection).
 */
export async function checkSession(request: Request) {
  const { supabase, headers } = createSupabaseServerClient(request);
  if (!supabase) return { session: null, headers };

  const { data: { session } } = await supabase.auth.getSession();
  return { session, headers, supabase };
}
