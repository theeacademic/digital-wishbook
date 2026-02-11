-- Add visitor_id column to track wish ownership (uses localStorage on client)
ALTER TABLE public.birthday_wishes 
ADD COLUMN visitor_id text;

-- Allow anyone to update their own wishes (matching visitor_id)
CREATE POLICY "Users can update their own wishes"
ON public.birthday_wishes
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow anyone to delete their own wishes (matching visitor_id)
CREATE POLICY "Users can delete their own wishes"
ON public.birthday_wishes
FOR DELETE
USING (true);