-- Create birthday wishes table for messages, photos, videos, and voice notes
CREATE TABLE public.birthday_wishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name TEXT NOT NULL,
  message TEXT,
  media_type TEXT CHECK (media_type IN ('photo', 'video', 'voice', 'text')),
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.birthday_wishes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view wishes (public birthday page)
CREATE POLICY "Anyone can view birthday wishes"
  ON public.birthday_wishes FOR SELECT
  USING (true);

-- Allow anyone to add wishes (public submission)
CREATE POLICY "Anyone can add birthday wishes"
  ON public.birthday_wishes FOR INSERT
  WITH CHECK (true);

-- Create storage bucket for birthday media
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('birthday-media', 'birthday-media', true, 52428800);

-- Allow anyone to view media
CREATE POLICY "Anyone can view birthday media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'birthday-media');

-- Allow anyone to upload media
CREATE POLICY "Anyone can upload birthday media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'birthday-media');

-- Enable realtime for birthday wishes
ALTER PUBLICATION supabase_realtime ADD TABLE public.birthday_wishes;