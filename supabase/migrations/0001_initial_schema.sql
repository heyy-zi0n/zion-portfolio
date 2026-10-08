-- Enums
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');

-- Admin Users Table
CREATE TABLE admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Admin Check Function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$;

-- Projects Table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  full_title text,
  description text NOT NULL,
  problem text,
  outcome text,
  technologies text[] NOT NULL DEFAULT '{}',
  decisions jsonb NOT NULL DEFAULT '[]',
  system_flow jsonb NOT NULL DEFAULT '[]',
  image_path text,
  repository_url text,
  live_url text,
  status content_status NOT NULL DEFAULT 'draft',
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Experiences Table
CREATE TABLE experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization text NOT NULL,
  role text NOT NULL,
  organization_url text,
  start_date date,
  end_date date,
  is_current boolean NOT NULL DEFAULT false,
  highlights text[] NOT NULL DEFAULT '{}',
  status content_status NOT NULL DEFAULT 'draft',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Site Settings Table
CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_path text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Media Assets Table
CREATE TABLE media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text UNIQUE NOT NULL,
  file_name text NOT NULL,
  mime_type text NOT NULL,
  file_size bigint,
  alt_text text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Updated_at Trigger Function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply Triggers
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS Configuration
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Admin Users Policies
CREATE POLICY "Admins can read admin_users" ON admin_users FOR SELECT TO authenticated USING (is_admin());

-- Projects Policies
CREATE POLICY "Public can view published projects" ON projects FOR SELECT TO public USING (status = 'published');
CREATE POLICY "Admins can view all projects" ON projects FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can insert projects" ON projects FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update projects" ON projects FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete projects" ON projects FOR DELETE TO authenticated USING (is_admin());

-- Experiences Policies
CREATE POLICY "Public can view published experiences" ON experiences FOR SELECT TO public USING (status = 'published');
CREATE POLICY "Admins can view all experiences" ON experiences FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can insert experiences" ON experiences FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update experiences" ON experiences FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete experiences" ON experiences FOR DELETE TO authenticated USING (is_admin());

-- Site Settings Policies
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT TO public USING (true);
CREATE POLICY "Admins can modify site settings" ON site_settings FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Media Assets Policies
CREATE POLICY "Admins can view media metadata" ON media_assets FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can insert media metadata" ON media_assets FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update media metadata" ON media_assets FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete media metadata" ON media_assets FOR DELETE TO authenticated USING (is_admin());

-- Storage Bucket Setup (Handled via SQL if possible, otherwise Supabase Dashboard)
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-media', 'portfolio-media', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public can view portfolio media" ON storage.objects FOR SELECT TO public USING (bucket_id = 'portfolio-media');
CREATE POLICY "Admins can upload portfolio media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-media' AND is_admin());
CREATE POLICY "Admins can update portfolio media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-media' AND is_admin());
CREATE POLICY "Admins can delete portfolio media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-media' AND is_admin());
