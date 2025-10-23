import { useState } from "react";
import { Plus, Search, Filter, FileText, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalCard } from "@/components/proposals/ProposalCard";
import { ProposalTemplateCard } from "@/components/proposals/ProposalTemplateCard";
import { useProposals, useProposalTemplates } from "@/hooks/useProposals";
// Loading component will be handled by the existing loading state

// This component will use real data from the API

export default function ProposalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("proposals");

  // Fetch data
  const { data: proposalsData, isLoading: proposalsLoading } = useProposals({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const { data: templatesData, isLoading: templatesLoading } = useProposalTemplates();

  const proposals = proposalsData?.data || [];
  const templates = templatesData?.data || [];

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#151A29]">Proposals & SoW Generator</h1>
            <p className="text-[#8A8F98] mt-2">
              Create, manage, and track your client proposals and statements of work
            </p>
          </div>
          <Button className="bg-[#4998F3] hover:bg-[#3A7BC8] text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Proposal
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="proposals" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Proposals
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Templates
            </TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mt-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8A8F98]" />
              <Input
                placeholder={activeTab === "proposals" ? "Search proposals..." : "Search templates..."}
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {activeTab === "proposals" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-[#E5E7EB] rounded-md bg-white"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="under_review">Under Review</option>
                <option value="negotiating">Negotiating</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="signed">Signed</option>
              </select>
            )}
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          <TabsContent value="proposals">
            {proposalsLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-[#8A8F98]">Loading proposals...</div>
              </div>
            ) : (
              <>
                {/* Proposals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProposals.map((proposal) => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      onView={(id) => console.log('View proposal:', id)}
                      onEdit={(id) => console.log('Edit proposal:', id)}
                      onDelete={(id) => console.log('Delete proposal:', id)}
                    />
                  ))}
                </div>

                {filteredProposals.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-[#8A8F98] mb-4">
                      No proposals found matching your criteria.
                    </div>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first proposal
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="templates">
            {templatesLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-[#8A8F98]">Loading templates...</div>
              </div>
            ) : (
              <>
                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <ProposalTemplateCard
                      key={template.id}
                      template={template}
                      onView={(id) => console.log('View template:', id)}
                      onEdit={(id) => console.log('Edit template:', id)}
                      onDuplicate={(id) => console.log('Duplicate template:', id)}
                      onDelete={(id) => console.log('Delete template:', id)}
                    />
                  ))}
                </div>

                {filteredTemplates.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-[#8A8F98] mb-4">
                      No templates found matching your criteria.
                    </div>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first template
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-[#151A29]">{proposals.length}</div>
              <p className="text-sm text-[#8A8F98]">Total Proposals</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-[#3AC569]">
                {proposals.filter(p => p.status === "signed").length}
              </div>
              <p className="text-sm text-[#8A8F98]">Signed</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-[#151A29]">
                {templates.length}
              </div>
              <p className="text-sm text-[#8A8F98]">Templates</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-[#151A29]">
                {proposals.length > 0 ? Math.round((proposals.filter(p => p.status === "signed").length / proposals.length) * 100) : 0}%
              </div>
              <p className="text-sm text-[#8A8F98]">Success Rate</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}