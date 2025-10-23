/**
 * Proposal Card Component
 * Displays proposal information in a card format
 */

import { motion } from 'motion/react';
import { FileText, Clock, User, Mail, Building, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Proposal } from '@/types/database';

interface ProposalCardProps {
  proposal: Proposal & {
    proposal_templates?: {
      id: string;
      name: string;
      type: string;
      category: string;
    } | null;
  };
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  negotiating: 'bg-orange-100 text-orange-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  signed: 'bg-emerald-100 text-emerald-800',
};

const typeIcons = {
  proposal: FileText,
  sow: FileText,
  contract: FileText,
};

export function ProposalCard({ 
  proposal, 
  onView, 
  onEdit, 
  onDelete: _onDelete, 
  className 
}: ProposalCardProps) {
  const TypeIcon = typeIcons[proposal.type] || FileText;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
                <TypeIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 line-clamp-1">
                  {proposal.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {proposal.proposal_templates?.name || 'Custom Proposal'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusColors[proposal.status]}>
                {proposal.status.replace('_', ' ')}
              </Badge>
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
            {/* Client Information */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span className="font-medium">{proposal.client_name}</span>
              {proposal.client_company && (
                <>
                  <span>•</span>
                  <Building className="h-4 w-4" />
                  <span>{proposal.client_company}</span>
                </>
              )}
            </div>

            {proposal.client_email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{proposal.client_email}</span>
              </div>
            )}

            {/* Description */}
            {proposal.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {proposal.description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>Created {formatDate(proposal.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>v{proposal.version}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView?.(proposal.id)}
                className="flex-1"
              >
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(proposal.id)}
                className="flex-1"
              >
                Edit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
