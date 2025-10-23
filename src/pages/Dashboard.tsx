import { BarChart3, Users, DollarSign, Clock, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    value: "12",
    change: "+2",
    changeType: "positive" as const,
    icon: BarChart3,
    description: "projects in progress"
  },
  {
    title: "Team Members",
    value: "8",
    change: "+1",
    changeType: "positive" as const,
    icon: Users,
    description: "active team members"
  },
  {
    title: "Avg. Response Time",
    value: "2.4h",
    change: "-0.3h",
    changeType: "positive" as const,
    icon: Clock,
    description: "average response time"
  }
];

const recentActivities = [
  { id: 1, action: "New project created", project: "E-commerce Platform", time: "2 hours ago" },
  { id: 2, action: "Client meeting scheduled", project: "Mobile App Redesign", time: "4 hours ago" },
  { id: 3, action: "Proposal sent", project: "AI Integration", time: "1 day ago" },
  { id: 4, action: "Project completed", project: "Website Redesign", time: "2 days ago" }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-semibold text-text-primary">Autopilot Studio</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Profile</Button>
              <Button variant="outline">Settings</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates on your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">{activity.action}</p>
                      <p className="text-xs text-text-secondary">{activity.project}</p>
                    </div>
                    <span className="text-xs text-text-secondary">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-20 flex flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">New Project</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">Schedule Meeting</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Add Team Member</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <DollarSign className="h-6 w-6" />
                  <span className="text-sm">Create Invoice</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}