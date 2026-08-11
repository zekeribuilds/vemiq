# Vemiq Database Schema Analysis

## Complete Backend Schema Structure

### Core Tables (Legacy System)

#### Institution System
- **institutions**: Academic institutions (`id`, `name`, `logo_url`, `state`, `country`)
- **faculties**: Institution faculties (`id`, `institution_id`, `name`)
- **departments**: Academic departments (`id`, `faculty_id`, `name`)

#### Organization System  
- **training_organizations**: Training companies (`id`, `name`, `address`, `industry`, `logo_url`)
- **organization_departments**: Company departments (`id`, `organization_id`, `name`)
- **organization_knowledge**: Company knowledge base with enhanced fields (`id`, `organization_id`, `overview`, `history`, `mission`, `tools_used`, `safety_rules`, `processes`, `notes`, `equipment_catalog`, `department_catalog`, `safety_procedures`, `workflows`, `technical_processes`)

#### User System
- **profiles**: User profiles (`id`, `full_name`, `avatar_url`, `institution_id`, `faculty_id`, `department_id`, `matric_number`, `academic_session`, `siwes_coordinator_name`, `supervisor_name`, `role`)

#### Logbook System (Legacy)
- **logbooks**: Logbook records with workspace relationship (`id`, `user_id`, `title`, `program_type`, `institution_id`, `training_organization_id`, `department_name`, `start_date`, `end_date`, `status`, `workspace_id`)
- **logbook_entries**: Logbook entries (`id`, `logbook_id`, `user_id`, `entry_date`, `week_number`, `title`, `activity_description`, `ai_cleaned_text`, `source_type`)
- **logbook_evidence**: Evidence files (`id`, `entry_id`, `user_id`, `storage_path`, `file_type`, `mime_type`)

#### Report System
- **reports**: Report records with workspace relationship (`id`, `user_id`, `title`, `report_type`, `institution_id`, `training_organization_id`, `status`, `progress`, `workspace_id`)
- **report_sections**: Report sections (`id`, `report_id`, `title`, `content`, `section_order`, `ai_generated`)
- **report_versions**: Report snapshots (`id`, `report_id`, `snapshot`)
- **report_logbook_entries**: Link between reports and logbook entries
- **report_generation_jobs**: AI generation jobs (`id`, `report_id`, `section_id`, `user_id`, `status`, `prompt`, `generated_content`, `error_message`)

#### Payment System
- **payments**: Payment records with enhanced fields (`id`, `user_id`, `report_id`, `amount`, `currency`, `status`, `reference`, `paystack_reference`, `paystack_transaction_id`, `paid_at`, `gateway_response`, `metadata`)
- **report_access**: Report access control (`id`, `user_id`, `report_id`, `payment_id`, `unlocked_at`, `expires_at`)
- **report_exports**: Export tracking (`id`, `report_id`, `user_id`, `storage_path`, `version_number`)

#### Chat System
- **chat_messages**: Legacy chat (`id`, `user_id`, `report_id`, `role`, `message`)

#### File System
- **uploads**: File uploads (`id`, `user_id`, `file_url`, `file_type`, `linked_to`)
- **activity_logs**: Activity tracking (`id`, `user_id`, `action`, `metadata`)

### Evidence Infrastructure (New System)

#### Core Evidence Tables
- **workspaces**: Main workspace entity (`id`, `user_id`, `name`, `workspace_type`, `institution_id`, `training_organization_id`, `start_date`, `end_date`, `status`)
  - `workspace_type` enum: 'siwes', 'swep', 'project', 'internship', 'research', 'career'
  - `status` enum: 'active', 'completed', 'archived'

- **evidence_items**: Evidence records (`id`, `workspace_id`, `user_id`, `title`, `activity_name`, `description`, `source_type`, `evidence_date`, `week_number`, `section_name`, `supervisor_name`, `confidence_score`, `verification_status`, `metadata`)
  - `source_type` enum: 'voice', 'photo', 'text', 'logbook_scan', 'document', 'recovery'
  - `verification_status` enum: 'verified', 'reconstructed', 'pending'

- **evidence_media**: Media files (`id`, `evidence_id`, `user_id`, `storage_path`, `media_type`, `mime_type`, `file_size`)
  - `media_type` enum: 'image', 'audio', 'video', 'document', 'sketch', 'logbook_page'

#### Specialized Evidence Tables
- **evidence_images**: Image-specific data (`id`, `evidence_media_id`, `equipment_name`, `equipment_category`, `activity_name`, `week_number`, `caption`, `confidence_score`, `preferred_chapter`, `placement_priority`, `figure_title`, `figure_description`, `preferred_section`)
- **evidence_sketches**: Sketch-specific data (`id`, `evidence_media_id`, `description`, `equipment_name`, `linked_activity`)

#### Documentation Management
- **documentation_health**: Workspace health tracking (`id`, `workspace_id`, `evidence_score`, `week_coverage_score`, `image_coverage_score`, `quality_score`, `missing_weeks`, `health_status`)
- **documentation_passes**: Payment-based access (`id`, `workspace_id`, `user_id`, `payment_id`, `status`, `activated_at`)
- **recovery_sessions**: AI-based evidence recovery (`id`, `workspace_id`, `user_id`, `missing_week`, `interview_data`, `generated_evidence`)

### Intelligence Layer

#### AI Processing Tables
- **evidence_entities**: Extracted entities (`id`, `evidence_id`, `entity_type`, `entity_name`, `confidence_score`)
  - `entity_type` enum: 'equipment', 'machine', 'tool', 'software', 'skill', 'activity', 'process', 'material', 'safety_procedure', 'location'

- **evidence_insights**: AI-generated insights (`id`, `evidence_id`, `summary`, `skills_detected`, `equipment_detected`, `learning_outcomes`, `technical_topics`)
- **voice_transcripts**: Voice processing (`id`, `evidence_id`, `raw_transcript`, `clean_transcript`, `semantic_transcript`, `processing_status`)
- **clarification_sessions**: AI clarification (`id`, `evidence_id`, `status`, `questions`, `answers`)
- **logbook_scan_pages**: OCR processing (`id`, `workspace_id`, `user_id`, `storage_path`, `page_number`, `ocr_text`, `detected_week`, `detected_instructor`, `confidence_score`)
- **intelligence_jobs**: Background job processing (`id`, `user_id`, `workspace_id`, `evidence_id`, `job_type`, `payload`, `status`, `attempts`, `error_message`)

### Master Intelligence Layer

#### Relationship & Tagging
- **evidence_relationships**: Evidence relationships (`id`, `source_evidence_id`, `target_entity_id`, `relationship_type`, `confidence_score`)
- **evidence_tags**: Evidence tagging (`id`, `evidence_id`, `tag_name`, `tag_type`)

#### Equipment & Organization Intelligence
- **equipment_catalog**: Equipment database (`id`, `name`, `category`, `description`, `common_operations`, `safety_procedures`, `report_description`)
- **equipment_components**: Equipment components (`id`, `equipment_id`, `component_name`, `description`)
- **equipment_activities**: Equipment activities (`id`, `equipment_id`, `activity_name`, `report_language`)
- **organization_equipment**: Company-specific equipment (`id`, `organization_id`, `equipment_id`, `name`, `metadata`)
- **organization_processes**: Company processes (`id`, `organization_id`, `name`, `description`, `metadata`)
- **organization_safety_rules**: Company safety rules (`id`, `organization_id`, `rule_name`, `rule_text`)
- **organization_departments_extended**: Extended department info (`id`, `organization_id`, `name`, `description`, `metadata`)

#### Supervisor Management
- **supervisors**: Supervisor records (`id`, `full_name`, `role_type`, `organization_id`, `institution_id`)
  - `role_type` enum: 'siwes_coordinator', 'industrial_supervisor', 'section_instructor'
- **workspace_supervisors**: Workspace supervisor relationships (`id`, `workspace_id`, `supervisor_id`, `start_date`, `end_date`)
- **evidence_supervisors**: Evidence supervisor relationships (`id`, `evidence_id`, `supervisor_id`)

#### Week & Activity Management
- **workspace_weeks**: Week tracking (`id`, `workspace_id`, `week_number`, `start_date`, `end_date`, `status`)
  - `status` enum: 'completed', 'partial', 'missing'
- **week_activity_summary**: Week summaries (`id`, `workspace_week_id`, `evidence_count`, `image_count`, `quality_score`, `summary`)

#### Report Enhancement
- **report_conversations**: Report-specific conversations (`id`, `report_id`, `user_id`)
- **report_messages**: Report conversation messages (`id`, `conversation_id`, `role`, `message`)
- **report_corrections**: Report correction tracking (`id`, `report_id`, `evidence_id`, `old_content`, `new_content`, `reason`, `accepted`)

#### Institution & Templates
- **institution_templates**: Institution report templates (`id`, `institution_id`, `template_name`, `report_type`, `template_config`)
- **institution_report_rules**: Institution-specific rules (`id`, `institution_id`, `rules`)
- **department_report_rules**: Department-specific rules (`id`, `department_id`, `rules`)
- **institution_programs**: Institution programs (`id`, `institution_id`, `department_id`, `program_type`)
- **institution_requirements**: Institution requirements (`id`, `institution_id`, `requirement_type`, `requirement_data`)
- **report_template_versions**: Template versioning (`id`, `template_id`, `version_number`, `template_content`)

#### Transaction & Monitoring
- **transactions**: Financial transactions (`id`, `user_id`, `workspace_id`, `payment_id`, `transaction_type`, `amount`, `status`)
- **job_logs**: Job processing logs (`id`, `intelligence_job_id`, `job_type`, `level`, `message`, `metadata`)
- **processing_metrics**: Performance metrics (`id`, `job_type`, `job_id`, `latency_ms`, `status`, `metadata`)
- **system_events**: System event tracking (`id`, `user_id`, `workspace_id`, `event_type`, `payload`)

### Storage Buckets

1. **avatars**: User profile photos (public)
2. **institution-assets**: Institution logos (public)
3. **organization-assets**: Company logos (public)
4. **logbook-files**: Logbook evidence files (private)
5. **report-exports**: Generated PDFs (private)
6. **evidence-media**: Evidence media files (private)
7. **logbook-scans**: Logbook page scans (private)
8. **profile-assets**: Profile assets (private)

### Key Enums

- **user_role**: 'student', 'admin'
- **program_type**: 'SWEP', 'SIWES'
- **report_status**: 'draft', 'completed'
- **payment_status**: 'pending', 'successful', 'failed'
- **logbook_status**: 'active', 'completed'
- **source_type**: 'text', 'voice', 'image', 'mixed'
- **file_type**: 'image', 'audio', 'pdf', 'document'
- **chat_role**: 'user', 'assistant'
- **generation_status**: 'pending', 'processing', 'completed', 'failed'

### Critical Frontend Alignment Points

1. **Workspace vs Program**: Frontend should use `workspaces` table instead of non-existent `programs` table
2. **Evidence System**: Frontend should leverage the evidence infrastructure (`evidence_items`, `evidence_media`, etc.)
3. **Enum Values**: Ensure frontend uses correct enum values (e.g., 'siwes'/'swep' for workspace_type, not 'SIWES'/'SWEP')
4. **Payment Fields**: Payment records have additional fields like `paystack_reference`, `metadata`, etc.
5. **Report Relationships**: Reports can be linked to workspaces via `workspace_id` field
6. **Storage Paths**: Use correct storage bucket names and path structures
7. **Supervisor System**: New supervisor management system should be utilized
8. **Week Management**: Use `workspace_weeks` for week tracking instead of manual week_number fields