-- Update storage bucket file size limit to 100MB
UPDATE storage.buckets 
SET file_size_limit = 104857600 
WHERE id = 'birthday-media';