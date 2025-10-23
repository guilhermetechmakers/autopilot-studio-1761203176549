import { useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Users, FileText, MessageSquare, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock project data
const projectData = {
  id: 1,
  name: "E-commerce Platform",
  client: "TechCorp Inc.",
  status: "In Progress",
  progress: 75,
  dueDate: "2024-02-15",
  budget: "$25,000",
  description: "A comprehensive e-commerce platform with modern UI/UX, payment integration, and admin dashboard.",
  team: [
    { name: "John Doe", role: "Project Manager", avatar: "JD" },
    { name: "Jane Smith", role: "Lead Developer", avatar: "JS" },
    { name: "Mike Johnson", role: "UI/UX Designer", avatar: "MJ" }
  ],
  milestones: [
    { id: 1, title: "Project Setup", status: "Completed", dueDate: "2024-01-15" },
    { id: 2, title: "UI/UX Design", status: "Completed", dueDate: "2024-01-25" },
    { id: 3, title: "Frontend Development", status: "In Progress", dueDate: "2024-02-05" },
    { id: 4, title: "Backend Integration", status: "Pending", dueDate: "2024-02-10" },
    { id: 5, title: "Testing & Launch", status: "Pending", dueDate: "2024-02-15" }
  ]
};

export default function ProjectDetailsPage() {
  const { id: _id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "team", label: "Team", icon: Users },
    { id: "milestones", label: "Milestones", icon: Calendar },
    { id: "discussions", label: "Discussions", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
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
              <Button variant="ghost">Profile</Button>
              <Button variant="outline">Settings</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">{projectData.name}</h1>
              <p className="text-text-secondary mt-2">{projectData.client}</p>
              <p className="text-text-secondary mt-1">{projectData.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-text-secondary">Budget</div>
                <div className="text-lg font-semibold text-text-primary">{projectData.budget}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-text-secondary">Due Date</div>
                <div className="text-lg font-semibold text-text-primary">{projectData.dueDate}</div>
              </div>
              <Button className="btn-primary">Edit Project</Button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">Project Progress</span>
                <span className="text-sm text-text-secondary">{projectData.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${projectData.progress}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                    <CardDescription>Key information about this project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-text-secondary">Status</span>
                          <p className="text-text-primary font-medium">{projectData.status}</p>
                        </div>
                        <div>
                          <span className="text-sm text-text-secondary">Priority</span>
                          <p className="text-text-primary font-medium">High</p>
                        </div>
                        <div>
                          <span className="text-sm text-text-secondary">Start Date</span>
                          <p className="text-text-primary font-medium">2024-01-01</p>
                        </div>
                        <div>
                          <span className="text-sm text-text-secondary">Duration</span>
                          <p className="text-text-primary font-medium">6 weeks</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Tasks Completed</span>
                        <span className="text-text-primary font-medium">24/32</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Hours Logged</span>
                        <span className="text-text-primary font-medium">156h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Files Uploaded</span>
                        <span className="text-text-primary font-medium">47</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>People working on this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectData.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">{member.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary">{member.name}</h4>
                        <p className="text-sm text-text-secondary">{member.role}</p>
                      </div>
                      <Button variant="outline" size="sm">Message</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "milestones" && (
            <Card>
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
                <CardDescription>Key deliverables and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectData.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        milestone.status === "Completed" 
                          ? "bg-green-100 text-green-800" 
                          : milestone.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {milestone.id}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary">{milestone.title}</h4>
                        <p className="text-sm text-text-secondary">Due: {milestone.dueDate}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        milestone.status === "Completed" 
                          ? "bg-green-100 text-green-800" 
                          : milestone.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {milestone.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}