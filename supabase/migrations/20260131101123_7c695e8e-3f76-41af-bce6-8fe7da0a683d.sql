-- Drop the existing check constraint and add a new one that includes 'multiple'
ALTER TABLE public.birthday_wishes DROP CONSTRAINT IF EXISTS birthday_wishes_media_type_check;

ALTER TABLE public.birthday_wishes ADD CONSTRAINT birthday_wishes_media_type_check 
CHECK (media_type IS NULL OR media_type IN ('text', 'photo', 'video', 'voice', 'multiple'));