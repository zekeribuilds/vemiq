export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          matric_number: string | null
          phone_number: string | null
          academic_level: string | null
          institution_id: string | null
          faculty_id: string | null
          department_id: string | null
          subscription_plan: string
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          matric_number?: string | null
          phone_number?: string | null
          academic_level?: string | null
          institution_id?: string | null
          faculty_id?: string | null
          department_id?: string | null
          subscription_plan?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          matric_number?: string | null
          phone_number?: string | null
          academic_level?: string | null
          institution_id?: string | null
          faculty_id?: string | null
          department_id?: string | null
          subscription_plan?: string
          onboarding_completed?: boolean
          updated_at?: string
        }
      }
      institutions: {
        Row: {
          id: string
          name: string
          acronym: string | null
          institution_type: string | null
          state: string | null
          logo_url: string | null
          website: string | null
          search_keywords: string[] | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          acronym?: string | null
          institution_type?: string | null
          state?: string | null
          logo_url?: string | null
          website?: string | null
          search_keywords?: string[] | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          acronym?: string | null
          institution_type?: string | null
          state?: string | null
          logo_url?: string | null
          website?: string | null
          search_keywords?: string[] | null
          active?: boolean
        }
      }
      faculties: {
        Row: {
          id: string
          institution_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          institution_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          institution_id?: string
          name?: string
        }
      }
      departments: {
        Row: {
          id: string
          institution_id: string
          faculty_id: string | null
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          institution_id: string
          faculty_id?: string | null
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          institution_id?: string
          faculty_id?: string | null
          name?: string
        }
      }
      training_organizations: {
        Row: {
          id: string
          name: string
          acronym: string | null
          organization_type: string | null
          address: string | null
          city: string | null
          state: string | null
          website: string | null
          logo_url: string | null
          description: string | null
          industry: string | null
          verified: boolean
          created_by_user: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          acronym?: string | null
          organization_type?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          website?: string | null
          logo_url?: string | null
          description?: string | null
          industry?: string | null
          verified?: boolean
          created_by_user?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          acronym?: string | null
          organization_type?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          website?: string | null
          logo_url?: string | null
          description?: string | null
          industry?: string | null
          verified?: boolean
          created_by_user?: string | null
          updated_at?: string
        }
      }
      organization_departments: {
        Row: {
          id: string
          organization_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
        }
      }
      organization_submissions: {
        Row: {
          id: string
          submitted_by: string
          proposed_name: string | null
          proposed_description: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          submitted_by: string
          proposed_name?: string | null
          proposed_description?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          submitted_by?: string
          proposed_name?: string | null
          proposed_description?: string | null
          status?: string
        }
      }
      organization_knowledge: {
        Row: {
          id: string
          organization_id: string
          section_type: string | null
          content: string | null
          source: string | null
          verified: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          section_type?: string | null
          content?: string | null
          source?: string | null
          verified?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          section_type?: string | null
          content?: string | null
          source?: string | null
          verified?: boolean
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          user_id: string
          title: string
          report_type: string
          status: string
          institution_id: string | null
          faculty_id: string | null
          department_id: string | null
          organization_id: string | null
          progress_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          report_type: string
          status?: string
          institution_id?: string | null
          faculty_id?: string | null
          department_id?: string | null
          organization_id?: string | null
          progress_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          report_type?: string
          status?: string
          institution_id?: string | null
          faculty_id?: string | null
          department_id?: string | null
          organization_id?: string | null
          progress_percentage?: number
          updated_at?: string
        }
      }
      report_metadata: {
        Row: {
          id: string
          report_id: string
          student_name: string | null
          matric_number: string | null
          academic_level: string | null
          academic_session: string | null
          coordinator_name: string | null
          supervisor_name: string | null
          organization_department_id: string | null
          start_date: string | null
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          report_id: string
          student_name?: string | null
          matric_number?: string | null
          academic_level?: string | null
          academic_session?: string | null
          coordinator_name?: string | null
          supervisor_name?: string | null
          organization_department_id?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          student_name?: string | null
          matric_number?: string | null
          academic_level?: string | null
          academic_session?: string | null
          coordinator_name?: string | null
          supervisor_name?: string | null
          organization_department_id?: string | null
          start_date?: string | null
          end_date?: string | null
        }
      }
      report_sections: {
        Row: {
          id: string
          report_id: string
          section_type: string | null
          title: string | null
          content: string | null
          sort_order: number | null
          ai_generated: boolean
          last_generated_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          report_id: string
          section_type?: string | null
          title?: string | null
          content?: string | null
          sort_order?: number | null
          ai_generated?: boolean
          last_generated_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          section_type?: string | null
          title?: string | null
          content?: string | null
          sort_order?: number | null
          ai_generated?: boolean
          last_generated_at?: string | null
          updated_at?: string
        }
      }
      report_subsections: {
        Row: {
          id: string
          section_id: string
          title: string | null
          content: string | null
          sort_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_id: string
          title?: string | null
          content?: string | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_id?: string
          title?: string | null
          content?: string | null
          sort_order?: number | null
          updated_at?: string
        }
      }
      weekly_logs: {
        Row: {
          id: string
          report_id: string
          week_number: number | null
          title: string | null
          description: string | null
          summary: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          report_id: string
          week_number?: number | null
          title?: string | null
          description?: string | null
          summary?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          week_number?: number | null
          title?: string | null
          description?: string | null
          summary?: string | null
          status?: string
          updated_at?: string
        }
      }
      weekly_log_images: {
        Row: {
          id: string
          weekly_log_id: string
          image_url: string | null
          caption: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          weekly_log_id: string
          image_url?: string | null
          caption?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          weekly_log_id?: string
          image_url?: string | null
          caption?: string | null
        }
      }
      chat_threads: {
        Row: {
          id: string
          report_id: string
          section_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          report_id: string
          section_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          section_id?: string | null
        }
      }
      chat_messages: {
        Row: {
          id: string
          thread_id: string
          role: string
          message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          thread_id: string
          role: string
          message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          thread_id?: string
          role?: string
          message?: string | null
        }
      }
      uploads: {
        Row: {
          id: string
          user_id: string | null
          report_id: string | null
          file_name: string | null
          file_url: string | null
          file_type: string | null
          file_size: number | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          report_id?: string | null
          file_name?: string | null
          file_url?: string | null
          file_type?: string | null
          file_size?: number | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          report_id?: string | null
          file_name?: string | null
          file_url?: string | null
          file_type?: string | null
          file_size?: number | null
        }
      }
      report_versions: {
        Row: {
          id: string
          report_id: string
          version_number: number | null
          pdf_url: string | null
          generated_at: string
        }
        Insert: {
          id?: string
          report_id: string
          version_number?: number | null
          pdf_url?: string | null
          generated_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          version_number?: number | null
          pdf_url?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          report_id: string | null
          amount: number
          currency: string
          payment_reference: string
          status: string
          provider: string
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          report_id?: string | null
          amount: number
          currency?: string
          payment_reference: string
          status: string
          provider?: string
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          report_id?: string | null
          amount?: number
          currency?: string
          payment_reference?: string
          status?: string
          provider?: string
          paid_at?: string | null
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          default_institution_id: string | null
          default_faculty_id: string | null
          default_department_id: string | null
          theme: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          default_institution_id?: string | null
          default_faculty_id?: string | null
          default_department_id?: string | null
          theme?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          default_institution_id?: string | null
          default_faculty_id?: string | null
          default_department_id?: string | null
          theme?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Institution = Database['public']['Tables']['institutions']['Row']
export type InstitutionInsert = Database['public']['Tables']['institutions']['Insert']
export type InstitutionUpdate = Database['public']['Tables']['institutions']['Update']

export type Faculty = Database['public']['Tables']['faculties']['Row']
export type FacultyInsert = Database['public']['Tables']['faculties']['Insert']
export type FacultyUpdate = Database['public']['Tables']['faculties']['Update']

export type Department = Database['public']['Tables']['departments']['Row']
export type DepartmentInsert = Database['public']['Tables']['departments']['Insert']
export type DepartmentUpdate = Database['public']['Tables']['departments']['Update']

export type TrainingOrganization = Database['public']['Tables']['training_organizations']['Row']
export type TrainingOrganizationInsert = Database['public']['Tables']['training_organizations']['Insert']
export type TrainingOrganizationUpdate = Database['public']['Tables']['training_organizations']['Update']

export type OrganizationDepartment = Database['public']['Tables']['organization_departments']['Row']
export type OrganizationDepartmentInsert = Database['public']['Tables']['organization_departments']['Insert']
export type OrganizationDepartmentUpdate = Database['public']['Tables']['organization_departments']['Update']

export type OrganizationSubmission = Database['public']['Tables']['organization_submissions']['Row']
export type OrganizationSubmissionInsert = Database['public']['Tables']['organization_submissions']['Insert']
export type OrganizationSubmissionUpdate = Database['public']['Tables']['organization_submissions']['Update']

export type OrganizationKnowledge = Database['public']['Tables']['organization_knowledge']['Row']
export type OrganizationKnowledgeInsert = Database['public']['Tables']['organization_knowledge']['Insert']
export type OrganizationKnowledgeUpdate = Database['public']['Tables']['organization_knowledge']['Update']

export type Report = Database['public']['Tables']['reports']['Row']
export type ReportInsert = Database['public']['Tables']['reports']['Insert']
export type ReportUpdate = Database['public']['Tables']['reports']['Update']

export type ReportMetadata = Database['public']['Tables']['report_metadata']['Row']
export type ReportMetadataInsert = Database['public']['Tables']['report_metadata']['Insert']
export type ReportMetadataUpdate = Database['public']['Tables']['report_metadata']['Update']

export type ReportSection = Database['public']['Tables']['report_sections']['Row']
export type ReportSectionInsert = Database['public']['Tables']['report_sections']['Insert']
export type ReportSectionUpdate = Database['public']['Tables']['report_sections']['Update']

export type ReportSubsection = Database['public']['Tables']['report_subsections']['Row']
export type ReportSubsectionInsert = Database['public']['Tables']['report_subsections']['Insert']
export type ReportSubsectionUpdate = Database['public']['Tables']['report_subsections']['Update']

export type WeeklyLog = Database['public']['Tables']['weekly_logs']['Row']
export type WeeklyLogInsert = Database['public']['Tables']['weekly_logs']['Insert']
export type WeeklyLogUpdate = Database['public']['Tables']['weekly_logs']['Update']

export type WeeklyLogImage = Database['public']['Tables']['weekly_log_images']['Row']
export type WeeklyLogImageInsert = Database['public']['Tables']['weekly_log_images']['Insert']
export type WeeklyLogImageUpdate = Database['public']['Tables']['weekly_log_images']['Update']

export type ChatThread = Database['public']['Tables']['chat_threads']['Row']
export type ChatThreadInsert = Database['public']['Tables']['chat_threads']['Insert']
export type ChatThreadUpdate = Database['public']['Tables']['chat_threads']['Update']

export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
export type ChatMessageInsert = Database['public']['Tables']['chat_messages']['Insert']
export type ChatMessageUpdate = Database['public']['Tables']['chat_messages']['Update']

export type Upload = Database['public']['Tables']['uploads']['Row']
export type UploadInsert = Database['public']['Tables']['uploads']['Insert']
export type UploadUpdate = Database['public']['Tables']['uploads']['Update']

export type ReportVersion = Database['public']['Tables']['report_versions']['Row']
export type ReportVersionInsert = Database['public']['Tables']['report_versions']['Insert']
export type ReportVersionUpdate = Database['public']['Tables']['report_versions']['Update']

export type Payment = Database['public']['Tables']['payments']['Row']
export type PaymentInsert = Database['public']['Tables']['payments']['Insert']
export type PaymentUpdate = Database['public']['Tables']['payments']['Update']

export type UserSettings = Database['public']['Tables']['user_settings']['Row']
export type UserSettingsInsert = Database['public']['Tables']['user_settings']['Insert']
export type UserSettingsUpdate = Database['public']['Tables']['user_settings']['Update']

export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
export type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert']
export type AuditLogUpdate = Database['public']['Tables']['audit_logs']['Update']
