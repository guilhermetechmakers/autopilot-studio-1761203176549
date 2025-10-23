/**
 * Meetings Card Component
 * Displays upcoming meetings and schedule
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUpcomingMeetings } from '@/hooks/useDashboard';
import { Plus, Calendar, Clock, MapPin, Video, Users } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { cn } from '@/lib/utils';

interface MeetingsCardProps {
  className?: string;
}

export function MeetingsCard({ className }: MeetingsCardProps) {
  const { data: meetings, isLoading, error } = useUpcomingMeetings();

  if (isLoading) {
    return (
      <Card className={cn('card-hover', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Meetings
          </CardTitle>
          <CardDescription>Your scheduled meetings and appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn('card-hover', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Meetings
          </CardTitle>
          <CardDescription>Your scheduled meetings and appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-text-secondary">Failed to load meetings</p>
            <Button variant="outline" size="sm" className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-primary text-white';
      case 'in_progress':
        return 'bg-positive text-white';
      case 'completed':
        return 'bg-accent text-white';
      case 'cancelled':
        return 'bg-negative text-white';
      default:
        return 'bg-muted text-text-primary';
    }
  };

  const formatMeetingTime = (startTime: string, _endTime: string) => {
    const start = new Date(startTime);
    
    if (isToday(start)) {
      return `Today at ${format(start, 'h:mm a')}`;
    } else if (isTomorrow(start)) {
      return `Tomorrow at ${format(start, 'h:mm a')}`;
    } else {
      return format(start, 'MMM dd, h:mm a');
    }
  };

  const getTimeUntilMeeting = (startTime: string) => {
    const now = new Date();
    const meeting = new Date(startTime);
    const diffInHours = (meeting.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `in ${minutes}m`;
    } else if (diffInHours < 24) {
      return `in ${Math.floor(diffInHours)}h`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `in ${days}d`;
    }
  };

  return (
    <Card className={cn('card-hover', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Meetings
            </CardTitle>
            <CardDescription>Your scheduled meetings and appointments</CardDescription>
          </div>
          <Button size="sm" className="btn-primary">
            <Plus className="h-4 w-4 mr-1" />
            Schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {meetings && meetings.length > 0 ? (
          <div className="space-y-4">
            {meetings.slice(0, 5).map((meeting) => (
              <div key={meeting.id} className="border border-border rounded-lg p-4 hover:bg-hover-overlay transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-text-primary mb-1">{meeting.title}</h4>
                    {meeting.description && (
                      <p className="text-sm text-text-secondary mb-2 line-clamp-2">{meeting.description}</p>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(meeting.status)}>
                        {meeting.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getTimeUntilMeeting(meeting.start_time)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Clock className="h-4 w-4" />
                    <span>{formatMeetingTime(meeting.start_time, meeting.end_time)}</span>
                  </div>
                  
                  {meeting.location && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <MapPin className="h-4 w-4" />
                      <span>{meeting.location}</span>
                    </div>
                  )}
                  
                  {meeting.meeting_url && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Video className="h-4 w-4" />
                      <a href={meeting.meeting_url} className="hover:underline">
                        Join Meeting
                      </a>
                    </div>
                  )}
                  
                  {meeting.participants && meeting.participants.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Users className="h-4 w-4" />
                      <span>{meeting.participants.length} participant{meeting.participants.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {meetings.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="outline" size="sm">
                  View All Meetings ({meetings.length})
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted mx-auto mb-4" />
            <h3 className="font-semibold text-text-primary mb-2">No Upcoming Meetings</h3>
            <p className="text-text-secondary mb-4">Schedule your first meeting to get started</p>
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
