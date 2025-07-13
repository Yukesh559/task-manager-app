import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Board {
  id: string;
  name: string;
  description: string;
  projectId: string;
  columns: Column[];
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "review" | "done";
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface BoardsContextType {
  boards: Board[];
  getBoardsByProject: (projectId: string) => Board[];
  addBoard: (name: string, description: string, projectId: string) => void;
  deleteBoard: (id: string) => void;
  updateBoard: (id: string, name: string, description: string) => void;
  addColumn: (boardId: string, name: string, color: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  addTask: (
    boardId: string,
    columnId: string,
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateTask: (
    boardId: string,
    columnId: string,
    taskId: string,
    updates: Partial<Task>
  ) => void;
  deleteTask: (boardId: string, columnId: string, taskId: string) => void;
  moveTask: (
    boardId: string,
    fromColumnId: string,
    toColumnId: string,
    taskId: string
  ) => void;
}

const BoardsContext = createContext<BoardsContextType | undefined>(undefined);

export const useBoards = () => {
  const ctx = useContext(BoardsContext);
  if (!ctx) throw new Error("useBoards must be used within BoardsProvider");
  return ctx;
};

export const BoardsProvider = ({ children }: { children: ReactNode }) => {
  const [boards, setBoards] = useState<Board[]>([
    {
      id: "1",
      name: "Development Sprint",
      description: "Current development tasks",
      projectId: "1",
      columns: [
        {
          id: "col1",
          name: "To Do",
          color: "#e2e8f0",
          tasks: [
            {
              id: "task1",
              title: "Design Login Screen",
              description: "Create modern login UI",
              priority: "high",
              status: "todo",
              assignee: "Siddique Raza",
              dueDate: "2024-01-15",
              createdAt: "2024-01-01T10:00:00Z",
              updatedAt: "2024-01-01T10:00:00Z",
            },
            {
              id: "task2",
              title: "Setup Database",
              description: "Configure database schema",
              priority: "medium",
              status: "todo",
              assignee: "Jane Smith",
              dueDate: "2024-01-10",
              createdAt: "2024-01-01T10:00:00Z",
              updatedAt: "2024-01-01T10:00:00Z",
            },
          ],
        },
        {
          id: "col2",
          name: "In Progress",
          color: "#fef3c7",
          tasks: [
            {
              id: "task3",
              title: "API Development",
              description: "Build REST API endpoints",
              priority: "high",
              status: "in-progress",
              assignee: "Mike Johnson",
              dueDate: "2024-01-20",
              createdAt: "2024-01-01T10:00:00Z",
              updatedAt: "2024-01-01T10:00:00Z",
            },
          ],
        },
        {
          id: "col3",
          name: "Review",
          color: "#dbeafe",
          tasks: [],
        },
        {
          id: "col4",
          name: "Done",
          color: "#dcfce7",
          tasks: [
            {
              id: "task4",
              title: "Project Setup",
              description: "Initialize project structure",
              priority: "low",
              status: "done",
              assignee: "Siddique Raza",
              dueDate: "2024-01-05",
              createdAt: "2024-01-01T10:00:00Z",
              updatedAt: "2024-01-01T10:00:00Z",
            },
          ],
        },
      ],
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-01T10:00:00Z",
    },
    {
      id: "2",
      name: "Marketing Campaign",
      description: "Marketing and promotion tasks",
      projectId: "2",
      columns: [
        {
          id: "col5",
          name: "Planning",
          color: "#f3e8ff",
          tasks: [],
        },
        {
          id: "col6",
          name: "Execution",
          color: "#fef3c7",
          tasks: [],
        },
        {
          id: "col7",
          name: "Completed",
          color: "#dcfce7",
          tasks: [],
        },
      ],
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-01T10:00:00Z",
    },
  ]);

  const getBoardsByProject = (projectId: string) => {
    return boards.filter((board) => board.projectId === projectId);
  };

  const addBoard = (name: string, description: string, projectId: string) => {
    const newBoard: Board = {
      id: Date.now().toString(),
      name,
      description,
      projectId,
      columns: [
        {
          id: `col-${Date.now()}-1`,
          name: "To Do",
          color: "#e2e8f0",
          tasks: [],
        },
        {
          id: `col-${Date.now()}-2`,
          name: "In Progress",
          color: "#fef3c7",
          tasks: [],
        },
        {
          id: `col-${Date.now()}-3`,
          name: "Done",
          color: "#dcfce7",
          tasks: [],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBoards((prev) => [newBoard, ...prev]);
  };

  const deleteBoard = (id: string) => {
    setBoards((prev) => prev.filter((board) => board.id !== id));
  };

  const updateBoard = (id: string, name: string, description: string) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === id
          ? { ...board, name, description, updatedAt: new Date().toISOString() }
          : board
      )
    );
  };

  const addColumn = (boardId: string, name: string, color: string) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: [
                ...board.columns,
                {
                  id: `col-${Date.now()}`,
                  name,
                  color,
                  tasks: [],
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : board
      )
    );
  };

  const deleteColumn = (boardId: string, columnId: string) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.filter((col) => col.id !== columnId),
              updatedAt: new Date().toISOString(),
            }
          : board
      )
    );
  };

  const addTask = (
    boardId: string,
    columnId: string,
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((col) =>
                col.id === columnId
                  ? { ...col, tasks: [...col.tasks, newTask] }
                  : col
              ),
              updatedAt: new Date().toISOString(),
            }
          : board
      )
    );
  };

  const updateTask = (
    boardId: string,
    columnId: string,
    taskId: string,
    updates: Partial<Task>
  ) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((col) =>
                col.id === columnId
                  ? {
                      ...col,
                      tasks: col.tasks.map((task) =>
                        task.id === taskId
                          ? {
                              ...task,
                              ...updates,
                              updatedAt: new Date().toISOString(),
                            }
                          : task
                      ),
                    }
                  : col
              ),
              updatedAt: new Date().toISOString(),
            }
          : board
      )
    );
  };

  const deleteTask = (boardId: string, columnId: string, taskId: string) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((col) =>
                col.id === columnId
                  ? {
                      ...col,
                      tasks: col.tasks.filter((task) => task.id !== taskId),
                    }
                  : col
              ),
              updatedAt: new Date().toISOString(),
            }
          : board
      )
    );
  };

  const moveTask = (
    boardId: string,
    fromColumnId: string,
    toColumnId: string,
    taskId: string
  ) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((col) => {
                if (col.id === fromColumnId) {
                  return {
                    ...col,
                    tasks: col.tasks.filter((task) => task.id !== taskId),
                  };
                }
                if (col.id === toColumnId) {
                  const taskToMove = board.columns
                    .find((c) => c.id === fromColumnId)
                    ?.tasks.find((t) => t.id === taskId);
                  if (taskToMove) {
                    return {
                      ...col,
                      tasks: [
                        ...col.tasks,
                        { ...taskToMove, updatedAt: new Date().toISOString() },
                      ],
                    };
                  }
                }
                return col;
              }),
              updatedAt: new Date().toISOString(),
            }
          : board
      )
    );
  };

  return (
    <BoardsContext.Provider
      value={{
        boards,
        getBoardsByProject,
        addBoard,
        deleteBoard,
        updateBoard,
        addColumn,
        deleteColumn,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
};
