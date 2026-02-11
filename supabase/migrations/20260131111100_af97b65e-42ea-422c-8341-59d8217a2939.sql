-- Add an index on created_at for faster pagination queries
CREATE INDEX IF NOT EXISTS idx_birthday_wishes_created_at ON public.birthday_wishes(created_at DESC);

-- Add an index on visitor_id for faster ownership lookups
CREATE INDEX IF NOT EXISTS idx_birthday_wishes_visitor_id ON public.birthday_wishes(visitor_id);