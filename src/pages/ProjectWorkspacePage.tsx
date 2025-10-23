import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare, 
  GitBranch,
  Bot,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Filter,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for demonstration
const mockProject = {
  id: "1",
  name: "E-commerce Platform",
  client: "TechCorp Inc.",
  status: "In Progress",
  progress: 75,
  dueDate: "2024-02-15",
  budget: "$25,000",
  description: "A comprehensive e-commerce platform with modern UI/UX, payment integration, and admin dashboard.",
  team: [
    { name: "John Doe", role: "Project Manager", avatar: "JD", status: "online" },
    { name: "Jane Smith", role: "Lead Developer", avatar: "JS", status: "online" },
    { name: "Mike Johnson", role: "UI/UX Designer", avatar: "MJ", status: "away" }
  ],
  milestones: [
    { id: 1, title: "Project Setup", status: "completed", dueDate: "2024-01-15", progress: 100 },
    { id: 2, title: "UI/UX Design", status: "completed", dueDate: "2024-01-25", progress: 100 },
    { id: 3, title: "Frontend Development", status: "in_progress", dueDate: "2024-02-05", progress: 80 },
    { id: 4, title: "Backend Integration", status: "pending", dueDate: "2024-02-10", progress: 0 },
    { id: 5, title: "Testing & Launch", status: "pending", dueDate: "2024-02-15", progress: 0 }
  ],
  tasks: [
    { id: 1, title: "Setup development environment", status: "completed", assignee: "Jane Smith", priority: "high" },
    { id: 2, title: "Create user authentication", status: "in_progress", assignee: "Jane Smith", priority: "high" },
    { id: 3, title: "Design product catalog", status: "completed", assignee: "Mike Johnson", priority: "medium" },
    { id: 4, title: "Implement payment gateway", status: "todo", assignee: "John Doe", priority: "high" },
    { id: 5, title: "Write API documentation", status: "todo", assignee: "Jane Smith", priority: "low" }
  ],
  tickets: [
    { id: 1, title: "Fix login validation bug", type: "bug", status: "open", priority: "high", assignee: "Jane Smith" },
    { id: 2, title: "Add dark mode support", type: "feature", status: "in_progress", priority: "medium", assignee: "Mike Johnson" },
    { id: 3, title: "Optimize database queries", type: "improvement", status: "resolved", priority: "low", assignee: "John Doe" }
  ],
  repositories: [
    { id: 1, name: "ecommerce-frontend", provider: "github", url: "https://github.com/company/ecommerce-frontend", lastSync: "2 hours ago" },
    { id: 2, name: "ecommerce-backend", provider: "github", url: "https://github.com/company/ecommerce-backend", lastSync: "1 hour ago" }
  ]
};

export default function ProjectWorkspacePage() {
  const { id: _id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-gray-100 text-gray-800";
      case "open": return "bg-red-100 text-red-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "todo": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="hover:bg-hover-overlay">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
              <div className="h-8 w-px bg-border"></div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-semibold text-text-primary">Autopilot Studio</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  placeholder="Search workspace..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">{mockProject.name}</h1>
              <p className="text-text-secondary mt-2">{mockProject.client}</p>
              <p className="text-text-secondary mt-1">{mockProject.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-text-secondary">Budget</div>
                <div className="text-lg font-semibold text-text-primary">{mockProject.budget}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-text-secondary">Due Date</div>
                <div className="text-lg font-semibold text-text-primary">{mockProject.dueDate}</div>
              </div>
              <Button className="btn-primary">Edit Project</Button>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">Project Progress</span>
                  <span className="text-sm text-text-secondary">{mockProject.progress}%</span>
                </div>
                <Progress value={mockProject.progress} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="milestones" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Milestones
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="tickets" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Tickets
              </TabsTrigger>
              <TabsTrigger value="repos" className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Repositories
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Team Members */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Team Members
                      </CardTitle>
                      <CardDescription>People working on this project</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockProject.team.map((member, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-hover-overlay transition-colors"
                          >
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                  {member.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                                member.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-text-primary">{member.name}</h4>
                              <p className="text-sm text-text-secondary">{member.role}</p>
                            </div>
                            <Button variant="outline" size="sm">Message</Button>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>Latest updates and changes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-text-primary">Jane Smith completed task "Setup development environment"</p>
                            <p className="text-xs text-text-secondary">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="h-2 w-2 bg-chart-orange rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-text-primary">New ticket created: "Fix login validation bug"</p>
                            <p className="text-xs text-text-secondary">4 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="h-2 w-2 bg-chart-blue rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-text-primary">Repository "ecommerce-frontend" updated</p>
                            <p className="text-xs text-text-secondary">6 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Tasks Completed</span>
                        <span className="text-text-primary font-medium">24/32</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Hours Logged</span>
                        <span className="text-text-primary font-medium">156h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Open Tickets</span>
                        <span className="text-text-primary font-medium">2</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Repositories</span>
                        <span className="text-text-primary font-medium">2</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Copilot */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        AI Copilot
                      </CardTitle>
                      <CardDescription>Get AI assistance for your project</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Ask about project status
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate documentation
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Review code quality
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Milestones Tab */}
            <TabsContent value="milestones" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Milestones</CardTitle>
                  <CardDescription>Key deliverables and deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProject.milestones.map((milestone, index) => (
                      <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-hover-overlay transition-colors"
                      >
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          milestone.status === "completed" 
                            ? "bg-green-100 text-green-800" 
                            : milestone.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {milestone.id}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-text-primary">{milestone.title}</h4>
                          <p className="text-sm text-text-secondary">Due: {milestone.dueDate}</p>
                          <Progress value={milestone.progress} className="mt-2 h-2" />
                        </div>
                        <Badge className={getStatusColor(milestone.status)}>
                          {milestone.status.replace('_', ' ')}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['todo', 'in_progress', 'review', 'completed'].map((status) => (
                  <Card key={status}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium capitalize">
                        {status.replace('_', ' ')} ({mockProject.tasks.filter(t => t.status === status).length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {mockProject.tasks
                        .filter(task => task.status === status)
                        .map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className="p-3 border border-border rounded-lg bg-card hover:bg-hover-overlay transition-colors cursor-pointer"
                          >
                            <h4 className="text-sm font-medium text-text-primary mb-1">{task.title}</h4>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-text-secondary">{task.assignee}</span>
                              <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tickets Tab */}
            <TabsContent value="tickets" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Tickets</CardTitle>
                  <CardDescription>Issues and feature requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProject.tickets.map((ticket, index) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-hover-overlay transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-text-primary">{ticket.title}</h4>
                          <p className="text-sm text-text-secondary">Assigned to {ticket.assignee}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                          <Badge variant="outline">
                            {ticket.type}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Repositories Tab */}
            <TabsContent value="repos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Repository Integrations</CardTitle>
                  <CardDescription>Connected Git repositories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProject.repositories.map((repo, index) => (
                      <motion.div
                        key={repo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-hover-overlay transition-colors"
                      >
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <GitBranch className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-text-primary">{repo.name}</h4>
                          <p className="text-sm text-text-secondary">{repo.url}</p>
                          <p className="text-xs text-text-secondary">Last sync: {repo.lastSync}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{repo.provider}</Badge>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
