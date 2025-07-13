import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Project {
  id: string;
  name: string;
  description: string;
}

interface ProjectsContextType {
  projects: Project[];
  addProject: (name: string, description: string) => void;
  deleteProject: (id: string) => void;
  updateProject: (id: string, name: string, description: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
);

export const useProjects = () => {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used within ProjectsProvider");
  return ctx;
};

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Task Manager App",
      description: "Manage your tasks and projects",
    },
    {
      id: "2",
      name: "E-Commerce Platform",
      description: "Online shopping system",
    },
    {
      id: "3",
      name: "CRM System",
      description: "Customer relationship management",
    },
  ]);

  const addProject = (name: string, description: string) => {
    setProjects((prev) => [
      { id: Date.now().toString(), name, description },
      ...prev,
    ]);
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProject = (id: string, name: string, description: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name, description } : p))
    );
  };

  return (
    <ProjectsContext.Provider
      value={{ projects, addProject, deleteProject, updateProject }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};
