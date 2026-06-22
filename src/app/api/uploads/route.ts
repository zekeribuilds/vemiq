import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadFile } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const reportId = formData.get('reportId') as string;
    const weeklyLogId = formData.get('weeklyLogId') as string;
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
        report_id: reportId || null,
        file_name: file.name,
        file_url: publicUrl,
        file_type: fileType || file.type,
        file_size: file.size,
      })
      .select()
      .single();

    if (uploadError) throw uploadError;

    // Create activity event
    await supabase.from('activity_events').insert({
      user_id: userId,
      action: 'upload',
      entity_type: 'upload',
      entity_id: uploadData.id,
      metadata: {
        fileName: file.name,
        fileType: fileType || file.type,
        reportId,
        weeklyLogId,
      },
    });

    return NextResponse.json({
      success: true,
      upload: uploadData,
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

    // Delete from storage
    const filePath = upload.file_url.split('/').pop();
    if (filePath) {
      await supabase.storage.from('uploads').remove([`${userId}/${filePath}`]);
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('uploads')
      .delete()
      .eq('id', uploadId);

    if (deleteError) throw deleteError;

    // Create activity event
    await supabase.from('activity_events').insert({
      user_id: userId,
      action: 'delete',
      entity_type: 'upload',
      entity_id: uploadId,
      metadata: {
        fileName: upload.file_name,
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
