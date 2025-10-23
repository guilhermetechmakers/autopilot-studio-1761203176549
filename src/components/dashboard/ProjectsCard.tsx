/**
 * Projects Card Component
 * Displays active projects with progress and status
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useActiveProjects } from '@/hooks/useDashboard';
import { Plus, Calendar, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ProjectsCardProps {
  className?: string;
}

export function ProjectsCard({ className }: ProjectsCardProps) {
  const { data: projects, isLoading, error } = useActiveProjects();

  if (isLoading) {
    return (
      <Card className={cn('card-hover', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Active Projects
          </CardTitle>
          <CardDescription>Your current projects and their progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn('card-hover', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Active Projects
          </CardTitle>
          <CardDescription>Your current projects and their progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-text-secondary">Failed to load projects</p>
            <Button variant="outline" size="sm" className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-positive text-white';
      case 'in_progress':
        return 'bg-primary text-white';
      case 'on_hold':
        return 'bg-text-secondary text-white';
      case 'completed':
        return 'bg-accent text-white';
      default:
        return 'bg-muted text-text-primary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-negative text-white';
      case 'high':
        return 'bg-chart-orange text-white';
      case 'medium':
        return 'bg-chart-blue text-white';
      case 'low':
        return 'bg-muted text-text-primary';
      default:
        return 'bg-muted text-text-primary';
    }
  };

  return (
    <Card className={cn('card-hover', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Active Projects
            </CardTitle>
            <CardDescription>Your current projects and their progress</CardDescription>
          </div>
          <Button size="sm" className="btn-primary">
            <Plus className="h-4 w-4 mr-1" />
            New Project
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {projects && projects.length > 0 ? (
          <div className="space-y-4">
            {projects.slice(0, 5).map((project) => (
              <div key={project.id} className="border border-border rounded-lg p-4 hover:bg-hover-overlay transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-text-primary mb-1">{project.name}</h4>
                    {project.client_name && (
                      <p className="text-sm text-text-secondary mb-2">{project.client_name}</p>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                  </div>
                  {project.budget && (
                    <div className="text-right">
                      <p className="text-sm font-semibold text-text-primary">
                        ${project.budget.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Progress</span>
                    <span className="font-medium text-text-primary">{project.progress_percentage}%</span>
                  </div>
                  <Progress value={project.progress_percentage} className="h-2" />
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-text-secondary">
                  <div className="flex items-center gap-4">
                    {project.start_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(project.start_date), 'MMM dd')}</span>
                      </div>
                    )}
                    {project.end_date && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Due {format(new Date(project.end_date), 'MMM dd')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {projects.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="outline" size="sm">
                  View All Projects ({projects.length})
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted mx-auto mb-4" />
            <h3 className="font-semibold text-text-primary mb-2">No Active Projects</h3>
            <p className="text-text-secondary mb-4">Get started by creating your first project</p>
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
