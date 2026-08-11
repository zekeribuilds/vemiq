export type WorkspaceType = 'siwes' | 'swep' | 'project' | 'internship' | 'research' | 'career'
export type WorkspaceStatus = 'active' | 'completed' | 'archived'
export type EvidenceSourceType = 'voice' | 'photo' | 'text' | 'logbook_scan' | 'document' | 'recovery'
export type VerificationStatus = 'verified' | 'reconstructed' | 'pending'
export type EvidenceMediaType = 'image' | 'audio' | 'video' | 'document' | 'sketch' | 'logbook_page'

export interface Workspace { id: string; user_id: string; name: string; workspace_type: WorkspaceType; institution_id: string | null; training_organization_id: string | null; start_date: string | null; end_date: string | null; status: WorkspaceStatus; created_at: string; updated_at: string }
export interface EvidenceItem { id: string; workspace_id: string; user_id: string; title: string; activity_name: string | null; description: string | null; source_type: EvidenceSourceType; evidence_date: string | null; week_number: number | null; section_name: string | null; supervisor_name: string | null; confidence_score: number | null; verification_status: VerificationStatus; created_at: string; updated_at: string }
export interface EvidenceMedia { id: string; evidence_id: string; user_id: string; storage_path: string; media_type: EvidenceMediaType; mime_type: string | null; file_size: number | null; created_at: string }
export interface DocumentationHealth { id: string; workspace_id: string; evidence_score: number | null; week_coverage_score: number | null; image_coverage_score: number | null; quality_score: number | null; missing_weeks: number; health_status: 'excellent' | 'good' | 'attention' | 'poor'; updated_at: string }
export interface EvidenceEntity { id: string; evidence_id: string; entity_type: string; entity_name: string; confidence_score: number | null; created_at: string }
export interface EvidenceInsight { id: string; evidence_id: string; summary: string | null; skills_detected: unknown[]; equipment_detected: unknown[]; learning_outcomes: unknown[]; technical_topics: unknown[]; generated_at: string }
export interface VoiceTranscript { id: string; evidence_id: string; raw_transcript: string | null; clean_transcript: string | null; semantic_transcript: string | null; processing_status: 'pending' | 'processing' | 'completed' | 'failed'; created_at: string }
export interface ClarificationSession { id: string; evidence_id: string; status: 'pending' | 'active' | 'completed' | 'cancelled'; questions: unknown[]; answers: unknown[]; created_at: string }
export interface LogbookScanPage { id: string; workspace_id: string; user_id: string; storage_path: string; page_number: number; ocr_text: string | null; detected_week: number | null; detected_instructor: string | null; confidence_score: number | null; created_at: string }
export interface IntelligenceJob { id: string; user_id: string; workspace_id: string | null; evidence_id: string | null; job_type: string; payload: Record<string, unknown>; status: 'pending' | 'processing' | 'completed' | 'failed'; attempts: number; error_message: string | null; created_at: string; updated_at: string }
export interface EvidenceTag { id: string; evidence_id: string; tag_name: string; tag_type: string; created_at: string }
export interface WorkspaceWeek { id: string; workspace_id: string; week_number: number; start_date: string | null; end_date: string | null; status: 'completed' | 'partial' | 'missing' }
export interface ReportCorrection { id: string; report_id: string; evidence_id: string | null; old_content: string | null; new_content: string; reason: string | null; accepted: boolean; created_at: string }
export interface EquipmentCatalog { id: string; name: string; category: string | null; description: string | null; common_operations: unknown[]; safety_procedures: unknown[]; report_description: string | null; created_at: string }
