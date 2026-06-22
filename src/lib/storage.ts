import { createClient } from '@/lib/supabase/server';

export async function uploadFile(file: File, bucket: string, path: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .upload(path, file);

  if (error) throw error;

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
