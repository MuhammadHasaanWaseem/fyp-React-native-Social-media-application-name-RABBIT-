-- Rabbit App - Supabase Database Deployment
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor) to deploy.
-- Best for fresh projects. If tables exist, you may need to drop them first.

-- ============================================
-- 1. TABLES
-- ============================================

-- User (matches Supabase Auth; id = auth.users.id)
CREATE TABLE IF NOT EXISTS "User" (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  nickname TEXT,
  bio TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post (threads, scheduled, time_capsule, private)
CREATE TABLE IF NOT EXISTS "Post" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES "Post"(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  status TEXT,
  unlock_at TIMESTAMPTZ,
  file TEXT,
  repost_user_id UUID REFERENCES "User"(id) ON DELETE SET NULL,
  tag_name TEXT,
  place_id TEXT,
  "Availablity" TEXT,
  password TEXT,
  hint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Like
CREATE TABLE IF NOT EXISTS "Like" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES "Post"(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Comment
CREATE TABLE IF NOT EXISTS "Comment" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES "Post"(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Followers (user_id follows following_user_id)
CREATE TABLE IF NOT EXISTS "Followers" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  following_user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, following_user_id)
);

-- WorldChatMessage (global chat)
CREATE TABLE IF NOT EXISTS "WorldChatMessage" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_post_user_id ON "Post"(user_id);
CREATE INDEX IF NOT EXISTS idx_post_parent_id ON "Post"(parent_id);
CREATE INDEX IF NOT EXISTS idx_post_status ON "Post"(status);
CREATE INDEX IF NOT EXISTS idx_post_created_at ON "Post"(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_like_post_id ON "Like"(post_id);
CREATE INDEX IF NOT EXISTS idx_like_user_id ON "Like"(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_post_id ON "Comment"(post_id);
CREATE INDEX IF NOT EXISTS idx_followers_following ON "Followers"(following_user_id);
CREATE INDEX IF NOT EXISTS idx_followers_user ON "Followers"(user_id);
CREATE INDEX IF NOT EXISTS idx_worldchat_created ON "WorldChatMessage"(created_at);

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Like" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Followers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorldChatMessage" ENABLE ROW LEVEL SECURITY;

-- User: read all, insert/update own
CREATE POLICY "User select" ON "User" FOR SELECT USING (true);
CREATE POLICY "User insert own" ON "User" FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "User update own" ON "User" FOR UPDATE USING (auth.uid() = id);

-- Post: read all, insert/update/delete own
CREATE POLICY "Post select" ON "Post" FOR SELECT USING (true);
CREATE POLICY "Post insert" ON "Post" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Post update own" ON "Post" FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Post delete own" ON "Post" FOR DELETE USING (auth.uid() = user_id);

-- Like: read all, insert/delete own
CREATE POLICY "Like select" ON "Like" FOR SELECT USING (true);
CREATE POLICY "Like insert" ON "Like" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Like delete own" ON "Like" FOR DELETE USING (auth.uid() = user_id);

-- Comment: read all, insert own, delete own or if post owner
CREATE POLICY "Comment select" ON "Comment" FOR SELECT USING (true);
CREATE POLICY "Comment insert" ON "Comment" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Comment delete" ON "Comment" FOR DELETE USING (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM "Post" p WHERE p.id = post_id AND p.user_id = auth.uid())
);

-- Followers: read all, insert/delete own
CREATE POLICY "Followers select" ON "Followers" FOR SELECT USING (true);
CREATE POLICY "Followers insert" ON "Followers" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Followers delete own" ON "Followers" FOR DELETE USING (auth.uid() = user_id);

-- WorldChatMessage: read all, insert own, delete own
CREATE POLICY "WorldChatMessage select" ON "WorldChatMessage" FOR SELECT USING (true);
CREATE POLICY "WorldChatMessage insert" ON "WorldChatMessage" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "WorldChatMessage delete own" ON "WorldChatMessage" FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 4. REALTIME (WorldChat)
-- ============================================
-- Enables live updates for WorldChat. Skip if already added.
ALTER PUBLICATION supabase_realtime ADD TABLE "WorldChatMessage";

-- ============================================
-- 5. STORAGE
-- ============================================
-- In Supabase Dashboard > Storage: create bucket "files", set to Public.
-- App stores avatars and media at: files/{user_id}/{filename}

-- ============================================
-- 6. AUTH
-- ============================================
-- Enable Phone/OTP in Authentication > Providers if using OTP login.
