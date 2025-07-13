import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SearchFilter {
  id: string;
  name: string;
  type: "tasks" | "projects" | "boards" | "all";
  filters: {
    status?: string[];
    priority?: string[];
    assignee?: string[];
    dueDate?: {
      from?: string;
      to?: string;
    };
    tags?: string[];
  };
  isSaved?: boolean;
  createdAt: string;
}

export interface SearchHistory {
  id: string;
  query: string;
  type: "tasks" | "projects" | "boards" | "all";
  timestamp: string;
  resultCount: number;
}

export interface SearchResult {
  id: string;
  type: "task" | "project" | "board";
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  dueDate?: string;
  tags?: string[];
  score: number;
}

interface SearchContextType {
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchType: "tasks" | "projects" | "boards" | "all";
  setSearchType: (type: "tasks" | "projects" | "boards" | "all") => void;

  // Filters
  activeFilters: SearchFilter["filters"];
  setActiveFilters: (filters: SearchFilter["filters"]) => void;
  clearFilters: () => void;

  // Results
  searchResults: SearchResult[];
  isLoading: boolean;
  performSearch: () => void;
  clearResults: () => void;

  // History
  searchHistory: SearchHistory[];
  addToHistory: (query: string, type: string, resultCount: number) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;

  // Saved searches
  savedSearches: SearchFilter[];
  saveSearch: (name: string, filters: SearchFilter["filters"]) => void;
  deleteSavedSearch: (id: string) => void;
  loadSavedSearch: (search: SearchFilter) => void;

  // Suggestions
  suggestions: string[];
  generateSuggestions: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

interface SearchProviderProps {
  children: React.ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<
    "tasks" | "projects" | "boards" | "all"
  >("all");
  const [activeFilters, setActiveFilters] = useState<SearchFilter["filters"]>(
    {}
  );
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [savedSearches, setSavedSearches] = useState<SearchFilter[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Load data from storage
  useEffect(() => {
    loadSearchData();
  }, []);

  const loadSearchData = async () => {
    try {
      const [historyData, savedData] = await Promise.all([
        AsyncStorage.getItem("searchHistory"),
        AsyncStorage.getItem("savedSearches"),
      ]);

      if (historyData) {
        setSearchHistory(JSON.parse(historyData));
      }
      if (savedData) {
        setSavedSearches(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Error loading search data:", error);
    }
  };

  const saveSearchData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem("searchHistory", JSON.stringify(searchHistory)),
        AsyncStorage.setItem("savedSearches", JSON.stringify(savedSearches)),
      ]);
    } catch (error) {
      console.error("Error saving search data:", error);
    }
  };

  // Save data when it changes
  useEffect(() => {
    saveSearchData();
  }, [searchHistory, savedSearches]);

  const clearFilters = () => {
    setActiveFilters({});
  };

  const clearResults = () => {
    setSearchResults([]);
  };

  const addToHistory = (query: string, type: string, resultCount: number) => {
    if (!query.trim()) return;

    const newHistory: SearchHistory = {
      id: Date.now().toString(),
      query: query.trim(),
      type: type as any,
      timestamp: new Date().toISOString(),
      resultCount,
    };

    setSearchHistory((prev) => {
      // Remove duplicate
      const filtered = prev.filter((h) => h.query !== query);
      // Add new entry at beginning
      return [newHistory, ...filtered.slice(0, 19)]; // Keep last 20
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const removeFromHistory = (id: string) => {
    setSearchHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const saveSearch = (name: string, filters: SearchFilter["filters"]) => {
    const newSearch: SearchFilter = {
      id: Date.now().toString(),
      name,
      type: searchType,
      filters,
      isSaved: true,
      createdAt: new Date().toISOString(),
    };

    setSavedSearches((prev) => [newSearch, ...prev]);
  };

  const deleteSavedSearch = (id: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
  };

  const loadSavedSearch = (search: SearchFilter) => {
    setSearchType(search.type);
    setActiveFilters(search.filters);
    setSearchQuery(search.name);
  };

  const generateSuggestions = (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    // Generate suggestions based on search history and common terms
    const historySuggestions = searchHistory
      .filter((h) => h.query.toLowerCase().includes(query.toLowerCase()))
      .map((h) => h.query)
      .slice(0, 3);

    const commonTerms = [
      "urgent",
      "high priority",
      "overdue",
      "completed",
      "in progress",
      "bug",
      "feature",
      "design",
      "development",
      "testing",
      "review",
    ].filter((term) => term.toLowerCase().includes(query.toLowerCase()));

    const allSuggestions = [
      ...new Set([...historySuggestions, ...commonTerms]),
    ];
    setSuggestions(allSuggestions.slice(0, 5));
  };

  const performSearch = async () => {
    if (!searchQuery.trim() && Object.keys(activeFilters).length === 0) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate search delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock search results - in real app, this would query your data
      const mockResults: SearchResult[] = [
        {
          id: "1",
          type: "task",
          title: "Design review for mobile app",
          description: "Review the latest design mockups",
          status: "in_progress",
          priority: "high",
          assignee: "Siddique Raza",
          dueDate: "2024-01-15",
          tags: ["design", "review"],
          score: 0.95,
        },
        {
          id: "2",
          type: "project",
          title: "Mobile App Development",
          description: "Building a task management app",
          status: "active",
          priority: "high",
          assignee: "Team Lead",
          dueDate: "2024-02-01",
          tags: ["development", "mobile"],
          score: 0.88,
        },
        {
          id: "3",
          type: "board",
          title: "Sprint Planning",
          description: "Kanban board for sprint tasks",
          status: "active",
          priority: "medium",
          assignee: "Scrum Master",
          dueDate: "2024-01-20",
          tags: ["sprint", "planning"],
          score: 0.82,
        },
      ];

      // Filter results based on search type
      let filteredResults = mockResults;
      if (searchType !== "all") {
        filteredResults = mockResults.filter(
          (result) => result.type === searchType.slice(0, -1)
        );
      }

      // Apply filters
      if (Object.keys(activeFilters).length > 0) {
        filteredResults = filteredResults.filter((result) => {
          if (activeFilters.status && activeFilters.status.length > 0) {
            if (!activeFilters.status.includes(result.status || ""))
              return false;
          }
          if (activeFilters.priority && activeFilters.priority.length > 0) {
            if (!activeFilters.priority.includes(result.priority || ""))
              return false;
          }
          if (activeFilters.assignee && activeFilters.assignee.length > 0) {
            if (!activeFilters.assignee.includes(result.assignee || ""))
              return false;
          }
          return true;
        });
      }

      setSearchResults(filteredResults);
      addToHistory(searchQuery, searchType, filteredResults.length);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const value: SearchContextType = {
    searchQuery,
    setSearchQuery,
    searchType,
    setSearchType,
    activeFilters,
    setActiveFilters,
    clearFilters,
    searchResults,
    isLoading,
    performSearch,
    clearResults,
    searchHistory,
    addToHistory,
    clearHistory,
    removeFromHistory,
    savedSearches,
    saveSearch,
    deleteSavedSearch,
    loadSavedSearch,
    suggestions,
    generateSuggestions,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
