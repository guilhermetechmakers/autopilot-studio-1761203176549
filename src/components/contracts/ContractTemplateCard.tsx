import { MoreVertical, Eye, Edit, Copy, Trash2, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { ContractTemplate } from "@/types/database";

interface ContractTemplateCardProps {
  template: ContractTemplate;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ContractTemplateCard({ template, onView, onEdit, onDuplicate, onDelete }: ContractTemplateCardProps) {
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
    <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#151A29] truncate">{template.name}</h3>
            {template.description && (
              <p className="text-sm text-[#8A8F98] mt-1 line-clamp-2">{template.description}</p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(template.id)}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(template.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(template.id)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(template.id)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Category Badge */}
          <div className="flex items-center justify-between">
            <Badge className={getCategoryColor(template.category)}>
              {getCategoryText(template.category)}
            </Badge>
            {template.is_public && (
              <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">
                Public
              </span>
            )}
          </div>

          {/* Template Content Preview */}
          <div className="text-sm text-[#8A8F98] line-clamp-3">
            {template.template_content.substring(0, 150)}...
          </div>

          {/* Variables Count */}
          {template.variables && Object.keys(template.variables).length > 0 && (
            <div className="flex items-center text-sm text-[#8A8F98]">
              <Tag className="h-4 w-4 mr-2" />
              <span>{Object.keys(template.variables).length} variables</span>
            </div>
          )}

          {/* Dates */}
          <div className="flex items-center text-sm text-[#8A8F98]">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Created {formatDate(template.created_at)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onView(template.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-[#4998F3] hover:bg-[#3A7BC8] text-white"
              onClick={() => onDuplicate(template.id)}
            >
              <Copy className="h-4 w-4 mr-1" />
              Use Template
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
