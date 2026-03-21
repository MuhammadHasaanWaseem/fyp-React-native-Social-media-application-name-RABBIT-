-- Trigger: Auto-unfollow when user blocks another
-- Removes both follow directions (blocker↔blocked)
-- Run in Supabase SQL Editor after report-block.sql

CREATE OR REPLACE FUNCTION unfollow_on_block()
RETURNS TRIGGER AS $$
BEGIN
  -- Remove blocker following blocked
  DELETE FROM "Followers"
  WHERE user_id = NEW.user_id AND following_user_id = NEW.blocked_user_id;
  -- Remove blocked following blocker
  DELETE FROM "Followers"
  WHERE user_id = NEW.blocked_user_id AND following_user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_unfollow_on_block ON "Block";
CREATE TRIGGER trigger_unfollow_on_block
  AFTER INSERT ON "Block"
  FOR EACH ROW EXECUTE FUNCTION unfollow_on_block();
