/**
 * API functions for project workspace operations
 * Handles milestones, tasks, tickets, and repositories
 */

import { supabase } from '@/lib/supabase';
import type { 
  Milestone, 
  MilestoneInsert, 
  MilestoneUpdate
} from '@/types/database/milestones';
import type {
  Task,
  TaskInsert,
  TaskUpdate
} from '@/types/database/tasks';
import type {
  Ticket,
  TicketInsert,
  TicketUpdate
} from '@/types/database/tickets';
import type {
  Repository,
  RepositoryInsert,
  RepositoryUpdate
} from '@/types/database/repositories';

// =====================================================
// MILESTONES API
// =====================================================

export const milestonesApi = {
  // Get all milestones for a project
  async getMilestones(projectId: string): Promise<Milestone[]> {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get a single milestone
  async getMilestone(id: string): Promise<Milestone | null> {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new milestone
  async createMilestone(milestone: MilestoneInsert): Promise<Milestone> {
    const { data, error } = await supabase
      .from('milestones')
      .insert(milestone)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a milestone
  async updateMilestone(id: string, updates: MilestoneUpdate): Promise<Milestone> {
    const { data, error } = await supabase
      .from('milestones')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a milestone
  async deleteMilestone(id: string): Promise<void> {
    const { error } = await supabase
      .from('milestones')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// =====================================================
// TASKS API
// =====================================================

export const tasksApi = {
  // Get all tasks for a project
  async getTasks(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get tasks by milestone
  async getTasksByMilestone(milestoneId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('milestone_id', milestoneId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get a single task
  async getTask(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new task
  async createTask(task: TaskInsert): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a task
  async updateTask(id: string, updates: TaskUpdate): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// =====================================================
// TICKETS API
// =====================================================

export const ticketsApi = {
  // Get all tickets for a project
  async getTickets(projectId: string): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get a single ticket
  async getTicket(id: string): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new ticket
  async createTicket(ticket: TicketInsert): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .insert(ticket)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a ticket
  async updateTicket(id: string, updates: TicketUpdate): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a ticket
  async deleteTicket(id: string): Promise<void> {
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// =====================================================
// REPOSITORIES API
// =====================================================

export const repositoriesApi = {
  // Get all repositories for a project
  async getRepositories(projectId: string): Promise<Repository[]> {
    const { data, error } = await supabase
      .from('repositories')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get a single repository
  async getRepository(id: string): Promise<Repository | null> {
    const { data, error } = await supabase
      .from('repositories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new repository
  async createRepository(repository: RepositoryInsert): Promise<Repository> {
    const { data, error } = await supabase
      .from('repositories')
      .insert(repository)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a repository
  async updateRepository(id: string, updates: RepositoryUpdate): Promise<Repository> {
    const { data, error } = await supabase
      .from('repositories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a repository
  async deleteRepository(id: string): Promise<void> {
    const { error } = await supabase
      .from('repositories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Sync repository (placeholder for future implementation)
  async syncRepository(id: string): Promise<void> {
    // This would trigger a sync with the external provider
    // For now, just update the sync status
    await this.updateRepository(id, {
      sync_status: 'syncing',
      last_sync: new Date().toISOString()
    });
  }
};
