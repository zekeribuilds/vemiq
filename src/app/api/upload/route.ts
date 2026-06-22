import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Helper function to determine file_type from mime_type
function getFileType(mimeType: string): 'image' | 'voice' | 'document' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'voice';
  return 'document';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const reportId = formData.get('reportId') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, PDF, and audio files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(fileName, file, {
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    // Determine file_type (image, voice, document)
    const fileType = getFileType(file.type);

    // Create upload record in database matching migration schema
    const { data: uploadRecord, error: dbError } = await supabase
      .from('uploads')
      .insert({
        user_id: userId,
        report_id: reportId || null,
        file_type: fileType,
        storage_path: fileName,
        mime_type: file.type,
        file_size: file.size,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Rollback storage upload if database insert fails
      await supabase.storage.from('uploads').remove([fileName]);
      return NextResponse.json(
        { error: 'Failed to create upload record' },
        { status: 500 }
      );
    }

    // Log activity event
    const { error: activityError } = await supabase
      .from('activity_events')
      .insert({
        user_id: userId,
        report_id: reportId || null,
        event_type: 'upload',
        event_data: {
          file_type: fileType,
          file_name: file.name,
          file_size: file.size,
        },
      });

    if (activityError) {
      console.error('Activity logging error:', activityError);
      // Don't fail the request if activity logging fails
    }

    return NextResponse.json({
      id: uploadRecord.id,
      url: publicUrlData.publicUrl,
      storage_path: fileName,
      file_type: fileType,
      mime_type: file.type,
      file_size: file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}

// DELETE endpoint for removing uploads
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uploadId = searchParams.get('uploadId');
    const userId = searchParams.get('userId');

    if (!uploadId || !userId) {
      return NextResponse.json(
        { error: 'Upload ID and User ID are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch upload record
    const { data: uploadRecord, error: fetchError } = await supabase
      .from('uploads')
      .select('*')
      .eq('id', uploadId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !uploadRecord) {
      return NextResponse.json(
        { error: 'Upload not found' },
        { status: 404 }
      );
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('uploads')
      .remove([uploadRecord.storage_path]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
      return NextResponse.json(
        { error: 'Failed to delete file from storage' },
        { status: 500 }
      );
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('uploads')
      .delete()
      .eq('id', uploadId)
      .eq('user_id', userId);

    if (dbError) {
      console.error('Database deletion error:', dbError);
      return NextResponse.json(
        { error: 'Failed to delete upload record' },
        { status: 500 }
      );
    }

    // Log activity event
    const { error: activityError } = await supabase
      .from('activity_events')
      .insert({
        user_id: userId,
        report_id: uploadRecord.report_id,
        event_type: 'delete_upload',
        event_data: {
          file_type: uploadRecord.file_type,
          storage_path: uploadRecord.storage_path,
        },
      });

    if (activityError) {
      console.error('Activity logging error:', activityError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete upload error:', error);
    return NextResponse.json(
      { error: 'Failed to delete upload' },
      { status: 500 }
    );
  }
}
