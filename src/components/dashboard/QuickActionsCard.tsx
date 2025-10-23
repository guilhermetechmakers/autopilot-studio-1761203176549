/**
 * Quick Actions Card Component
 * Provides shortcuts to common tasks and actions
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Calendar, 
  Users, 
  DollarSign, 
  FileText, 
  Settings, 
  BarChart3, 
  MessageSquare,
  Upload,
  Search,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionsCardProps {
  className?: string;
}

const quickActions = [
  {
    id: 'new-project',
    title: 'New Project',
    description: 'Create a new project',
    icon: Plus,
    color: 'bg-primary hover:bg-primary/90',
    href: '/projects/new'
  },
  {
    id: 'schedule-meeting',
    title: 'Schedule Meeting',
    description: 'Book a meeting',
    icon: Calendar,
    color: 'bg-positive hover:bg-positive/90',
    href: '/meetings/new'
  },
  {
    id: 'add-team-member',
    title: 'Add Team Member',
    description: 'Invite team member',
    icon: Users,
    color: 'bg-chart-blue hover:bg-chart-blue/90',
    href: '/team/invite'
  },
  {
    id: 'create-invoice',
    title: 'Create Invoice',
    description: 'Generate invoice',
    icon: DollarSign,
    color: 'bg-chart-orange hover:bg-chart-orange/90',
    href: '/billing/invoices/new'
  },
  {
    id: 'new-proposal',
    title: 'New Proposal',
    description: 'Create proposal',
    icon: FileText,
    color: 'bg-primary hover:bg-primary/90',
    href: '/proposals/new'
  },
  {
    id: 'view-analytics',
    title: 'View Analytics',
    description: 'Check performance',
    icon: BarChart3,
    color: 'bg-accent hover:bg-accent/90',
    href: '/analytics'
  },
  {
    id: 'send-message',
    title: 'Send Message',
    description: 'Contact team',
    icon: MessageSquare,
    color: 'bg-chart-blue hover:bg-chart-blue/90',
    href: '/messages/new'
  },
  {
    id: 'upload-file',
    title: 'Upload File',
    description: 'Share documents',
    icon: Upload,
    color: 'bg-text-secondary hover:bg-text-secondary/90',
    href: '/files/upload'
  }
];

export function QuickActionsCard({ className }: QuickActionsCardProps) {
  const handleActionClick = (action: typeof quickActions[0]) => {
    // In a real app, this would navigate to the action
    console.log('Action clicked:', action.id);
    // For now, we'll just show an alert
    alert(`Action: ${action.title}`);
  };

  return (
    <Card className={cn('card-hover', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="ghost"
                className={cn(
                  'h-20 flex flex-col gap-2 p-4 hover:scale-105 transition-all duration-200',
                  action.color
                )}
                onClick={() => handleActionClick(action)}
              >
                <Icon className="h-6 w-6 text-white" />
                <div className="text-center">
                  <div className="text-sm font-medium text-white">
                    {action.title}
                  </div>
                  <div className="text-xs text-white/80">
                    {action.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
            <Button variant="outline" className="h-12 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
