import { useState } from "react";
import { Plus, Search, Filter, CheckCircle, Clock, AlertCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const tasks = [
  {
    id: 1,
    title: "Design homepage mockup",
    project: "E-commerce Platform",
    assignee: "Jane Smith",
    status: "In Progress",
    priority: "High",
    dueDate: "2024-02-15",
    tags: ["Design", "Frontend"]
  },
  {
    id: 2,
    title: "Set up database schema",
    project: "Mobile App Redesign",
    assignee: "John Doe",
    status: "Completed",
    priority: "Medium",
    dueDate: "2024-02-10",
    tags: ["Backend", "Database"]
  },
  {
    id: 3,
    title: "Implement user authentication",
    project: "AI Integration",
    assignee: "Mike Johnson",
    status: "Pending",
    priority: "High",
    dueDate: "2024-02-20",
    tags: ["Backend", "Security"]
  },
  {
    id: 4,
    title: "Write API documentation",
    project: "Website Redesign",
    assignee: "Sarah Wilson",
    status: "In Progress",
    priority: "Low",
    dueDate: "2024-02-25",
    tags: ["Documentation", "API"]
  },
  {
    id: 5,
    title: "Code review for payment module",
    project: "E-commerce Platform",
    assignee: "Alex Brown",
    status: "Pending",
    priority: "Medium",
    dueDate: "2024-02-12",
    tags: ["Review", "Payment"]
  }
];

const statusColors = {
  "Pending": "bg-gray-100 text-gray-800",
  "In Progress": "bg-blue-100 text-blue-800",
  "Completed": "bg-green-100 text-green-800",
  "Blocked": "bg-red-100 text-red-800"
};

const priorityColors = {
  "Low": "bg-green-100 text-green-800",
  "Medium": "bg-yellow-100 text-yellow-800",
  "High": "bg-red-100 text-red-800"
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "High":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "Medium":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "Low":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === "all" || task.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const toggleTaskStatus = (taskId: number) => {
    // TODO: Implement task status toggle
    console.log("Toggle task status:", taskId);
  };

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Tasks</h1>
            <p className="text-text-secondary mt-2">
              Manage and track your team's tasks and assignments
            </p>
          </div>
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center ${
                      task.status === "Completed" 
                        ? "bg-green-500 border-green-500 text-white" 
                        : "border-gray-300 hover:border-primary"
                    }`}
                  >
                    {task.status === "Completed" && <CheckCircle className="h-3 w-3" />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className={`text-lg font-medium ${
                          task.status === "Completed" ? "line-through text-text-secondary" : "text-text-primary"
                        }`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-text-secondary">{task.project}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status as keyof typeof statusColors]}`}>
                          {task.status}
                        </span>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
                      <div className="flex items-center gap-1">
                        <span>Assigned to:</span>
                        <span className="font-medium text-text-primary">{task.assignee}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Due:</span>
                        <span className="font-medium text-text-primary">{task.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getPriorityIcon(task.priority)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-text-secondary mb-4">
              No tasks found matching your criteria.
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create your first task
            </Button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-text-primary">{tasks.length}</div>
              <p className="text-sm text-text-secondary">Total Tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {tasks.filter(t => t.status === "In Progress").length}
              </div>
              <p className="text-sm text-text-secondary">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {tasks.filter(t => t.status === "Completed").length}
              </div>
              <p className="text-sm text-text-secondary">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {tasks.filter(t => t.priority === "High").length}
              </div>
              <p className="text-sm text-text-secondary">High Priority</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}