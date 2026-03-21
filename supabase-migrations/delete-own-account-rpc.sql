-- Run once in Supabase SQL Editor (no Edge Function needed).
-- Deletes the calling user's row in auth.users; public "User" and related rows CASCADE.

-- App deletes files before RPC; needs DELETE on own prefix in bucket "files".
DROP POLICY IF EXISTS "Users can delete own folder objects" ON storage.objects;
CREATE POLICY "Users can delete own folder objects"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  uid uuid;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  DELETE FROM auth.users WHERE id = uid;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_own_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;
