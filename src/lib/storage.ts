import { createClient } from '@/lib/supabase/server';

// Private buckets that require signed URLs
const PRIVATE_BUCKETS = ['logbook-files', 'evidence-media', 'logbook-scans', 'profile-assets', 'report-exports'];

export async function uploadFile(file: File, bucket: string, path: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .storage
    .from(bucket)
    .upload(path, file);

  if (error) throw error;

  // Use signed URL for private buckets, public URL for public buckets
  if (PRIVATE_BUCKETS.includes(bucket)) {
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days expiry

    if (signedUrlError || !signedUrlData) {
      throw new Error('Failed to generate signed URL');
    }

    return { path, publicUrl: signedUrlData.signedUrl };
  }

  const { data: { publicUrl } } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(path);

  return { path, publicUrl };
}

export async function deleteFile(bucket: string, path: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}
