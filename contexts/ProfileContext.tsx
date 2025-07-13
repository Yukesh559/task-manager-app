import React, { createContext, useContext, useState, ReactNode } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  timezone: string;
  language: string;
  theme: "light" | "dark" | "auto";
  notifications: {
    email: boolean;
    push: boolean;
    taskReminders: boolean;
    projectUpdates: boolean;
    teamInvitations: boolean;
  };
  preferences: {
    defaultView: "board" | "list" | "calendar";
    autoArchive: boolean;
    showCompletedTasks: boolean;
    taskSortBy: "priority" | "dueDate" | "createdAt" | "title";
    taskSortOrder: "asc" | "desc";
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  totalProjects: number;
  totalBoards: number;
  averageCompletionTime: number;
  streakDays: number;
  lastActive: string;
}

interface ProfileContextType {
  profile: UserProfile;
  stats: UserStats;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateNotificationSettings: (
    settings: Partial<UserProfile["notifications"]>
  ) => void;
  updatePreferences: (preferences: Partial<UserProfile["preferences"]>) => void;
  updateTheme: (theme: UserProfile["theme"]) => void;
  updateLanguage: (language: string) => void;
  updateTimezone: (timezone: string) => void;
  uploadAvatar: (avatarUri: string) => void;
  deleteAccount: () => void;
  exportData: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>({
    id: "1",
    name: "Siddique Raza",
    email: "siddiqdev14@gmail.com",
    bio: "Full-stack developer passionate about creating amazing user experiences.",
    phone: "+1 (555) 123-4567",
    timezone: "America/New_York",
    language: "en",
    theme: "light",
    notifications: {
      email: true,
      push: true,
      taskReminders: true,
      projectUpdates: true,
      teamInvitations: true,
    },
    preferences: {
      defaultView: "board",
      autoArchive: true,
      showCompletedTasks: true,
      taskSortBy: "priority",
      taskSortOrder: "desc",
    },
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  });

  const [stats, setStats] = useState<UserStats>({
    totalTasks: 45,
    completedTasks: 32,
    totalProjects: 8,
    totalBoards: 12,
    averageCompletionTime: 2.5,
    streakDays: 7,
    lastActive: "2024-01-15T14:30:00Z",
  });

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateNotificationSettings = (
    settings: Partial<UserProfile["notifications"]>
  ) => {
    setProfile((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        ...settings,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  const updatePreferences = (
    preferences: Partial<UserProfile["preferences"]>
  ) => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...preferences,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateTheme = (theme: UserProfile["theme"]) => {
    setProfile((prev) => ({
      ...prev,
      theme,
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateLanguage = (language: string) => {
    setProfile((prev) => ({
      ...prev,
      language,
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateTimezone = (timezone: string) => {
    setProfile((prev) => ({
      ...prev,
      timezone,
      updatedAt: new Date().toISOString(),
    }));
  };

  const uploadAvatar = (avatarUri: string) => {
    setProfile((prev) => ({
      ...prev,
      avatar: avatarUri,
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteAccount = () => {
    // In a real app, this would make an API call to delete the account
    console.log("Account deletion requested");
  };

  const exportData = () => {
    // In a real app, this would generate and download user data
    console.log("Data export requested");
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        stats,
        updateProfile,
        updateNotificationSettings,
        updatePreferences,
        updateTheme,
        updateLanguage,
        updateTimezone,
        uploadAvatar,
        deleteAccount,
        exportData,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
