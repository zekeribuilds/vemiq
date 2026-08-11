import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadFile } from '@/lib/storage';
import { requireAuth } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await requireAuth();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const linkedTo = formData.get('linkedTo') as string | null;
    const fileType = formData.get('fileType') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    // Upload file to storage (use logbook-files bucket as per schema)
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const { path, publicUrl } = await uploadFile(file, 'logbook-files', fileName);

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
    // Verify authentication
    const userId = await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const uploadId = searchParams.get('uploadId');

    if (!uploadId) {
      return NextResponse.json(
        { error: 'uploadId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get upload details and verify ownership
    const { data: upload, error: fetchError } = await supabase
      .from('uploads')
      .select('*')
      .eq('id', uploadId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !upload) {
      return NextResponse.json(
        { error: 'Upload not found or access denied' },
        { status: 404 }
      );
    }

    const storagePath = upload.file_url.split('/logbook-files/').pop();
    if (storagePath) {
      await supabase.storage.from('logbook-files').remove([storagePath]);
    }

    // Delete from database (verify ownership)
    const { error: deleteError } = await supabase
      .from('uploads')
      .delete()
      .eq('id', uploadId)
      .eq('user_id', userId);

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
