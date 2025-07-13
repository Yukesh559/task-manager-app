import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "review" | "done";
  assignee?: string;
  dueDate?: string;
  projectId: string;
  boardId?: string;
  columnId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface TasksContextType {
  tasks: Task[];
  getTasksByProject: (projectId: string) => Task[];
  getTasksByBoard: (boardId: string) => Task[];
  getTasksByStatus: (status: Task["status"]) => Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (
    taskId: string,
    newStatus: Task["status"],
    newColumnId?: string
  ) => void;
  assignTask: (taskId: string, assignee: string) => void;
  addTag: (taskId: string, tag: string) => void;
  removeTag: (taskId: string, tag: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
};

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design Login Screen",
      description:
        "Create modern and responsive login UI with proper validation",
      priority: "high",
      status: "todo",
      assignee: "Siddique Raza",
      dueDate: "2024-01-15",
      projectId: "1",
      boardId: "1",
      columnId: "col1",
      tags: ["UI/UX", "Frontend"],
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-01T10:00:00Z",
    },
    {
      id: "2",
      title: "Setup Database Schema",
      description:
        "Configure database tables and relationships for the application",
      priority: "medium",
      status: "in-progress",
      assignee: "Jane Smith",
      dueDate: "2024-01-10",
      projectId: "1",
      boardId: "1",
      columnId: "col2",
      tags: ["Backend", "Database"],
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-01T10:00:00Z",
    },
    {
      id: "3",
      title: "API Development",
      description:
        "Build REST API endpoints for user management and authentication",
      priority: "high",
      status: "in-progress",
      assignee: "Mike Johnson",
      dueDate: "2024-01-20",
      projectId: "1",
      boardId: "1",
      columnId: "col2",
      tags: ["API", "Backend"],
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-01T10:00:00Z",
    },
    {
      id: "4",
      title: "Project Setup",
      description: "Initialize project structure and development environment",
      priority: "low",
      status: "done",
      assignee: "Siddique Raza",
      dueDate: "2024-01-05",
      projectId: "1",
      boardId: "1",
      columnId: "col4",
      tags: ["Setup"],
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-01T10:00:00Z",
    },
    {
      id: "5",
      title: "Marketing Strategy",
      description:
        "Develop comprehensive marketing strategy for product launch",
      priority: "medium",
      status: "todo",
      assignee: "Sarah Wilson",
      dueDate: "2024-01-25",
      projectId: "2",
      tags: ["Marketing", "Strategy"],
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-01T10:00:00Z",
    },
  ]);

  const getTasksByProject = (projectId: string) => {
    return tasks.filter((task) => task.projectId === projectId);
  };

  const getTasksByBoard = (boardId: string) => {
    return tasks.filter((task) => task.boardId === boardId);
  };

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const moveTask = (
    taskId: string,
    newStatus: Task["status"],
    newColumnId?: string
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              columnId: newColumnId,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  const assignTask = (taskId: string, assignee: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, assignee, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const addTag = (taskId: string, tag: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              tags: [...task.tags, tag],
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  const removeTag = (taskId: string, tag: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              tags: task.tags.filter((t) => t !== tag),
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        getTasksByProject,
        getTasksByBoard,
        getTasksByStatus,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        assignTask,
        addTag,
        removeTag,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
