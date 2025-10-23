/**
 * React Query hooks for project workspace operations
 * Handles milestones, tasks, tickets, and repositories
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  milestonesApi, 
  tasksApi, 
  ticketsApi, 
  repositoriesApi 
} from '@/api/project-workspace';
import type { 
  MilestoneInsert, 
  MilestoneUpdate
} from '@/types/database/milestones';
import type {
  TaskInsert,
  TaskUpdate
} from '@/types/database/tasks';
import type {
  TicketInsert,
  TicketUpdate
} from '@/types/database/tickets';
import type {
  RepositoryInsert,
  RepositoryUpdate
} from '@/types/database/repositories';

// =====================================================
// MILESTONES HOOKS
// =====================================================

export const useMilestones = (projectId: string) => {
  return useQuery({
    queryKey: ['milestones', projectId],
    queryFn: () => milestonesApi.getMilestones(projectId),
    enabled: !!projectId,
  });
};

export const useMilestone = (id: string) => {
  return useQuery({
    queryKey: ['milestone', id],
    queryFn: () => milestonesApi.getMilestone(id),
    enabled: !!id,
  });
};

export const useCreateMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (milestone: MilestoneInsert) => milestonesApi.createMilestone(milestone),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['milestones', data.project_id] });
      toast.success('Milestone created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create milestone');
      console.error('Create milestone error:', error);
    },
  });
};

export const useUpdateMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: MilestoneUpdate }) => 
      milestonesApi.updateMilestone(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['milestones', data.project_id] });
      queryClient.invalidateQueries({ queryKey: ['milestone', data.id] });
      toast.success('Milestone updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update milestone');
      console.error('Update milestone error:', error);
    },
  });
};

export const useDeleteMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => milestonesApi.deleteMilestone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
      toast.success('Milestone deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete milestone');
      console.error('Delete milestone error:', error);
    },
  });
};

// =====================================================
// TASKS HOOKS
// =====================================================

export const useTasks = (projectId: string) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => tasksApi.getTasks(projectId),
    enabled: !!projectId,
  });
};

export const useTasksByMilestone = (milestoneId: string) => {
  return useQuery({
    queryKey: ['tasks', 'milestone', milestoneId],
    queryFn: () => tasksApi.getTasksByMilestone(milestoneId),
    enabled: !!milestoneId,
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => tasksApi.getTask(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: TaskInsert) => tasksApi.createTask(task),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id] });
      if (data.milestone_id) {
        queryClient.invalidateQueries({ queryKey: ['tasks', 'milestone', data.milestone_id] });
      }
      toast.success('Task created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create task');
      console.error('Create task error:', error);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: TaskUpdate }) => 
      tasksApi.updateTask(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id] });
      queryClient.invalidateQueries({ queryKey: ['task', data.id] });
      if (data.milestone_id) {
        queryClient.invalidateQueries({ queryKey: ['tasks', 'milestone', data.milestone_id] });
      }
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update task');
      console.error('Update task error:', error);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete task');
      console.error('Delete task error:', error);
    },
  });
};

// =====================================================
// TICKETS HOOKS
// =====================================================

export const useTickets = (projectId: string) => {
  return useQuery({
    queryKey: ['tickets', projectId],
    queryFn: () => ticketsApi.getTickets(projectId),
    enabled: !!projectId,
  });
};

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketsApi.getTicket(id),
    enabled: !!id,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticket: TicketInsert) => ticketsApi.createTicket(ticket),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', data.project_id] });
      toast.success('Ticket created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create ticket');
      console.error('Create ticket error:', error);
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: TicketUpdate }) => 
      ticketsApi.updateTicket(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', data.project_id] });
      queryClient.invalidateQueries({ queryKey: ['ticket', data.id] });
      toast.success('Ticket updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update ticket');
      console.error('Update ticket error:', error);
    },
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ticketsApi.deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete ticket');
      console.error('Delete ticket error:', error);
    },
  });
};

// =====================================================
// REPOSITORIES HOOKS
// =====================================================

export const useRepositories = (projectId: string) => {
  return useQuery({
    queryKey: ['repositories', projectId],
    queryFn: () => repositoriesApi.getRepositories(projectId),
    enabled: !!projectId,
  });
};

export const useRepository = (id: string) => {
  return useQuery({
    queryKey: ['repository', id],
    queryFn: () => repositoriesApi.getRepository(id),
    enabled: !!id,
  });
};

export const useCreateRepository = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repository: RepositoryInsert) => repositoriesApi.createRepository(repository),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['repositories', data.project_id] });
      toast.success('Repository connected successfully');
    },
    onError: (error) => {
      toast.error('Failed to connect repository');
      console.error('Create repository error:', error);
    },
  });
};

export const useUpdateRepository = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: RepositoryUpdate }) => 
      repositoriesApi.updateRepository(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['repositories', data.project_id] });
      queryClient.invalidateQueries({ queryKey: ['repository', data.id] });
      toast.success('Repository updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update repository');
      console.error('Update repository error:', error);
    },
  });
};

export const useDeleteRepository = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repositoriesApi.deleteRepository(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      toast.success('Repository disconnected successfully');
    },
    onError: (error) => {
      toast.error('Failed to disconnect repository');
      console.error('Delete repository error:', error);
    },
  });
};

export const useSyncRepository = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repositoriesApi.syncRepository(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      queryClient.invalidateQueries({ queryKey: ['repository', id] });
      toast.success('Repository sync initiated');
    },
    onError: (error) => {
      toast.error('Failed to sync repository');
      console.error('Sync repository error:', error);
    },
  });
};
