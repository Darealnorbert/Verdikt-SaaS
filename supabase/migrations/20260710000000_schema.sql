-- Utilisateurs (géré par Supabase Auth, on étend avec un profil)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id),
  plan        TEXT DEFAULT 'free',       -- 'free' | 'founder' | 'studio'
  analyses_used INT DEFAULT 0,
  stripe_customer_id TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Analyses d'idées
CREATE TABLE analyses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id),
  idea_text   TEXT NOT NULL,
  score       INT,                        -- 0-100
  verdict     TEXT,                       -- 'build' | 'pivot' | 'kill'
  report      JSONB,                      -- { market_size, competitors[], risks[], action_plan }
  pdf_url     TEXT,                       -- URL Supabase Storage
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Équipes (plan Studio)
CREATE TABLE teams (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name    TEXT,
  owner   UUID REFERENCES profiles(id)
);

CREATE TABLE team_members (
  team_id UUID REFERENCES teams(id),
  user_id UUID REFERENCES profiles(id),
  role    TEXT DEFAULT 'member',
  PRIMARY KEY (team_id, user_id)
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own analyses" ON analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own analyses" ON analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
