import { useState } from "react";
import { Plus, Search, Filter, Download, Eye, Edit, MoreHorizontal, DollarSign, CreditCard, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const invoices = [
  {
    id: "INV-001",
    client: "TechCorp Inc.",
    project: "E-commerce Platform",
    amount: 25000,
    status: "Paid",
    dueDate: "2024-01-15",
    paidDate: "2024-01-10",
    description: "Phase 1 Development"
  },
  {
    id: "INV-002",
    client: "StartupXYZ",
    project: "Mobile App Redesign",
    amount: 15000,
    status: "Pending",
    dueDate: "2024-02-01",
    paidDate: null,
    description: "UI/UX Design & Development"
  },
  {
    id: "INV-003",
    client: "DataFlow Systems",
    project: "AI Integration",
    amount: 35000,
    status: "Overdue",
    dueDate: "2024-01-20",
    paidDate: null,
    description: "AI Model Integration & Testing"
  },
  {
    id: "INV-004",
    client: "Creative Agency",
    project: "Website Redesign",
    amount: 12000,
    status: "Draft",
    dueDate: "2024-02-15",
    paidDate: null,
    description: "Complete Website Redesign"
  }
];

const statusColors = {
  "Draft": "bg-gray-100 text-gray-800",
  "Pending": "bg-yellow-100 text-yellow-800",
  "Paid": "bg-green-100 text-green-800",
  "Overdue": "bg-red-100 text-red-800"
};

const expenses = [
  {
    id: 1,
    description: "Software Licenses",
    amount: 500,
    category: "Software",
    date: "2024-01-15",
    status: "Approved"
  },
  {
    id: 2,
    description: "Office Supplies",
    amount: 200,
    category: "Office",
    date: "2024-01-20",
    status: "Pending"
  },
  {
    id: 3,
    description: "Cloud Services",
    amount: 300,
    category: "Infrastructure",
    date: "2024-01-25",
    status: "Approved"
  }
];

export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("invoices");

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = invoices
    .filter(inv => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingAmount = invoices
    .filter(inv => inv.status === "Pending")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueAmount = invoices
    .filter(inv => inv.status === "Overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

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
            <h1 className="text-3xl font-bold text-text-primary">Billing & Invoices</h1>
            <p className="text-text-secondary mt-2">
              Manage your invoices, payments, and financial tracking
            </p>
          </div>
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-text-secondary">Total Revenue</span>
              </div>
              <div className="text-2xl font-bold text-text-primary">${totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-text-secondary">Pending</span>
              </div>
              <div className="text-2xl font-bold text-text-primary">${pendingAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-text-secondary">Overdue</span>
              </div>
              <div className="text-2xl font-bold text-text-primary">${overdueAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-text-secondary">This Month</span>
              </div>
              <div className="text-2xl font-bold text-text-primary">$45,000</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <nav className="flex space-x-8">
            {[
              { id: "invoices", label: "Invoices" },
              { id: "expenses", label: "Expenses" },
              { id: "reports", label: "Reports" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Search invoices..."
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
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Content */}
        {activeTab === "invoices" && (
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="card-hover">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-text-primary">{invoice.id}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status as keyof typeof statusColors]}`}>
                          {invoice.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-text-secondary">
                        <div>
                          <span className="font-medium">Client:</span> {invoice.client}
                        </div>
                        <div>
                          <span className="font-medium">Project:</span> {invoice.project}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> ${invoice.amount.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Due Date:</span> {invoice.dueDate}
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary mt-2">{invoice.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "expenses" && (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <Card key={expense.id} className="card-hover">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-primary">{expense.description}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-text-secondary mt-2">
                        <div>
                          <span className="font-medium">Amount:</span> ${expense.amount}
                        </div>
                        <div>
                          <span className="font-medium">Category:</span> {expense.category}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {expense.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        expense.status === "Approved" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {expense.status}
                      </span>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "reports" && (
          <div className="text-center py-12">
            <div className="text-text-secondary mb-4">
              Financial reports and analytics coming soon.
            </div>
            <Button variant="outline">
              Generate Report
            </Button>
          </div>
        )}

        {filteredInvoices.length === 0 && activeTab === "invoices" && (
          <div className="text-center py-12">
            <div className="text-text-secondary mb-4">
              No invoices found matching your criteria.
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create your first invoice
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}