import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const projects = [
  {
    id: 1,
    name: "E-commerce Platform",
    client: "TechCorp Inc.",
    status: "In Progress",
    progress: 75,
    dueDate: "2024-02-15",
    budget: "$25,000"
  },
  {
    id: 2,
    name: "Mobile App Redesign",
    client: "StartupXYZ",
    status: "Planning",
    progress: 25,
    dueDate: "2024-03-01",
    budget: "$15,000"
  },
  {
    id: 3,
    name: "AI Integration",
    client: "DataFlow Systems",
    status: "Completed",
    progress: 100,
    dueDate: "2024-01-30",
    budget: "$35,000"
  },
  {
    id: 4,
    name: "Website Redesign",
    client: "Creative Agency",
    status: "In Progress",
    progress: 60,
    dueDate: "2024-02-28",
    budget: "$12,000"
  }
];

const statusColors = {
  "Planning": "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  "Completed": "bg-green-100 text-green-800",
  "On Hold": "bg-gray-100 text-gray-800"
};

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold text-text-primary">Projects</h1>
            <p className="text-text-secondary mt-2">
              Manage and track all your client projects
            </p>
          </div>
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="card-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>{project.client}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status as keyof typeof statusColors]}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Progress</span>
                      <span className="text-text-primary font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-text-secondary">Due Date</span>
                      <p className="text-text-primary font-medium">{project.dueDate}</p>
                    </div>
                    <div>
                      <span className="text-text-secondary">Budget</span>
                      <p className="text-text-primary font-medium">{project.budget}</p>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-text-secondary mb-4">
              No projects found matching your search.
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create your first project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}