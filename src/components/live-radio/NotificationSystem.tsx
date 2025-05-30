
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, X, CheckCircle, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from "@/contexts/AdminContext";

export interface StreamNotification {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp: Date;
  read: boolean;
}

interface NotificationSystemProps {
  notifications: StreamNotification[];
  unreadCount: number;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  onMarkAllAsRead: () => void;
  onClearAllNotifications: () => void;
}

const NotificationSystem = ({
  notifications,
  unreadCount,
  notificationsEnabled,
  onToggleNotifications,
  onMarkAllAsRead,
  onClearAllNotifications
}: NotificationSystemProps) => {
  const { isAdmin } = useAdmin();

  // Format notification timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  // Filter notifications by type if non-admin
  const filteredNotifications = isAdmin 
    ? notifications 
    : notifications.filter(n => n.type !== 'error');

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleNotifications}
        className={`${!notificationsEnabled ? 'bg-muted' : ''}`}
      >
        {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
        <span className="ml-2 sr-only md:not-sr-only">{notificationsEnabled ? 'Mute' : 'Unmute'} Notifications</span>
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="ml-2">Notifications</span>
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 px-1.5 min-w-[1.25rem] h-5 flex items-center justify-center text-xs"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[350px]">
          <DropdownMenuLabel className="flex justify-between items-center">
            <span>Stream Status Updates</span>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onMarkAllAsRead}
                  className="h-8 px-2 text-xs"
                >
                  Mark all read
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearAllNotifications}
                className="h-8 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {filteredNotifications.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              {filteredNotifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id} 
                  className={`flex items-start p-3 ${!notification.read ? 'bg-accent/10' : ''}`}
                >
                  <div className="mr-2 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationSystem;
