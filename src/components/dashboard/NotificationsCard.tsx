/**
 * Notifications Card Component
 * Displays recent notifications and alerts
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUnreadNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '@/hooks/useDashboard';
import { Bell, Check, CheckCheck, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface NotificationsCardProps {
  className?: string;
}

export function NotificationsCard({ className }: NotificationsCardProps) {
  const { data: notifications, isLoading, error } = useUnreadNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  if (isLoading) {
    return (
      <Card className={cn('card-hover', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Recent updates and alerts</CardDescription>
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
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Recent updates and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-text-secondary">Failed to load notifications</p>
            <Button variant="outline" size="sm" className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-positive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-chart-orange" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-negative" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-positive bg-positive/5';
      case 'warning':
        return 'border-l-chart-orange bg-chart-orange/5';
      case 'error':
        return 'border-l-negative bg-negative/5';
      default:
        return 'border-l-primary bg-primary/5';
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  return (
    <Card className={cn('card-hover', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
              {notifications && notifications.length > 0 && (
                <Badge className="bg-primary text-white text-xs">
                  {notifications.length}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Recent updates and alerts</CardDescription>
          </div>
          {notifications && notifications.length > 0 && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark All Read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications && notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification) => (
              <div 
                key={notification.id} 
                className={cn(
                  'border-l-4 rounded-r-lg p-3 hover:bg-hover-overlay transition-colors cursor-pointer',
                  getTypeColor(notification.type)
                )}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-text-primary text-sm mb-1">
                      {notification.title}
                    </h4>
                    <p className="text-text-secondary text-sm mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">
                        {format(new Date(notification.created_at), 'MMM dd, h:mm a')}
                      </span>
                      {notification.action_text && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-xs h-6 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (notification.action_url) {
                              window.open(notification.action_url, '_blank');
                            }
                          }}
                        >
                          {notification.action_text}
                        </Button>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-shrink-0 h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification.id);
                    }}
                    disabled={markAsRead.isPending}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            {notifications.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="outline" size="sm">
                  View All Notifications ({notifications.length})
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted mx-auto mb-4" />
            <h3 className="font-semibold text-text-primary mb-2">All Caught Up!</h3>
            <p className="text-text-secondary">No new notifications at the moment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
