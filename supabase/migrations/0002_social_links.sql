-- Social / contact links shown on the public Connect page (/contact)
CREATE TABLE social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  label text NOT NULL,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT social_links_platform_check CHECK (platform IN (
    'github', 'linkedin', 'instagram', 'tiktok', 'x', 'youtube',
    'facebook', 'whatsapp', 'fiverr', 'email', 'website', 'other'
  )),
  CONSTRAINT social_links_label_check CHECK (char_length(btrim(label)) BETWEEN 1 AND 80),
  -- Only https: and mailto: are allowed; blocks javascript:, data:, etc.
  CONSTRAINT social_links_url_check CHECK (
    char_length(url) <= 2048 AND url ~* '^(https://|mailto:)[^[:space:]]+$'
  ),
  -- Prevents duplicate rows when the seed is re-run
  CONSTRAINT social_links_url_key UNIQUE (url)
);

CREATE INDEX social_links_sort_order_idx ON social_links (sort_order);

CREATE TRIGGER social_links_updated_at BEFORE UPDATE ON social_links FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible social links" ON social_links FOR SELECT TO public USING (is_visible = true);
CREATE POLICY "Admins can view all social links" ON social_links FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can insert social links" ON social_links FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update social links" ON social_links FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can delete social links" ON social_links FOR DELETE TO authenticated USING (is_admin());
