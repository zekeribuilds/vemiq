/**
 * Beta User Segmentation
 * Segments users by institution, department, level, program type
 */

import { createClient } from '../supabase/browser';

export interface SegmentMetrics {
  segment: string;
  userCount: number;
  activeUsers: number;
  payingUsers: number;
  retentionRate: number;
  averageRevenue: number;
}

export interface SegmentationSummary {
  mostActiveInstitution: string;
  mostActiveDepartment: string;
  highestPayingSegment: string;
  highestRetentionSegment: string;
  institutionSegments: SegmentMetrics[];
  departmentSegments: SegmentMetrics[];
  levelSegments: SegmentMetrics[];
  programTypeSegments: SegmentMetrics[];
}

/**
 * Get user segmentation metrics
 */
export async function getSegmentationMetrics(): Promise<SegmentationSummary> {
  try {
    const supabase = createClient();

    // Get all users with their profile data
    const { data: users } = await supabase
      .from('profiles')
      .select('id, institution_id, faculty_id, department_id, current_level, created_at');

    if (!users || users.length === 0) {
      return {
        mostActiveInstitution: 'N/A',
        mostActiveDepartment: 'N/A',
        highestPayingSegment: 'N/A',
        highestRetentionSegment: 'N/A',
        institutionSegments: [],
        departmentSegments: [],
        levelSegments: [],
        programTypeSegments: [],
      };
    }

    // Get institution names
    const { data: institutions } = await supabase
      .from('institutions')
      .select('id, name');

    const institutionMap = new Map(institutions?.map(i => [i.id, i.name]) || []);

    // Get department names
    const { data: departments } = await supabase
      .from('departments')
      .select('id, name');

    const departmentMap = new Map(departments?.map(d => [d.id, d.name]) || []);

    // Calculate segment metrics
    const institutionSegments = await calculateSegmentMetrics(
      users,
      'institution_id',
      institutionMap,
      supabase
    );

    const departmentSegments = await calculateSegmentMetrics(
      users,
      'department_id',
      departmentMap,
      supabase
    );

    const levelSegments = await calculateSegmentMetrics(
      users,
      'current_level',
      null,
      supabase
    );

    // Program type segments (SIWES vs SWEP) - from reports
    const { data: reports } = await supabase
      .from('reports')
      .select('user_id, program_type');

    const programTypeMap = new Map();
    reports?.forEach(r => {
      const count = programTypeMap.get(r.program_type) || 0;
      programTypeMap.set(r.program_type, count + 1);
    });

    const programTypeSegments: SegmentMetrics[] = Array.from(programTypeMap.entries()).map(([programType, count]) => ({
      segment: programType,
      userCount: count,
      activeUsers: 0,
      payingUsers: 0,
      retentionRate: 0,
      averageRevenue: 0,
    }));

    // Find most active segments
    const mostActiveInstitution = institutionSegments.length > 0
      ? institutionSegments.reduce((max, s) => s.activeUsers > max.activeUsers ? s : max).segment
      : 'N/A';

    const mostActiveDepartment = departmentSegments.length > 0
      ? departmentSegments.reduce((max, s) => s.activeUsers > max.activeUsers ? s : max).segment
      : 'N/A';

    const highestPayingSegment = institutionSegments.length > 0
      ? institutionSegments.reduce((max, s) => s.averageRevenue > max.averageRevenue ? s : max).segment
      : 'N/A';

    const highestRetentionSegment = institutionSegments.length > 0
      ? institutionSegments.reduce((max, s) => s.retentionRate > max.retentionRate ? s : max).segment
      : 'N/A';

    return {
      mostActiveInstitution,
      mostActiveDepartment,
      highestPayingSegment,
      highestRetentionSegment,
      institutionSegments,
      departmentSegments,
      levelSegments,
      programTypeSegments,
    };
  } catch (error) {
    console.error('Error fetching segmentation metrics:', error);
    return {
      mostActiveInstitution: 'N/A',
      mostActiveDepartment: 'N/A',
      highestPayingSegment: 'N/A',
      highestRetentionSegment: 'N/A',
      institutionSegments: [],
      departmentSegments: [],
      levelSegments: [],
      programTypeSegments: [],
    };
  }
}

async function calculateSegmentMetrics(
  users: any[],
  segmentField: string,
  nameMap: Map<string, string> | null,
  supabase: any
): Promise<SegmentMetrics[]> {
  const segmentGroups: Record<string, string[]> = {};

  users.forEach(user => {
    const segmentValue = user[segmentField] || 'Unknown';
    const segmentName = nameMap?.get(segmentValue) || segmentValue;
    if (!segmentGroups[segmentName]) {
      segmentGroups[segmentName] = [];
    }
    segmentGroups[segmentName].push(user.id);
  });

  const segments: SegmentMetrics[] = [];

  for (const [segment, userIds] of Object.entries(segmentGroups)) {
    const userCount = userIds.length;

    // Active users (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: activeUsers } = await supabase
      .from('activity_events')
      .select('*', { count: 'exact', head: true })
      .in('user_id', userIds)
      .gte('created_at', sevenDaysAgo);

    // Paying users
    const { count: payingUsers } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .in('user_id', userIds)
      .eq('status', 'completed');

    // Revenue
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .in('user_id', userIds)
      .eq('status', 'completed');

    const totalRevenue = payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;

    // Retention rate (simplified - users who returned after 7 days)
    const { count: returningUsers } = await supabase
      .from('activity_events')
      .select('*', { count: 'exact', head: true })
      .in('user_id', userIds)
      .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString());

    const retentionRate = userCount > 0 ? ((returningUsers || 0) / userCount) * 100 : 0;

    segments.push({
      segment,
      userCount,
      activeUsers: activeUsers || 0,
      payingUsers: payingUsers || 0,
      retentionRate,
      averageRevenue: userCount > 0 ? totalRevenue / userCount : 0,
    });
  }

  return segments.sort((a, b) => b.userCount - a.userCount);
}
