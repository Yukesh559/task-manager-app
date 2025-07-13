import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Notification {
  id: string;
  type: "task" | "project" | "team" | "system";
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
  priority: "low" | "medium" | "high";
}

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  taskReminders: boolean;
  projectUpdates: boolean;
  teamInvitations: boolean;
  dueDateReminders: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string; // "08:00"
  };
}

interface NotificationsContextType {
  notifications: Notification[];
  settings: NotificationSettings;
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "read" | "createdAt">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  sendPushNotification: (title: string, message: string, data?: any) => void;
  scheduleReminder: (taskId: string, dueDate: string) => void;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  return ctx;
};

export const NotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "task",
      title: "Task Assigned",
      message: "You have been assigned a new task: Design Review",
      data: { taskId: "task1" },
      read: false,
      createdAt: "2024-01-15T10:30:00Z",
      priority: "medium",
    },
    {
      id: "2",
      type: "project",
      title: "Project Updated",
      message: "Mobile App project has been updated",
      data: { projectId: "project1" },
      read: false,
      createdAt: "2024-01-15T09:15:00Z",
      priority: "low",
    },
    {
      id: "3",
      type: "team",
      title: "Team Invitation",
      message: "Sarah has invited you to join the Design Team",
      data: { teamId: "team1" },
      read: true,
      createdAt: "2024-01-14T16:45:00Z",
      priority: "high",
    },
    {
      id: "4",
      type: "system",
      title: "Welcome!",
      message:
        "Welcome to Task Manager. Get started by creating your first project.",
      read: true,
      createdAt: "2024-01-14T10:00:00Z",
      priority: "low",
    },
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: true,
    taskReminders: true,
    projectUpdates: true,
    teamInvitations: true,
    dueDateReminders: true,
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
    },
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (
    notification: Omit<Notification, "id" | "read" | "createdAt">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Send push notification if enabled
    if (settings.pushNotifications) {
      sendPushNotification(
        notification.title,
        notification.message,
        notification.data
      );
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const sendPushNotification = (title: string, message: string, data?: any) => {
    // In a real app, this would integrate with Expo Notifications or Firebase
    console.log("Push notification:", { title, message, data });

    // For now, we'll just add it to the notifications list
    addNotification({
      type: "system",
      title,
      message,
      data,
      priority: "medium",
    });
  };

  const scheduleReminder = (taskId: string, dueDate: string) => {
    // In a real app, this would schedule a local notification
    console.log("Scheduling reminder for task:", taskId, "due:", dueDate);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        settings,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        updateSettings,
        sendPushNotification,
        scheduleReminder,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
