// User types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'admin' | 'owner' | 'pm' | 'dev' | 'client' | 'billing';
  company_id?: string;
  created_at: string;
  updated_at: string;
}

// Project types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'paused' | 'cancelled';
  client_id: string;
  pm_id: string;
  budget: number;
  currency: string;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

// Lead/Intake types
export interface Lead {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  budget_range: string;
  timeline: string;
  tech_stack: string[];
  goals: string;
  qualification_score: number;
  status: 'new' | 'qualified' | 'proposal_sent' | 'signed' | 'lost';
  created_at: string;
  updated_at: string;
}

// Proposal types
export interface Proposal {
  id: string;
  lead_id: string;
  project_id?: string;
  title: string;
  content: string;
  version: number;
  status: 'draft' | 'sent' | 'signed' | 'rejected';
  total_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

// Task/Ticket types
export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

// Meeting types
export interface Meeting {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  attendees: string[];
  recording_url?: string;
  transcript?: string;
  minutes?: string;
  action_items: ActionItem[];
  created_at: string;
  updated_at: string;
}

export interface ActionItem {
  id: string;
  meeting_id: string;
  description: string;
  assignee_id: string;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

// Invoice types
export interface Invoice {
  id: string;
  project_id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
  paid_date?: string;
  created_at: string;
  updated_at: string;
}

// Notification types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}