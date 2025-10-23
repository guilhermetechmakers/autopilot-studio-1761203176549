import { MoreVertical, Eye, Edit, PenTool, Trash2, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { Contract } from "@/types/database";

interface ContractCardProps {
  contract: Contract;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onSign: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ContractCard({ contract, onView, onEdit, onSign, onDelete }: ContractCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'pending_signature': return 'bg-blue-100 text-blue-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'executed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_review': return 'Pending Review';
      case 'pending_signature': return 'Pending Signature';
      case 'signed': return 'Signed';
      case 'executed': return 'Executed';
      case 'cancelled': return 'Cancelled';
      case 'expired': return 'Expired';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
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
            <h3 className="font-semibold text-[#151A29] truncate">{contract.title}</h3>
            {contract.description && (
              <p className="text-sm text-[#8A8F98] mt-1 line-clamp-2">{contract.description}</p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(contract.id)}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(contract.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {contract.status === 'pending_signature' && (
                <DropdownMenuItem onClick={() => onSign(contract.id)}>
                  <PenTool className="h-4 w-4 mr-2" />
                  Sign
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => onDelete(contract.id)}
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
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(contract.status)}>
              {getStatusText(contract.status)}
            </Badge>
            <span className="text-xs text-[#8A8F98]">
              v{contract.current_version}
            </span>
          </div>

          {/* Client Info */}
          {contract.client_name && (
            <div className="flex items-center text-sm text-[#8A8F98]">
              <User className="h-4 w-4 mr-2" />
              <span className="truncate">{contract.client_name}</span>
            </div>
          )}

          {/* Dates */}
          <div className="flex items-center text-sm text-[#8A8F98]">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Created {formatDate(contract.created_at)}</span>
          </div>

          {/* Contract Type */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8A8F98] uppercase tracking-wide">
              {contract.contract_type}
            </span>
            {contract.is_negotiable && (
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                Negotiable
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onView(contract.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {contract.status === 'pending_signature' && (
              <Button 
                size="sm" 
                className="flex-1 bg-[#4998F3] hover:bg-[#3A7BC8] text-white"
                onClick={() => onSign(contract.id)}
              >
                <PenTool className="h-4 w-4 mr-1" />
                Sign
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
