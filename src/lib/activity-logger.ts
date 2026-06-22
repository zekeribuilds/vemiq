import { createClient } from '@/lib/supabase/browser';

export type ActivityEventType =
  | 'log_created'
  | 'image_uploaded'
  | 'voice_uploaded'
  | 'chapter_generated'
  | 'chapter_edited'
  | 'report_exported'
  | 'payment_completed'
  | 'report_created'
  | 'report_submitted';

export interface ActivityEvent {
  event_type: ActivityEventType;
  event_title: string;
  event_description?: string;
  report_id?: string;
  event_metadata?: Record<string, any>;
}

/**
 * Log an activity event to the activity_events table
 * This provides a unified activity feed across the application
 */
export async function logActivityEvent(event: ActivityEvent) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('No user found for activity logging');
      return null;
    }

    const { data, error } = await supabase
      .from('activity_events')
      .insert({
        user_id: user.id,
        event_type: event.event_type,
        event_title: event.event_title,
        event_description: event.event_description || null,
        report_id: event.report_id || null,
        event_metadata: event.event_metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error logging activity event:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in logActivityEvent:', error);
    return null;
  }
}

/**
 * Helper functions for common activity events
 */
export const activityEvents = {
  logCreated: (title: string, description?: string) =>
    logActivityEvent({
      event_type: 'log_created',
      event_title: title,
      event_description: description,
    }),

  imageUploaded: (title: string, reportId?: string) =>
    logActivityEvent({
      event_type: 'image_uploaded',
      event_title: title,
      event_description: 'Image uploaded to logbook',
      report_id: reportId,
    }),

  voiceUploaded: (title: string, reportId?: string) =>
    logActivityEvent({
      event_type: 'voice_uploaded',
      event_title: title,
      event_description: 'Voice note recorded',
      report_id: reportId,
    }),

  chapterGenerated: (chapterName: string, reportId: string) =>
    logActivityEvent({
      event_type: 'chapter_generated',
      event_title: `Generated: ${chapterName}`,
      event_description: 'AI-assisted chapter generation',
      report_id: reportId,
    }),

  chapterEdited: (chapterName: string, reportId: string) =>
    logActivityEvent({
      event_type: 'chapter_edited',
      event_title: `Edited: ${chapterName}`,
      event_description: 'Chapter content updated',
      report_id: reportId,
    }),

  reportCreated: (reportTitle: string, reportId: string) =>
    logActivityEvent({
      event_type: 'report_created',
      event_title: `Created: ${reportTitle}`,
      event_description: 'New report started',
      report_id: reportId,
    }),

  reportSubmitted: (reportTitle: string, reportId: string) =>
    logActivityEvent({
      event_type: 'report_submitted',
      event_title: `Submitted: ${reportTitle}`,
      event_description: 'Report submitted for review',
      report_id: reportId,
    }),

  reportExported: (reportTitle: string, reportId: string) =>
    logActivityEvent({
      event_type: 'report_exported',
      event_title: `Exported: ${reportTitle}`,
      event_description: 'Report exported to PDF',
      report_id: reportId,
    }),

  paymentCompleted: (amount: number, reportId?: string) =>
    logActivityEvent({
      event_type: 'payment_completed',
      event_title: `Payment completed: ₦${amount}`,
      event_description: 'Subscription payment processed',
      report_id: reportId,
    }),
};
