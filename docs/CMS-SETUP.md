# CMS Setup for Zion's Portfolio

This document outlines the exact steps to configure the Supabase backend for the portfolio CMS.
The CMS allows secure management of projects, career experience, media uploads, and the CV, replacing hardcoded static files.

## 1. Create Supabase Project
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Choose a strong database password and keep it secure.
3. Wait for the database provisioning to complete.

## 2. Configure Environment Variables
Copy the `URL` and `anon key` from your Supabase project settings (**Settings > API**).

In the root of your local project, create a `.env` file (never commit this file) with the following content:

```env
SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
```

Also, update the `.env.example` file to reflect these required variables without exposing actual secrets.

## 3. Apply Migrations
Run the SQL migration script to build the schema.
You can execute this via the Supabase SQL Editor in your dashboard, or by using the Supabase CLI:

1. Open the Supabase dashboard's **SQL Editor**.
2. Create a new query and paste the contents of `supabase/migrations/0001_initial_schema.sql`.
3. Click **Run**.
4. Repeat for `supabase/seed.sql` to populate initial portfolio data.

## 4. Create First Auth User
1. Go to **Authentication > Users** in the Supabase dashboard.
2. Click **Add user > Create new user**.
3. Enter your email and a strong password. Note this password—it is your admin login.

## 5. Copy That User's UUID
After creating the user, copy their unique **User UID** from the table row in the dashboard.

## 6. Insert UUID into `admin_users`
To grant this user CMS access, they must be registered as an admin.
1. Go to the **SQL Editor**.
2. Run the following command (replace `<YOUR-UUID-HERE>` with the copied UID):

```sql
INSERT INTO admin_users (user_id) VALUES ('<YOUR-UUID-HERE>');
```

## 7. Configure Storage
The migration script attempts to automatically create the `portfolio-media` storage bucket and its policies.
To verify:
1. Go to **Storage** in the Supabase dashboard.
2. Ensure the `portfolio-media` bucket exists and is marked as Public.
3. If it doesn't exist, create it manually and name it `portfolio-media` (Public: Yes).

## 8. Disable Public Signups (CRITICAL SECURITY STEP)
To prevent unauthorized users from creating accounts on your database:
1. Go to **Authentication > Providers** in the Supabase dashboard.
2. Open the **Email** provider settings.
3. Toggle off **Enable Signups** (or uncheck "Allow new users to sign up").
4. Click **Save**.

## 9. Run Locally
Run your local development server to test:

```bash
npm run dev
```

Visit `http://localhost:5173/admin/login` and log in with the email and password you created in Step 4.
The public portfolio will dynamically read from the database now that your `.env` is configured.

## 10. Configure Vercel Env Vars
1. Go to your project on Vercel.
2. Navigate to **Settings > Environment Variables**.
3. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` with your production project's values.
4. Redeploy the project on Vercel.

## 11. Configure Render Env Vars
1. Go to your web service on Render.
2. Navigate to **Environment**.
3. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
4. Trigger a manual deploy on Render.

## 12. Verify Implementation
1. **Admin Login**: Visit `/admin/login` on production and log in.
2. **Public Content**: Ensure the homepage, projects, and career pages load correctly using database data.
3. **Remove Reliance on Fallback**: Once you are fully confident the CMS is working perfectly in production, you can choose to remove the `app/data/static-fallback.ts` reliance, although it's safe to keep as a failsafe.
