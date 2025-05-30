
import { useState, useRef } from 'react';
import { StreamNotification } from './NotificationSystem';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/contexts/AdminContext';

interface NotificationManagerProps {
  children: (notificationProps: {
    notifications: StreamNotification[];
    unreadCount: number;
    notificationsEnabled: boolean;
    addNotification: (message: string, type: 'error' | 'warning' | 'info' | 'success') => void;
    markAllAsRead: () => void;
    clearAllNotifications: () => void;
    toggleNotifications: () => void;
  }) => React.ReactNode;
}

export const NotificationManager = ({ children }: NotificationManagerProps) => {
  const [notifications, setNotifications] = useState<StreamNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { toast } = useToast();
  const lastErrorRef = useRef<string | null>(null);
  const { isAdmin } = useAdmin();

  // Add notification to the list
  const addNotification = (message: string, type: 'error' | 'warning' | 'info' | 'success') => {
    if (!notificationsEnabled) return;
    
    // Check if this is a duplicate of the last error
    if (type === 'error' && message === lastErrorRef.current) {
      return;
    }
    
    // Update last error for deduplication
    if (type === 'error') {
      lastErrorRef.current = message;
    }
    
    const newNotification: StreamNotification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Keep max 20 notifications
    setUnreadCount(prev => prev + 1);
    
    // Only show toast for success events or for errors if user is admin
    if (type === 'success' || (type === 'error' && isAdmin)) {
      toast({
        title: type.charAt(0).toUpperCase() + type.slice(1),
        description: message,
      });
    }
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    setUnreadCount(0);
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Toggle notifications
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    if (!notificationsEnabled) {
      addNotification('Notifications enabled', 'success');
    }
  };

  return (
    <>
      {children({
        notifications,
        unreadCount,
        notificationsEnabled,
        addNotification,
        markAllAsRead,
        clearAllNotifications,
        toggleNotifications
      })}
    </>
  );
};
