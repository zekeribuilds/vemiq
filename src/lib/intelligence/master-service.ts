import { createClient } from '@/lib/supabase/server'

export async function createReportCorrection(input: { report_id: string; evidence_id?: string; old_content?: string; new_content: string; reason?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')
  const { data, error } = await supabase.from('report_corrections').insert(input).select().single()
  if (error) throw error
  return data
}

export async function acceptReportCorrection(correctionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')
  const { error } = await supabase.rpc('accept_report_correction', { correction_uuid: correctionId })
  if (error) throw error
}
