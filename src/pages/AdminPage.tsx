import { useState } from "react";
import { Users, Settings, Shield, BarChart3, UserPlus, Key, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-01-20",
    avatar: "JD"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Developer",
    status: "Active",
    lastLogin: "2024-01-19",
    avatar: "JS"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Designer",
    status: "Inactive",
    lastLogin: "2024-01-15",
    avatar: "MJ"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "Manager",
    status: "Active",
    lastLogin: "2024-01-20",
    avatar: "SW"
  }
];

const roleColors = {
  "Admin": "bg-red-100 text-red-800",
  "Manager": "bg-blue-100 text-blue-800",
  "Developer": "bg-green-100 text-green-800",
  "Designer": "bg-purple-100 text-purple-800"
};

const statusColors = {
  "Active": "bg-green-100 text-green-800",
  "Inactive": "bg-gray-100 text-gray-800",
  "Pending": "bg-yellow-100 text-yellow-800"
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  const tabs = [
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
    { id: "analytics", label: "Analytics", icon: BarChart3 }
  ];

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
            <h1 className="text-3xl font-bold text-text-primary">Admin Panel</h1>
            <p className="text-text-secondary mt-2">
              Manage users, settings, and system configuration
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </Button>
            <Button className="btn-primary">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-text-secondary">Total Users</span>
              </div>
              <div className="text-2xl font-bold text-text-primary">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-text-secondary">Active Users</span>
              </div>
              <div className="text-2xl font-bold text-text-primary">
                {users.filter(u => u.status === "Active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-text-secondary">Projects</span>
              </div>
              <div className="text-2xl font-bold text-text-primary">24</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-text-secondary">Admins</span>
              </div>
              <div className="text-2xl font-bold text-text-primary">
                {users.filter(u => u.role === "Admin").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-6">
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
          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage team members and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">{user.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary">{user.name}</h4>
                        <p className="text-sm text-text-secondary">{user.email}</p>
                        <p className="text-xs text-text-secondary">Last login: {user.lastLogin}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role as keyof typeof roleColors]}`}>
                          {user.role}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[user.status as keyof typeof statusColors]}`}>
                          {user.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Basic application configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-text-primary">Company Name</label>
                      <input 
                        type="text" 
                        defaultValue="Autopilot Studio"
                        className="w-full mt-1 p-2 border border-border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-primary">Default Timezone</label>
                      <select className="w-full mt-1 p-2 border border-border rounded-md">
                        <option>UTC-8 (Pacific)</option>
                        <option>UTC-5 (Eastern)</option>
                        <option>UTC+0 (GMT)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-primary">Currency</label>
                      <select className="w-full mt-1 p-2 border border-border rounded-md">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure system notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary">Email Notifications</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary">Project Updates</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary">Billing Alerts</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary">Security Alerts</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "security" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                  <CardDescription>Configure login and security settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary">Two-Factor Authentication</span>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary">Password Requirements</span>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary">Session Timeout</span>
                      <select className="px-3 py-1 border border-border rounded-md">
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>4 hours</option>
                        <option>24 hours</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Security</CardTitle>
                  <CardDescription>Manage API keys and access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary">API Rate Limiting</span>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary">CORS Settings</span>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary">API Keys</span>
                      <Button variant="outline" size="sm">View Keys</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="text-center py-12">
              <div className="text-text-secondary mb-4">
                Analytics dashboard coming soon.
              </div>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}