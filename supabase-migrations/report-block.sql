-- Report and Block tables for Rabbit App
-- Run in Supabase SQL Editor after main deployment

-- Report (post reports)
CREATE TABLE IF NOT EXISTS "Report" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES "Post"(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Block (user blocks)
CREATE TABLE IF NOT EXISTS "Block" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  blocked_user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, blocked_user_id)
);

CREATE INDEX IF NOT EXISTS idx_report_post_id ON "Report"(post_id);
CREATE INDEX IF NOT EXISTS idx_report_user_id ON "Report"(user_id);
CREATE INDEX IF NOT EXISTS idx_block_user_id ON "Block"(user_id);
CREATE INDEX IF NOT EXISTS idx_block_blocked_user_id ON "Block"(blocked_user_id);

ALTER TABLE "Report" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Block" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Report select own" ON "Report" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Report insert own" ON "Report" FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Block select own" ON "Block" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Block insert own" ON "Block" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Block delete own" ON "Block" FOR DELETE USING (auth.uid() = user_id);
