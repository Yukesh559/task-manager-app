import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { useTasks } from "./TasksContext";
import { useProjects } from "./ProjectsContext";
import { useBoards } from "./BoardsContext";
import { useTeam } from "./TeamContext";

export interface TaskMetrics {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
}

export interface ProjectMetrics {
  projectId: string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  activeMembers: number;
  lastActivity: string;
}

export interface TeamMetrics {
  totalMembers: number;
  activeMembers: number;
  pendingInvitations: number;
  roleDistribution: {
    owner: number;
    admin: number;
    member: number;
    viewer: number;
  };
}

export interface TimeMetrics {
  tasksCompletedToday: number;
  tasksCompletedThisWeek: number;
  tasksCompletedThisMonth: number;
  averageCompletionTime: number; // in days
}

interface AnalyticsContextType {
  taskMetrics: TaskMetrics;
  projectMetrics: ProjectMetrics[];
  teamMetrics: TeamMetrics;
  timeMetrics: TimeMetrics;
  getProjectMetrics: (projectId: string) => ProjectMetrics | null;
  getTasksByStatus: (status: string) => number;
  getTasksByPriority: (priority: string) => number;
  getCompletionTrend: (days: number) => { date: string; completed: number }[];
  getMemberActivity: () => {
    memberId: string;
    memberName: string;
    tasksCompleted: number;
  }[];
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

export const useAnalytics = () => {
  const ctx = useContext(AnalyticsContext);
  if (!ctx)
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  return ctx;
};

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const { boards } = useBoards();
  const { members, invitations } = useTeam();

  const taskMetrics = useMemo((): TaskMetrics => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(
      today.getTime() - today.getDay() * 24 * 60 * 60 * 1000
    );

    return {
      total: tasks.length,
      completed: tasks.filter((task) => task.status === "done").length,
      inProgress: tasks.filter((task) => task.status === "in-progress").length,
      overdue: tasks.filter((task) => {
        if (!task.dueDate || task.status === "done") return false;
        return new Date(task.dueDate) < today;
      }).length,
      dueToday: tasks.filter((task) => {
        if (!task.dueDate || task.status === "done") return false;
        const dueDate = new Date(task.dueDate);
        return dueDate.toDateString() === today.toDateString();
      }).length,
      dueThisWeek: tasks.filter((task) => {
        if (!task.dueDate || task.status === "done") return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= weekStart && dueDate <= today;
      }).length,
    };
  }, [tasks]);

  const projectMetrics = useMemo((): ProjectMetrics[] => {
    return projects
      .map((project) => {
        const projectTasks = tasks.filter(
          (task) => task.projectId === project.id
        );
        const completedTasks = projectTasks.filter(
          (task) => task.status === "done"
        ).length;
        const projectMembers = members.filter((member) =>
          member.projects.includes(project.id)
        );

        return {
          projectId: project.id,
          projectName: project.name,
          totalTasks: projectTasks.length,
          completedTasks,
          completionRate:
            projectTasks.length > 0
              ? (completedTasks / projectTasks.length) * 100
              : 0,
          activeMembers: projectMembers.filter(
            (member) => member.status === "active"
          ).length,
          lastActivity:
            projectTasks.length > 0
              ? new Date(
                  Math.max(
                    ...projectTasks.map((t) => new Date(t.updatedAt).getTime())
                  )
                ).toISOString()
              : project.id, // Use project ID as fallback for sorting
        };
      })
      .sort(
        (a, b) =>
          new Date(b.lastActivity).getTime() -
          new Date(a.lastActivity).getTime()
      );
  }, [tasks, projects, members]);

  const teamMetrics = useMemo((): TeamMetrics => {
    const roleDistribution = {
      owner: members.filter((m) => m.role === "owner").length,
      admin: members.filter((m) => m.role === "admin").length,
      member: members.filter((m) => m.role === "member").length,
      viewer: members.filter((m) => m.role === "viewer").length,
    };

    return {
      totalMembers: members.length,
      activeMembers: members.filter((m) => m.status === "active").length,
      pendingInvitations: invitations.filter((inv) => inv.status === "pending")
        .length,
      roleDistribution,
    };
  }, [members, invitations]);

  const timeMetrics = useMemo((): TimeMetrics => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(
      today.getTime() - today.getDay() * 24 * 60 * 60 * 1000
    );
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const completedTasks = tasks.filter((task) => task.status === "done");

    const tasksCompletedToday = completedTasks.filter((task) => {
      const completedDate = new Date(task.updatedAt);
      return completedDate.toDateString() === today.toDateString();
    }).length;

    const tasksCompletedThisWeek = completedTasks.filter((task) => {
      const completedDate = new Date(task.updatedAt);
      return completedDate >= weekStart && completedDate <= now;
    }).length;

    const tasksCompletedThisMonth = completedTasks.filter((task) => {
      const completedDate = new Date(task.updatedAt);
      return completedDate >= monthStart && completedDate <= now;
    }).length;

    // Calculate average completion time (simplified)
    const completionTimes = completedTasks
      .map((task) => {
        const created = new Date(task.createdAt);
        const completed = new Date(task.updatedAt);
        return (
          (completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
        ); // days
      })
      .filter((time) => time > 0);

    const averageCompletionTime =
      completionTimes.length > 0
        ? completionTimes.reduce((sum, time) => sum + time, 0) /
          completionTimes.length
        : 0;

    return {
      tasksCompletedToday,
      tasksCompletedThisWeek,
      tasksCompletedThisMonth,
      averageCompletionTime,
    };
  }, [tasks]);

  const getProjectMetrics = (projectId: string): ProjectMetrics | null => {
    return (
      projectMetrics.find((metrics) => metrics.projectId === projectId) || null
    );
  };

  const getTasksByStatus = (status: string): number => {
    return tasks.filter((task) => task.status === status).length;
  };

  const getTasksByPriority = (priority: string): number => {
    return tasks.filter((task) => task.priority === priority).length;
  };

  const getCompletionTrend = (days: number) => {
    const trend = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];

      const completedOnDate = tasks.filter((task) => {
        if (task.status !== "done") return false;
        const completedDate = new Date(task.updatedAt);
        return completedDate.toDateString() === date.toDateString();
      }).length;

      trend.push({
        date: dateStr,
        completed: completedOnDate,
      });
    }

    return trend;
  };

  const getMemberActivity = () => {
    return members
      .map((member) => {
        const memberTasks = tasks.filter(
          (task) => task.assignee === member.name
        );
        const tasksCompleted = memberTasks.filter(
          (task) => task.status === "done"
        ).length;

        return {
          memberId: member.id,
          memberName: member.name,
          tasksCompleted,
        };
      })
      .sort((a, b) => b.tasksCompleted - a.tasksCompleted);
  };

  return (
    <AnalyticsContext.Provider
      value={{
        taskMetrics,
        projectMetrics,
        teamMetrics,
        timeMetrics,
        getProjectMetrics,
        getTasksByStatus,
        getTasksByPriority,
        getCompletionTrend,
        getMemberActivity,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};
