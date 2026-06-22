/**
 * Analytics Tracking Library
 * Handles event tracking for product analytics and funnel analysis
 */

export type EventCategory = 'acquisition' | 'activation' | 'usage' | 'revenue' | 'retention';

export type EventType = 
  // Acquisition
  | 'landing_viewed'
  | 'signup_clicked'
  | 'account_created'
  | 'profile_completed'
  // Activation
  | 'first_logbook_created'
  | 'first_week_added'
  | 'first_entry_added'
  | 'first_upload_added'
  // Usage
  | 'report_created'
  | 'report_generated'
  | 'report_edited'
  | 'ai_used'
  | 'weekly_summary_generated'
  | 'logbook_viewed'
  | 'week_viewed'
  | 'entry_edited'
  // Revenue
  | 'export_clicked'
  | 'payment_started'
  | 'payment_completed'
  | 'payment_failed'
  | 'payment_abandoned'
  | 'pdf_exported'
  // Retention
  | 'returned_next_day'
  | 'returned_within_7_days'
  | 'returned_within_30_days';

export interface AnalyticsEvent {
  eventType: EventType;
  category: EventCategory;
  properties?: Record<string, any>;
  page?: string;
}

/**
 * Track an analytics event
 */
export async function trackEvent(event: AnalyticsEvent) {
  try {
    const { createClient } = await import('@/lib/supabase/browser');
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: event.eventType,
      event_category: event.category,
      event_name: event.eventType,
      properties: event.properties || {},
      page: event.page || window.location.pathname,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Fail silently - don't block user experience
  }
}

/**
 * Track conversion funnel step
 */
export async function trackConversion(
  funnel: string,
  step: string,
  properties?: Record<string, any>
) {
  await trackEvent({
    eventType: step as EventType,
    category: 'usage',
    properties: {
      funnel,
      step,
      ...properties,
    },
    page: window.location.pathname,
  });
}

/**
 * Track page view
 */
export async function trackPageView(page: string) {
  await trackEvent({
    eventType: 'landing_viewed' as EventType,
    category: 'acquisition',
    properties: { page },
    page,
  });
}

/**
 * Track user action
 */
export async function trackUserAction(action: string, properties?: Record<string, any>) {
  await trackEvent({
    eventType: action as EventType,
    category: 'usage',
    properties,
    page: window.location.pathname,
  });
}

/**
 * Track error
 */
export async function trackError(error: Error, context?: Record<string, any>) {
  await trackEvent({
    eventType: 'report_edited' as EventType, // Using existing type, will be categorized separately
    category: 'usage',
    properties: {
      error: error.message,
      stack: error.stack,
      ...context,
    },
    page: window.location.pathname,
  });
}
