-- Migration: Configuration du bucket Storage pour les images
-- À exécuter dans l'éditeur SQL de Supabase

-- Créer le bucket pour les images de produits
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB en bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Policy pour permettre à tout le monde de voir les images
CREATE POLICY "Public access to product images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

-- Policy pour permettre aux admins d'uploader
CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy pour permettre aux admins de supprimer
CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
