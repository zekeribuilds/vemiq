import { createClient } from '@/lib/supabase/server'

export type EvidenceInput = {
  workspace_id: string
  title: string
  activity_name?: string | null
  description?: string | null
  source_type: 'voice' | 'photo' | 'text' | 'logbook_scan' | 'document' | 'recovery'
  evidence_date?: string | null
  week_number?: number | null
  section_name?: string | null
  supervisor_name?: string | null
  confidence_score?: number | null
  metadata?: Record<string, unknown>
}

export async function createEvidence(input: EvidenceInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')
  const { data: workspace, error: workspaceError } = await supabase.from('workspaces').select('id').eq('id', input.workspace_id).eq('user_id', user.id).single()
  if (workspaceError || !workspace) throw new Error('Workspace not found')
  const { data, error } = await supabase.from('evidence_items').insert({ ...input, user_id: user.id }).select().single()
  if (error) throw error
  return data
}
