/**
 * Enhanced Dashboard Page
 * Comprehensive workspace with projects, meetings, notifications, KPIs, and quick actions
 */

import { useDashboardSummary } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectsCard } from '@/components/dashboard/ProjectsCard';
import { MeetingsCard } from '@/components/dashboard/MeetingsCard';
import { NotificationsCard } from '@/components/dashboard/NotificationsCard';
import { KpiMetricsCard } from '@/components/dashboard/KpiMetricsCard';
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Bell,
  Activity,
  LogIn,
  Users,
  Target,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const { data: dashboardData, isLoading, error } = useDashboardSummary();

  // Show public dashboard view when not authenticated
  if (!isAuthenticated) {
    return (
      <AppLayout>
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary">Welcome to Autopilot Studio</h1>
          <p className="text-text-secondary mt-2">
            Your comprehensive workspace for project management and collaboration.
          </p>
        </div>

        {/* Public Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Revenue",
              value: "$45,231",
              change: "+20.1%",
              changeType: "positive" as const,
              icon: DollarSign,
              description: "from last month"
            },
            {
              title: "Active Projects",
              value: "12",
              change: "+2",
              changeType: "positive" as const,
              icon: BarChart3,
              description: "projects in progress"
            },
            {
              title: "Upcoming Meetings",
              value: "8",
              change: "+1",
              changeType: "positive" as const,
              icon: Calendar,
              description: "scheduled meetings"
            },
            {
              title: "Notifications",
              value: "3",
              change: "-3",
              changeType: "positive" as const,
              icon: Bell,
              description: "unread alerts"
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-text-secondary">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                  <p className="text-xs text-text-secondary flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span className={stat.changeType === "positive" ? "text-positive" : "text-negative"}>
                      {stat.change}
                    </span>
                    <span>{stat.description}</span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Public Dashboard Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Demo Content */}
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Featured Projects
                </CardTitle>
                <CardDescription>Discover what you can accomplish with Autopilot Studio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Website Redesign", client: "Tech Corp", status: "active", progress: 75 },
                    { name: "Mobile App Development", client: "StartupXYZ", status: "in_progress", progress: 45 },
                    { name: "Brand Identity", client: "Creative Agency", status: "completed", progress: 100 }
                  ].map((project, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-hover-overlay transition-colors">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">{project.name}</p>
                        <p className="text-xs text-text-secondary">Client: {project.client}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn(
                          project.status === 'active' ? 'bg-positive' :
                          project.status === 'in_progress' ? 'bg-primary' :
                          project.status === 'completed' ? 'bg-accent' :
                          'bg-text-secondary',
                          'text-white text-xs'
                        )}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-text-secondary">{project.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>Stay on top of your schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Team Standup", time: "9:00 AM", date: "Today" },
                    { title: "Client Review", time: "2:00 PM", date: "Tomorrow" },
                    { title: "Project Planning", time: "10:00 AM", date: "Friday" }
                  ].map((event, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-hover-overlay transition-colors">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">{event.title}</p>
                        <p className="text-xs text-text-secondary">{event.date} at {event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Login Prompt */}
          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5 text-primary" />
                  Get Started
                </CardTitle>
                <CardDescription>Sign in to access your personalized dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-text-secondary">
                  Unlock the full potential of Autopilot Studio with personalized project management, 
                  team collaboration, and advanced analytics.
                </p>
                <div className="flex flex-col gap-2">
                  <Button asChild className="w-full">
                    <a href="/login">Sign In</a>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <a href="/signup">Create Account</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Target className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Bell className="h-4 w-4 mr-2" />
                    View Notifications
                  </Button>
                </div>
                <p className="text-xs text-text-secondary mt-3">
                  Sign in to access these features
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Platform Features
            </CardTitle>
            <CardDescription>Everything you need to manage your projects effectively</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: BarChart3, title: "Project Management", description: "Organize and track your projects with ease" },
                { icon: Users, title: "Team Collaboration", description: "Work together seamlessly with your team" },
                { icon: Calendar, title: "Meeting Scheduler", description: "Never miss an important meeting again" },
                { icon: Bell, title: "Smart Notifications", description: "Stay informed with intelligent alerts" }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-text-primary mb-2">{feature.title}</h3>
                    <p className="text-sm text-text-secondary">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="mb-8">
          <div className="h-8 bg-muted rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-96 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-muted rounded w-32 mb-2"></div>
                <div className="h-4 bg-muted rounded w-48"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <div className="h-16 w-16 bg-negative/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="h-8 w-8 text-negative" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Failed to Load Dashboard</h2>
          <p className="text-text-secondary mb-6">There was an error loading your dashboard data.</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </AppLayout>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231",
      change: "+20.1%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "from last month"
    },
    {
      title: "Active Projects",
      value: dashboardData?.stats.totalProjects?.toString() || "0",
      change: "+2",
      changeType: "positive" as const,
      icon: BarChart3,
      description: "projects in progress"
    },
    {
      title: "Upcoming Meetings",
      value: dashboardData?.stats.upcomingMeetings?.toString() || "0",
      change: "+1",
      changeType: "positive" as const,
      icon: Calendar,
      description: "scheduled meetings"
    },
    {
      title: "Notifications",
      value: dashboardData?.stats.unreadNotifications?.toString() || "0",
      change: "-3",
      changeType: "positive" as const,
      icon: Bell,
      description: "unread alerts"
    }
  ];

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-2">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-text-secondary">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                <p className="text-xs text-text-secondary flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className={stat.changeType === "positive" ? "text-positive" : "text-negative"}>
                    {stat.change}
                  </span>
                  <span>{stat.description}</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Projects and Meetings */}
        <div className="xl:col-span-2 space-y-6">
          <ProjectsCard />
          <MeetingsCard />
        </div>

        {/* Right Column - Notifications and Quick Actions */}
        <div className="space-y-6">
          <NotificationsCard />
          <QuickActionsCard />
        </div>
      </div>

      {/* Bottom Row - KPI Metrics */}
      <div className="mb-8">
        <KpiMetricsCard />
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest updates across your workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData?.projects?.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-hover-overlay transition-colors">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    Project "{project.name}" updated
                  </p>
                  <p className="text-xs text-text-secondary">
                    {project.client_name && `Client: ${project.client_name}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn(
                    project.status === 'active' ? 'bg-positive' :
                    project.status === 'in_progress' ? 'bg-primary' :
                    project.status === 'completed' ? 'bg-accent' :
                    'bg-text-secondary',
                    'text-white text-xs'
                  )}>
                    {project.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-text-secondary">
                    {new Date(project.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted mx-auto mb-4" />
                <h3 className="font-semibold text-text-primary mb-2">No Recent Activity</h3>
                <p className="text-text-secondary">Activity will appear here as you work on projects</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}