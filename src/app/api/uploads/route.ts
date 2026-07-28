import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadFile } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const linkedTo = formData.get('linkedTo') as string | null;
    const fileType = formData.get('fileType') as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'File and userId are required' },
        { status: 400 }
      );
    }

    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const { path, publicUrl } = await uploadFile(file, 'uploads', fileName);

    // Create upload record in database
    const supabase = await createClient();
    const { data: uploadData, error: uploadError } = await supabase
      .from('uploads')
      .insert({
        user_id: userId,
        file_url: publicUrl,
        file_type: fileType || file.type,
        linked_to: linkedTo || null,
      })
      .select()
      .single();

    if (uploadError) throw uploadError;

    // Create activity event
    await supabase.from('activity_logs').insert({
      user_id: userId,
      action: 'upload',
      metadata: {
        entity_type: 'upload',
        entity_id: uploadData.id,
        fileName: file.name,
        fileType: fileType || file.type,
        fileSize: file.size,
        linkedTo,
      },
    });

    return NextResponse.json({
      success: true,
      upload: {
        ...uploadData,
        file_name: file.name,
        file_size: file.size,
        uploaded_at: uploadData.created_at,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uploadId = searchParams.get('uploadId');
    const userId = searchParams.get('userId');

    if (!uploadId || !userId) {
      return NextResponse.json(
        { error: 'uploadId and userId are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get upload details
    const { data: upload, error: fetchError } = await supabase
      .from('uploads')
      .select('*')
      .eq('id', uploadId)
      .single();

    if (fetchError) throw fetchError;

    const storagePath = upload.file_url.split('/uploads/').pop();
    if (storagePath) {
      await supabase.storage.from('uploads').remove([storagePath]);
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('uploads')
      .delete()
      .eq('id', uploadId);

    if (deleteError) throw deleteError;

    // Create activity event
    await supabase.from('activity_logs').insert({
      user_id: userId,
      action: 'delete',
      metadata: {
        entity_type: 'upload',
        entity_id: uploadId,
        fileUrl: upload.file_url,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
