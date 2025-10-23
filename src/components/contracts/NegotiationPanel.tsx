import { useState } from "react";
import { Clock, User, MessageSquare, GitBranch, Eye, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "motion/react";
import type { ContractVersion } from "@/types/database";

interface NegotiationPanelProps {
  versions: ContractVersion[];
  currentVersion: ContractVersion | null;
  onVersionSelect: (version: ContractVersion) => void;
  onCreateVersion: (changeSummary: string) => void;
  onAcceptVersion: (version: ContractVersion) => void;
  onRejectVersion: (version: ContractVersion) => void;
  isLoading?: boolean;
}

export function NegotiationPanel({ 
  versions, 
  currentVersion, 
  onVersionSelect, 
  onCreateVersion, 
  onAcceptVersion, 
  onRejectVersion,
  isLoading 
}: NegotiationPanelProps) {
  const [activeTab, setActiveTab] = useState("versions");
  const [newVersionSummary, setNewVersionSummary] = useState("");
  const [showCreateVersion, setShowCreateVersion] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVersionStatus = (version: ContractVersion) => {
    if (version.is_current) return "current";
    // Add more status logic based on your business rules
    return "previous";
  };

  const getVersionStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800';
      case 'previous': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateVersion = () => {
    if (newVersionSummary.trim()) {
      onCreateVersion(newVersionSummary);
      setNewVersionSummary("");
      setShowCreateVersion(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-[#4998F3]" />
          Contract Negotiation
        </CardTitle>
        <p className="text-sm text-[#8A8F98]">
          Manage contract versions and track negotiation changes
        </p>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
            <TabsTrigger value="versions" className="rounded-none">
              Versions
            </TabsTrigger>
            <TabsTrigger value="comments" className="rounded-none">
              Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="versions" className="p-4 space-y-4">
            {/* Current Version Info */}
            {currentVersion && (
              <div className="bg-[#E9F3FE] p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[#151A29]">Current Version</h3>
                  <Badge className={getVersionStatusColor(getVersionStatus(currentVersion))}>
                    v{currentVersion.version_number}
                  </Badge>
                </div>
                <p className="text-sm text-[#8A8F98]">
                  {currentVersion.change_summary || "Initial version"}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-[#8A8F98]">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{currentVersion.created_by_name || "System"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(currentVersion.created_at)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Create New Version */}
            <div className="space-y-3">
              <Button 
                onClick={() => setShowCreateVersion(!showCreateVersion)}
                className="w-full bg-[#4998F3] hover:bg-[#3A7BC8] text-white"
              >
                <GitBranch className="h-4 w-4 mr-2" />
                Create New Version
              </Button>

              <AnimatePresence>
                {showCreateVersion && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 p-4 border border-[#E5E7EB] rounded-lg"
                  >
                    <div>
                      <label className="block text-sm font-medium text-[#151A29] mb-2">
                        Change Summary
                      </label>
                      <textarea
                        value={newVersionSummary}
                        onChange={(e) => setNewVersionSummary(e.target.value)}
                        placeholder="Describe the changes made to this version..."
                        className="w-full p-3 border border-[#E5E7EB] rounded-md resize-none"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleCreateVersion}
                        disabled={!newVersionSummary.trim()}
                        size="sm"
                        className="bg-[#4998F3] hover:bg-[#3A7BC8] text-white"
                      >
                        Create Version
                      </Button>
                      <Button 
                        onClick={() => setShowCreateVersion(false)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Version History */}
            <div className="space-y-2">
              <h4 className="font-medium text-[#151A29]">Version History</h4>
              {isLoading ? (
                <div className="text-center py-8 text-[#8A8F98]">
                  Loading versions...
                </div>
              ) : versions.length === 0 ? (
                <div className="text-center py-8 text-[#8A8F98]">
                  No versions available
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <AnimatePresence>
                    {versions.map((version) => (
                      <motion.div
                        key={version.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card 
                          className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
                            version.is_current ? 'border-[#4998F3] bg-[#E9F3FE]' : 'hover:border-[#E5E7EB]'
                          }`}
                          onClick={() => onVersionSelect(version)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={getVersionStatusColor(getVersionStatus(version))}>
                                    v{version.version_number}
                                  </Badge>
                                  {version.is_current && (
                                    <span className="text-xs text-[#4998F3] font-medium">Current</span>
                                  )}
                                </div>
                                <p className="text-sm text-[#8A8F98] line-clamp-2">
                                  {version.change_summary || "No description provided"}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-[#8A8F98]">
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span>{version.created_by_name || "System"}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatDate(version.created_at)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 ml-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onVersionSelect(version);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {!version.is_current && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onAcceptVersion(version);
                                      }}
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onRejectVersion(version);
                                      }}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="p-4">
            <div className="text-center py-8 text-[#8A8F98]">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Comments feature coming soon</p>
              <p className="text-sm">Track negotiation discussions and feedback</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
