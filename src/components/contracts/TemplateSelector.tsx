import { useState } from "react";
import { Search, Check, X, FileText, Tag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import type { ContractTemplate } from "@/types/database";

interface TemplateSelectorProps {
  templates: ContractTemplate[];
  onSelect: (template: ContractTemplate) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TemplateSelector({ templates, onSelect, onCancel, isLoading }: TemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { value: "all", label: "All Templates" },
    { value: "general", label: "General" },
    { value: "nda", label: "NDA" },
    { value: "sow", label: "SOW" },
    { value: "msa", label: "MSA" },
    { value: "custom", label: "Custom" },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nda': return 'bg-purple-100 text-purple-800';
      case 'sow': return 'bg-blue-100 text-blue-800';
      case 'msa': return 'bg-green-100 text-green-800';
      case 'custom': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'nda': return 'NDA';
      case 'sow': return 'SOW';
      case 'msa': return 'MSA';
      case 'custom': return 'Custom';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#4998F3]" />
              Select Contract Template
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8A8F98]" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={selectedCategory === category.value ? "bg-[#4998F3] text-white" : ""}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-[#8A8F98]">Loading templates...</div>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-[#8A8F98] mx-auto mb-4" />
                <div className="text-[#8A8F98] mb-4">
                  No templates found matching your criteria.
                </div>
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {filteredTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card 
                        className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-2 hover:border-[#4998F3]"
                        onClick={() => onSelect(template)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-[#151A29] truncate">
                                  {template.name}
                                </h3>
                                {template.description && (
                                  <p className="text-sm text-[#8A8F98] mt-1 line-clamp-2">
                                    {template.description}
                                  </p>
                                )}
                              </div>
                              <Badge className={getCategoryColor(template.category)}>
                                {getCategoryText(template.category)}
                              </Badge>
                            </div>

                            {/* Content Preview */}
                            <div className="text-sm text-[#8A8F98] line-clamp-3">
                              {template.template_content.substring(0, 120)}...
                            </div>

                            {/* Metadata */}
                            <div className="flex items-center justify-between text-xs text-[#8A8F98]">
                              <div className="flex items-center gap-4">
                                {template.variables && Object.keys(template.variables).length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Tag className="h-3 w-3" />
                                    <span>{Object.keys(template.variables).length} variables</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(template.created_at)}</span>
                                </div>
                              </div>
                              {template.is_public && (
                                <span className="text-green-600 font-medium">Public</span>
                              )}
                            </div>

                            {/* Select Button */}
                            <Button 
                              size="sm" 
                              className="w-full bg-[#4998F3] hover:bg-[#3A7BC8] text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelect(template);
                              }}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Use This Template
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
