import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

export interface OfflineData {
  tasks: any[];
  projects: any[];
  boards: any[];
  team: any[];
  analytics: any;
  profile: any;
  pendingActions: PendingAction[];
}

export interface PendingAction {
  id: string;
  type: "create" | "update" | "delete";
  entity: "task" | "project" | "board" | "team";
  data: any;
  timestamp: string;
}

interface OfflineContextType {
  isOnline: boolean;
  isSyncing: boolean;
  offlineData: OfflineData;
  pendingActionsCount: number;
  saveOfflineData: (key: string, data: any) => Promise<void>;
  getOfflineData: (key: string) => Promise<any>;
  addPendingAction: (action: Omit<PendingAction, "id" | "timestamp">) => void;
  removePendingAction: (id: string) => void;
  syncData: () => Promise<void>;
  clearOfflineData: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const useOffline = () => {
  const ctx = useContext(OfflineContext);
  if (!ctx) throw new Error("useOffline must be used within OfflineProvider");
  return ctx;
};

export const OfflineProvider = ({ children }: { children: ReactNode }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [offlineData, setOfflineData] = useState<OfflineData>({
    tasks: [],
    projects: [],
    boards: [],
    team: [],
    analytics: {},
    profile: {},
    pendingActions: [],
  });

  const pendingActionsCount = offlineData.pendingActions.length;

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true);

      // Auto-sync when coming back online
      if (state.isConnected && pendingActionsCount > 0) {
        syncData();
      }
    });

    return () => unsubscribe();
  }, [pendingActionsCount]);

  // Load offline data on mount
  useEffect(() => {
    loadOfflineData();
  }, []);

  const loadOfflineData = async () => {
    try {
      const data = await AsyncStorage.getItem("offlineData");
      if (data) {
        setOfflineData(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading offline data:", error);
    }
  };

  const saveOfflineData = async (key: string, data: any) => {
    try {
      const newOfflineData = {
        ...offlineData,
        [key]: data,
      };
      setOfflineData(newOfflineData);
      await AsyncStorage.setItem("offlineData", JSON.stringify(newOfflineData));
    } catch (error) {
      console.error("Error saving offline data:", error);
    }
  };

  const getOfflineData = async (key: string) => {
    try {
      const data = await AsyncStorage.getItem("offlineData");
      if (data) {
        const parsedData = JSON.parse(data);
        return parsedData[key] || null;
      }
      return null;
    } catch (error) {
      console.error("Error getting offline data:", error);
      return null;
    }
  };

  const addPendingAction = (
    action: Omit<PendingAction, "id" | "timestamp">
  ) => {
    const newAction: PendingAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    const newOfflineData = {
      ...offlineData,
      pendingActions: [...offlineData.pendingActions, newAction],
    };

    setOfflineData(newOfflineData);
    AsyncStorage.setItem("offlineData", JSON.stringify(newOfflineData));
  };

  const removePendingAction = (id: string) => {
    const newOfflineData = {
      ...offlineData,
      pendingActions: offlineData.pendingActions.filter(
        (action) => action.id !== id
      ),
    };

    setOfflineData(newOfflineData);
    AsyncStorage.setItem("offlineData", JSON.stringify(newOfflineData));
  };

  const syncData = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      // Simulate API calls for pending actions
      for (const action of offlineData.pendingActions) {
        console.log(`Syncing ${action.type} ${action.entity}:`, action.data);

        // In a real app, you would make actual API calls here
        // For now, we'll just simulate the sync
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Clear pending actions after successful sync
      const newOfflineData = {
        ...offlineData,
        pendingActions: [],
      };

      setOfflineData(newOfflineData);
      await AsyncStorage.setItem("offlineData", JSON.stringify(newOfflineData));

      console.log("Sync completed successfully");
    } catch (error) {
      console.error("Error syncing data:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const clearOfflineData = async () => {
    try {
      await AsyncStorage.removeItem("offlineData");
      setOfflineData({
        tasks: [],
        projects: [],
        boards: [],
        team: [],
        analytics: {},
        profile: {},
        pendingActions: [],
      });
    } catch (error) {
      console.error("Error clearing offline data:", error);
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        isSyncing,
        offlineData,
        pendingActionsCount,
        saveOfflineData,
        getOfflineData,
        addPendingAction,
        removePendingAction,
        syncData,
        clearOfflineData,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};
