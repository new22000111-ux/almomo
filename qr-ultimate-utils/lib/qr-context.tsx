import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface QRHistoryItem {
  id: string;
  type: string;
  content: string;
  timestamp: string;
  date: string;
  isFavorite: boolean;
}

interface QRContextType {
  history: QRHistoryItem[];
  addToHistory: (item: Omit<QRHistoryItem, "id" | "timestamp" | "date">) => void;
  removeFromHistory: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearHistory: () => void;
  exportHistory: () => string;
  importHistory: (data: string) => void;
}

const QRContext = createContext<QRContextType | undefined>(undefined);

type Action =
  | { type: "ADD"; payload: QRHistoryItem }
  | { type: "REMOVE"; payload: string }
  | { type: "TOGGLE_FAVORITE"; payload: string }
  | { type: "CLEAR" }
  | { type: "SET_HISTORY"; payload: QRHistoryItem[] };

const qrReducer = (state: QRHistoryItem[], action: Action): QRHistoryItem[] => {
  switch (action.type) {
    case "ADD":
      return [action.payload, ...state];
    case "REMOVE":
      return state.filter((item) => item.id !== action.payload);
    case "TOGGLE_FAVORITE":
      return state.map((item) =>
        item.id === action.payload ? { ...item, isFavorite: !item.isFavorite } : item
      );
    case "CLEAR":
      return [];
    case "SET_HISTORY":
      return action.payload;
    default:
      return state;
  }
};

export function QRProvider({ children }: { children: React.ReactNode }) {
  const [history, dispatch] = useReducer(qrReducer, []);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load history from storage on mount
  useEffect(() => {
    loadHistory();
  }, []);

  // Save history to storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveHistory();
    }
  }, [history]);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem("qr_history");
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch({ type: "SET_HISTORY", payload: parsed });
      }
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load history:", error);
      setIsLoaded(true);
    }
  };

  const saveHistory = async () => {
    try {
      await AsyncStorage.setItem("qr_history", JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  };

  const addToHistory = (item: Omit<QRHistoryItem, "id" | "timestamp" | "date">) => {
    const now = new Date();
    const newItem: QRHistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: now.toLocaleTimeString("ar-SA"),
      date: now.toLocaleDateString("ar-SA"),
    };
    dispatch({ type: "ADD", payload: newItem });
  };

  const removeFromHistory = (id: string) => {
    dispatch({ type: "REMOVE", payload: id });
  };

  const toggleFavorite = (id: string) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: id });
  };

  const clearHistory = () => {
    dispatch({ type: "CLEAR" });
  };

  const exportHistory = () => {
    return JSON.stringify(history, null, 2);
  };

  const importHistory = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        dispatch({ type: "SET_HISTORY", payload: parsed });
      }
    } catch (error) {
      console.error("Failed to import history:", error);
    }
  };

  return (
    <QRContext.Provider
      value={{
        history,
        addToHistory,
        removeFromHistory,
        toggleFavorite,
        clearHistory,
        exportHistory,
        importHistory,
      }}
    >
      {children}
    </QRContext.Provider>
  );
}

export function useQRHistory() {
  const context = useContext(QRContext);
  if (!context) {
    throw new Error("useQRHistory must be used within QRProvider");
  }
  return context;
}
