/**
 * Proposal Template Card Component
 * Displays template information in a card format
 */

import { motion } from 'motion/react';
import { FileText, Copy, Edit, Eye, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ProposalTemplate } from '@/types/database';

interface ProposalTemplateCardProps {
  template: ProposalTemplate;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const typeColors = {
  proposal: 'bg-blue-100 text-blue-800',
  sow: 'bg-green-100 text-green-800',
  contract: 'bg-purple-100 text-purple-800',
};

const categoryColors = {
  general: 'bg-gray-100 text-gray-800',
  web_development: 'bg-blue-100 text-blue-800',
  mobile_app: 'bg-green-100 text-green-800',
  ai_ml: 'bg-purple-100 text-purple-800',
  consulting: 'bg-orange-100 text-orange-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  draft: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-gray-100 text-gray-800',
};

export function ProposalTemplateCard({ 
  template, 
  onView, 
  onEdit, 
  onDuplicate, 
  onDelete: _onDelete, 
  className 
}: ProposalTemplateCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getVariableCount = () => {
    return Array.isArray(template.variables) ? template.variables.length : 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn('group', className)}
    >
      <Card className="h-full transition-all duration-200 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 line-clamp-1">
                  {template.name}
                </h3>
                {template.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {template.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className={typeColors[template.type]}>
                {template.type.toUpperCase()}
              </Badge>
              <Badge className={categoryColors[template.category]}>
                {template.category.replace('_', ' ')}
              </Badge>
              <Badge className={statusColors[template.status]}>
                {template.status}
              </Badge>
              {template.is_public && (
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  Public
                </Badge>
              )}
            </div>

            {/* Template Info */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Variables:</span>
                <span className="font-medium">{getVariableCount()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Version:</span>
                <span className="font-medium">v{template.version}</span>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Created {formatDate(template.created_at)}</span>
              <span>Updated {formatDate(template.updated_at)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView?.(template.id)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(template.id)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDuplicate?.(template.id)}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
