import { useState } from "react";
import { Plus, Search, Filter, FileText, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContractCard } from "@/components/contracts/ContractCard";
import { ContractTemplateCard } from "@/components/contracts/ContractTemplateCard";
import { useContracts, useContractTemplates } from "@/hooks/useContracts";

export default function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("contracts");

  // Fetch data
  const { data: contractsData, isLoading: contractsLoading } = useContracts();
  const { data: templatesData, isLoading: templatesLoading } = useContractTemplates();

  const contracts = contractsData || [];
  const templates = templatesData || [];

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (contract.client_name && contract.client_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
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
            <h1 className="text-3xl font-bold text-[#151A29]">E-Contracts & Signatures</h1>
            <p className="text-[#8A8F98] mt-2">
              Create, manage, and execute legally binding contracts with digital signatures
            </p>
          </div>
          <Button className="bg-[#4998F3] hover:bg-[#3A7BC8] text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Contract
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contracts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Contracts
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
                placeholder={activeTab === "contracts" ? "Search contracts..." : "Search templates..."}
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {activeTab === "contracts" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-[#E5E7EB] rounded-md bg-white"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending_review">Pending Review</option>
                <option value="pending_signature">Pending Signature</option>
                <option value="signed">Signed</option>
                <option value="executed">Executed</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
            )}
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          <TabsContent value="contracts">
            {contractsLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-[#8A8F98]">Loading contracts...</div>
              </div>
            ) : (
              <>
                {/* Contracts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContracts.map((contract) => (
                    <ContractCard
                      key={contract.id}
                      contract={contract}
                      onView={(id) => console.log('View contract:', id)}
                      onEdit={(id) => console.log('Edit contract:', id)}
                      onSign={(id) => console.log('Sign contract:', id)}
                      onDelete={(id) => console.log('Delete contract:', id)}
                    />
                  ))}
                </div>

                {filteredContracts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-[#8A8F98] mb-4">
                      No contracts found matching your criteria.
                    </div>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first contract
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
                    <ContractTemplateCard
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
              <div className="text-2xl font-bold text-[#151A29]">{contracts.length}</div>
              <p className="text-sm text-[#8A8F98]">Total Contracts</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-[#3AC569]">
                {contracts.filter(c => c.status === "signed" || c.status === "executed").length}
              </div>
              <p className="text-sm text-[#8A8F98]">Signed/Executed</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-[#4998F3]">
                {contracts.filter(c => c.status === "pending_signature").length}
              </div>
              <p className="text-sm text-[#8A8F98]">Pending Signature</p>
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
        </div>
      </div>
    </div>
  );
}
