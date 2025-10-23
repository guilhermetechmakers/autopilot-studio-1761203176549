import { useState } from "react";
import { Plus, Search, Filter, Eye, Edit, Send, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const proposals = [
  {
    id: 1,
    title: "E-commerce Platform Proposal",
    client: "TechCorp Inc.",
    status: "Draft",
    value: "$25,000",
    createdDate: "2024-01-15",
    dueDate: "2024-02-01",
    lastModified: "2024-01-20"
  },
  {
    id: 2,
    title: "Mobile App Development",
    client: "StartupXYZ",
    status: "Sent",
    value: "$15,000",
    createdDate: "2024-01-10",
    dueDate: "2024-01-25",
    lastModified: "2024-01-18"
  },
  {
    id: 3,
    title: "AI Integration Project",
    client: "DataFlow Systems",
    status: "Accepted",
    value: "$35,000",
    createdDate: "2024-01-05",
    dueDate: "2024-01-20",
    lastModified: "2024-01-22"
  },
  {
    id: 4,
    title: "Website Redesign",
    client: "Creative Agency",
    status: "Rejected",
    value: "$12,000",
    createdDate: "2024-01-01",
    dueDate: "2024-01-15",
    lastModified: "2024-01-16"
  }
];

const statusColors = {
  "Draft": "bg-yellow-100 text-yellow-800",
  "Sent": "bg-blue-100 text-blue-800",
  "Accepted": "bg-green-100 text-green-800",
  "Rejected": "bg-red-100 text-red-800",
  "Expired": "bg-gray-100 text-gray-800"
};

export default function ProposalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || proposal.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

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
            <h1 className="text-3xl font-bold text-text-primary">Proposals</h1>
            <p className="text-text-secondary mt-2">
              Create, manage, and track your client proposals
            </p>
          </div>
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Proposal
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Search proposals..."
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
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <Card key={proposal.id} className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-text-primary">{proposal.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[proposal.status as keyof typeof statusColors]}`}>
                        {proposal.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-text-secondary">
                      <div>
                        <span className="font-medium">Client:</span> {proposal.client}
                      </div>
                      <div>
                        <span className="font-medium">Value:</span> {proposal.value}
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span> {proposal.dueDate}
                      </div>
                      <div>
                        <span className="font-medium">Last Modified:</span> {proposal.lastModified}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {proposal.status === "Draft" && (
                      <Button variant="ghost" size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProposals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-text-secondary mb-4">
              No proposals found matching your criteria.
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create your first proposal
            </Button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-text-primary">{proposals.length}</div>
              <p className="text-sm text-text-secondary">Total Proposals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-positive">
                {proposals.filter(p => p.status === "Accepted").length}
              </div>
              <p className="text-sm text-text-secondary">Accepted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-text-primary">
                ${proposals
                  .filter(p => p.status === "Accepted")
                  .reduce((sum, p) => sum + parseInt(p.value.replace(/[$,]/g, '')), 0)
                  .toLocaleString()}
              </div>
              <p className="text-sm text-text-secondary">Total Value</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-text-primary">
                {Math.round((proposals.filter(p => p.status === "Accepted").length / proposals.length) * 100)}%
              </div>
              <p className="text-sm text-text-secondary">Success Rate</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}