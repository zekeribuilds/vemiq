export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  university?: string;
  department?: string;
  level?: string;
  created_at: string;
}

export interface Report {
  id: string;
  user_id: string;
  title: string;
  report_type: 'SWEP' | 'SIWES';
  status: 'draft' | 'generating' | 'completed';
  created_at: string;
}

export interface WeeklyLog {
  id: string;
  report_id: string;
  week_number: number;
  title: string;
  description: string;
  images: string[];
  created_at: string;
}

export interface ReportSection {
  id: string;
  report_id: string;
  section_type: string;
  content: string;
  order_index: number;
}

export interface ChatMessage {
  id: string;
  report_id: string;
  section_id: string;
  role: 'user' | 'assistant';
  message: string;
}
