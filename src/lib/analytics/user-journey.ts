/**
 * User Journey Recording
 * Records page visits, time spent, clicks, feature usage, navigation paths
 */

import { createClient } from '../supabase/browser';

export interface PageVisit {
  page: string;
  visits: number;
  avgTimeSpent: number;
  totalClicks: number;
}

export interface FeatureUsage {
  feature: string;
  usageCount: number;
  uniqueUsers: number;
}

export interface UserPath {
  path: string[];
  frequency: number;
}

export interface UserJourneyMetrics {
  mostUsedFeatures: FeatureUsage[];
  leastUsedFeatures: FeatureUsage[];
  deadScreens: PageVisit[];
  mostCommonPaths: UserPath[];
}

/**
 * Get user journey metrics
 */
export async function getUserJourneyMetrics(): Promise<UserJourneyMetrics> {
  try {
    const supabase = createClient();

    // Get page visits from analytics_events
    const { data: pageEvents } = await supabase
      .from('analytics_events')
      .select('page, properties, created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Calculate page visits and time spent
    const pageVisits: Record<string, { visits: number; totalTime: number; clicks: number }> = {};
    
    pageEvents?.forEach(event => {
      const page = event.page || '/';
      if (!pageVisits[page]) {
        pageVisits[page] = { visits: 0, totalTime: 0, clicks: 0 };
      }
      pageVisits[page].visits++;
      pageVisits[page].totalTime += event.properties?.timeSpent || 0;
      pageVisits[page].clicks += event.properties?.clicks || 0;
    });

    const pageVisitArray: PageVisit[] = Object.entries(pageVisits).map(([page, data]) => ({
      page,
      visits: data.visits,
      avgTimeSpent: data.totalTime / data.visits,
      totalClicks: data.clicks,
    }));

    // Dead screens (pages with high visits but low time spent and low clicks)
    const deadScreens = pageVisitArray
      .filter(p => p.visits > 10 && p.avgTimeSpent < 5 && p.totalClicks < p.visits * 2)
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5);

    // Get feature usage
    const { data: featureEvents } = await supabase
      .from('analytics_events')
      .select('event_name, user_id')
      .eq('event_category', 'usage')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const featureUsage: Record<string, { count: number; users: Set<string> }> = {};

    featureEvents?.forEach(event => {
      const feature = event.event_name;
      if (!featureUsage[feature]) {
        featureUsage[feature] = { count: 0, users: new Set() };
      }
      featureUsage[feature].count++;
      featureUsage[feature].users.add(event.user_id);
    });

    const featureUsageArray: FeatureUsage[] = Object.entries(featureUsage).map(([feature, data]) => ({
      feature,
      usageCount: data.count,
      uniqueUsers: data.users.size,
    }));

    const mostUsedFeatures = featureUsageArray
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 5);

    const leastUsedFeatures = featureUsageArray
      .sort((a, b) => a.usageCount - b.usageCount)
      .slice(0, 5);

    // Get most common user paths (simplified - consecutive page visits)
    const { data: pathEvents } = await supabase
      .from('analytics_events')
      .select('user_id, page, created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    const paths: Record<string, number> = {};

    if (pathEvents) {
      for (let i = 0; i < pathEvents.length - 1; i++) {
        const current = pathEvents[i];
        const next = pathEvents[i + 1];
        
        if (current.user_id === next.user_id) {
          const path = `${current.page} → ${next.page}`;
          paths[path] = (paths[path] || 0) + 1;
        }
      }
    }

    const mostCommonPaths: UserPath[] = Object.entries(paths)
      .map(([path, frequency]) => ({ path: path.split(' → '), frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);

    return {
      mostUsedFeatures,
      leastUsedFeatures,
      deadScreens,
      mostCommonPaths,
    };
  } catch (error) {
    console.error('Error fetching user journey metrics:', error);
    return {
      mostUsedFeatures: [],
      leastUsedFeatures: [],
      deadScreens: [],
      mostCommonPaths: [],
    };
  }
}

/**
 * Track page visit
 */
export async function trackPageVisit(page: string, timeSpent: number, clicks: number) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: 'page_visit',
      event_category: 'journey',
      event_name: page,
      properties: { timeSpent, clicks },
      page,
    });
  } catch (error) {
    console.error('Error tracking page visit:', error);
  }
}

/**
 * Track feature usage
 */
export async function trackFeatureUsage(feature: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: feature,
      event_category: 'usage',
      event_name: feature,
      properties: {},
      page: window.location.pathname,
    });
  } catch (error) {
    console.error('Error tracking feature usage:', error);
  }
}
