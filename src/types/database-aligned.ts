// Database-aligned types based on actual backend schema from migrations

// Enums from backend
export type UserRole = 'student' | 'admin';
export type ProgramType = 'SWEP' | 'SIWES';
export type ReportStatus = 'draft' | 'completed';
export type PaymentStatus = 'pending' | 'successful' | 'failed';
export type LogbookStatus = 'active' | 'completed';
export type SourceType = 'text' | 'voice' | 'image' | 'mixed';
export type FileType = 'image' | 'audio' | 'pdf' | 'document';
export type ChatRole = 'user' | 'assistant';
export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Evidence infrastructure enums
export type WorkspaceType = 'siwes' | 'swep' | 'project' | 'internship' | 'research' | 'career';
export type WorkspaceStatus = 'active' | 'completed' | 'archived';
export type EvidenceSourceType = 'voice' | 'photo' | 'text' | 'logbook_scan' | 'document' | 'recovery';
export type VerificationStatus = 'verified' | 'reconstructed' | 'pending';
export type MediaType = 'image' | 'audio' | 'video' | 'document' | 'sketch' | 'logbook_page';
export type DocumentationPassStatus = 'pending' | 'active' | 'expired' | 'cancelled';
export type TransactionType = 'documentation_pass' | 'report_payment' | 'refund' | 'credit';
export type EntityType = 'equipment' | 'machine' | 'tool' | 'software' | 'skill' | 'activity' | 'process' | 'material' | 'safety_procedure' | 'location';
export type RelationshipType = 'uses_machine' | 'performed_activity' | 'occurred_in_section' | 'supervised_by' | 'related_to_process' | 'related_to_skill';
export type TagType = 'equipment' | 'machine' | 'skill' | 'activity' | 'tool' | 'safety' | 'process' | 'department';
export type SupervisorRoleType = 'siwes_coordinator' | 'industrial_supervisor' | 'section_instructor';
export type WeekStatus = 'completed' | 'partial' | 'missing';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type IntelligenceJobType = 'understand_evidence' | 'voice_transcription' | 'image_understanding' | 'sketch_understanding' | 'logbook_ocr' | 'documentation_health' | 'clarification';

// Core Tables
export interface Institution {
  id: string;
  name: string;
  logo_url?: string;
  state?: string;
  country?: string;
  created_at: string;
}

export interface Faculty {
  id: string;
  institution_id: string;
  name: string;
  created_at: string;
}

export interface Department {
  id: string;
  faculty_id: string;
  name: string;
  created_at: string;
}

export interface TrainingOrganization {
  id: string;
  name: string;
  address?: string;
  industry?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationDepartment {
  id: string;
  organization_id: string;
  name: string;
  created_at: string;
}

export interface OrganizationKnowledge {
  id: string;
  organization_id: string;
  overview?: string;
  history?: string;
  mission?: string;
  tools_used?: string;
  safety_rules?: string;
  processes?: string;
  notes?: string;
  equipment_catalog?: Record<string, any>;
  department_catalog?: Record<string, any>;
  safety_procedures?: Record<string, any>;
  workflows?: Record<string, any>;
  technical_processes?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  institution_id?: string;
  faculty_id?: string;
  department_id?: string;
  matric_number?: string;
  academic_session?: string;
  siwes_coordinator_name?: string;
  supervisor_name?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// Legacy Logbook System
export interface Logbook {
  id: string;
  user_id: string;
  title: string;
  program_type: ProgramType;
  institution_id?: string;
  training_organization_id?: string;
  department_name?: string;
  start_date?: string;
  end_date?: string;
  status: LogbookStatus;
  workspace_id?: string;
  created_at: string;
  updated_at: string;
}

export interface LogbookEntry {
  id: string;
  logbook_id: string;
  user_id: string;
  entry_date: string;
  week_number?: number;
  title?: string;
  activity_description: string;
  ai_cleaned_text?: string;
  source_type: SourceType;
  created_at: string;
  updated_at: string;
}

export interface LogbookEvidence {
  id: string;
  entry_id: string;
  user_id: string;
  storage_path: string;
  file_type: FileType;
  mime_type?: string;
  created_at: string;
}

// Report System
export interface Report {
  id: string;
  user_id: string;
  title: string;
  report_type: ProgramType;
  institution_id?: string;
  training_organization_id?: string;
  status: ReportStatus;
  progress: number;
  workspace_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ReportSection {
  id: string;
  report_id: string;
  title: string;
  content?: string;
  section_order: number;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReportVersion {
  id: string;
  report_id: string;
  snapshot?: Record<string, any>;
  created_at: string;
}

export interface ReportGenerationJob {
  id: string;
  report_id: string;
  section_id: string;
  user_id: string;
  status: GenerationStatus;
  prompt?: Record<string, any>;
  generated_content?: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

// Payment System
export interface Payment {
  id: string;
  user_id: string;
  report_id?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  reference?: string;
  paystack_reference?: string;
  paystack_transaction_id?: number;
  paid_at?: string;
  gateway_response?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ReportAccess {
  id: string;
  user_id: string;
  report_id: string;
  payment_id: string;
  unlocked_at: string;
  expires_at?: string;
}

export interface ReportExport {
  id: string;
  report_id: string;
  user_id: string;
  storage_path: string;
  version_number: number;
  created_at: string;
}

// Chat System
export interface ChatMessage {
  id: string;
  user_id: string;
  report_id?: string;
  role: ChatRole;
  message: string;
  created_at: string;
}

// File System
export interface Upload {
  id: string;
  user_id: string;
  file_url: string;
  file_type?: string;
  linked_to?: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  action: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// Evidence Infrastructure
export interface Workspace {
  id: string;
  user_id: string;
  name: string;
  workspace_type: WorkspaceType;
  institution_id?: string;
  training_organization_id?: string;
  start_date?: string;
  end_date?: string;
  status: WorkspaceStatus;
  created_at: string;
  updated_at: string;
}

export interface EvidenceItem {
  id: string;
  workspace_id: string;
  user_id: string;
  title: string;
  activity_name?: string;
  description?: string;
  source_type: EvidenceSourceType;
  evidence_date?: string;
  week_number?: number;
  section_name?: string;
  supervisor_name?: string;
  confidence_score?: number;
  verification_status: VerificationStatus;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface EvidenceMedia {
  id: string;
  evidence_id: string;
  user_id: string;
  storage_path: string;
  media_type: MediaType;
  mime_type?: string;
  file_size?: number;
  created_at: string;
}

export interface EvidenceImage {
  id: string;
  evidence_media_id: string;
  equipment_name?: string;
  equipment_category?: string;
  activity_name?: string;
  week_number?: number;
  caption?: string;
  confidence_score?: number;
  preferred_chapter?: string;
  placement_priority?: number;
  figure_title?: string;
  figure_description?: string;
  preferred_section?: string;
  created_at: string;
}

export interface EvidenceSketch {
  id: string;
  evidence_media_id: string;
  description?: string;
  equipment_name?: string;
  linked_activity?: string;
  created_at: string;
}

export interface DocumentationHealth {
  id: string;
  workspace_id: string;
  evidence_score?: number;
  week_coverage_score?: number;
  image_coverage_score?: number;
  quality_score?: number;
  missing_weeks: number;
  health_status: 'excellent' | 'good' | 'attention' | 'poor';
  updated_at: string;
}

export interface DocumentationPass {
  id: string;
  workspace_id: string;
  user_id: string;
  payment_id?: string;
  status: DocumentationPassStatus;
  activated_at?: string;
  created_at: string;
}

export interface RecoverySession {
  id: string;
  workspace_id: string;
  user_id: string;
  missing_week: number;
  interview_data: Record<string, any>;
  generated_evidence?: Record<string, any>;
  created_at: string;
}

// Intelligence Layer
export interface EvidenceEntity {
  id: string;
  evidence_id: string;
  entity_type: EntityType;
  entity_name: string;
  confidence_score?: number;
  created_at: string;
}

export interface EvidenceInsight {
  id: string;
  evidence_id: string;
  summary?: string;
  skills_detected: any[];
  equipment_detected: any[];
  learning_outcomes: any[];
  technical_topics: any[];
  generated_at: string;
}

export interface VoiceTranscript {
  id: string;
  evidence_id: string;
  raw_transcript?: string;
  clean_transcript?: string;
  semantic_transcript?: string;
  processing_status: ProcessingStatus;
  created_at: string;
}

export interface ClarificationSession {
  id: string;
  evidence_id: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  questions: any[];
  answers: any[];
  created_at: string;
}

export interface LogbookScanPage {
  id: string;
  workspace_id: string;
  user_id: string;
  storage_path: string;
  page_number: number;
  ocr_text?: string;
  detected_week?: number;
  detected_instructor?: string;
  confidence_score?: number;
  created_at: string;
}

export interface IntelligenceJob {
  id: string;
  user_id: string;
  workspace_id?: string;
  evidence_id?: string;
  job_type: IntelligenceJobType;
  payload: Record<string, any>;
  status: ProcessingStatus;
  attempts: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

// Master Intelligence Layer
export interface EvidenceRelationship {
  id: string;
  source_evidence_id: string;
  target_entity_id: string;
  relationship_type: RelationshipType;
  confidence_score?: number;
  created_at: string;
}

export interface EvidenceTag {
  id: string;
  evidence_id: string;
  tag_name: string;
  tag_type: TagType;
  created_at: string;
}

export interface EquipmentCatalog {
  id: string;
  name: string;
  category?: string;
  description?: string;
  common_operations: any[];
  safety_procedures: any[];
  report_description?: string;
  created_at: string;
}

export interface EquipmentComponent {
  id: string;
  equipment_id: string;
  component_name: string;
  description?: string;
}

export interface EquipmentActivity {
  id: string;
  equipment_id: string;
  activity_name: string;
  report_language?: string;
}

export interface Supervisor {
  id: string;
  full_name: string;
  role_type: SupervisorRoleType;
  organization_id?: string;
  institution_id?: string;
  created_at: string;
}

export interface WorkspaceSupervisor {
  id: string;
  workspace_id: string;
  supervisor_id: string;
  start_date?: string;
  end_date?: string;
}

export interface EvidenceSupervisor {
  id: string;
  evidence_id: string;
  supervisor_id: string;
}

export interface WorkspaceWeek {
  id: string;
  workspace_id: string;
  week_number: number;
  start_date?: string;
  end_date?: string;
  status: WeekStatus;
}

export interface WeekActivitySummary {
  id: string;
  workspace_week_id: string;
  evidence_count: number;
  image_count: number;
  quality_score?: number;
  summary?: string;
}

export interface ReportConversation {
  id: string;
  report_id: string;
  user_id: string;
  created_at: string;
}

export interface ReportMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  message: string;
  created_at: string;
}

export interface ReportCorrection {
  id: string;
  report_id: string;
  evidence_id?: string;
  old_content?: string;
  new_content: string;
  reason?: string;
  accepted: boolean;
  created_at: string;
}

export interface InstitutionTemplate {
  id: string;
  institution_id: string;
  template_name: string;
  report_type: string;
  template_config: Record<string, any>;
  created_at: string;
}

export interface InstitutionReportRules {
  id: string;
  institution_id: string;
  rules: Record<string, any>;
  created_at: string;
}

export interface DepartmentReportRules {
  id: string;
  department_id: string;
  rules: Record<string, any>;
  created_at: string;
}

export interface InstitutionProgram {
  id: string;
  institution_id: string;
  department_id?: string;
  program_type: ProgramType;
  created_at: string;
}

export interface ReportTemplateVersion {
  id: string;
  template_id: string;
  version_number: number;
  template_content: Record<string, any>;
  created_at: string;
}

export interface InstitutionRequirement {
  id: string;
  institution_id: string;
  requirement_type: string;
  requirement_data: Record<string, any>;
}

export interface OrganizationEquipment {
  id: string;
  organization_id: string;
  equipment_id?: string;
  name: string;
  metadata: Record<string, any>;
}

export interface OrganizationProcess {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  metadata: Record<string, any>;
}

export interface OrganizationSafetyRule {
  id: string;
  organization_id: string;
  rule_name: string;
  rule_text: string;
}

export interface OrganizationDepartmentExtended {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  metadata: Record<string, any>;
}

export interface JobLog {
  id: string;
  intelligence_job_id?: string;
  job_type: string;
  level: string;
  message: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ProcessingMetric {
  id: string;
  job_type: string;
  job_id?: string;
  latency_ms?: number;
  status: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface SystemEvent {
  id: string;
  user_id?: string;
  workspace_id?: string;
  event_type: string;
  payload: Record<string, any>;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  workspace_id?: string;
  payment_id?: string;
  transaction_type: TransactionType;
  amount: number;
  status: string;
  created_at: string;
}