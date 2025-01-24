import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  setUserId: () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserId();
  }, []);

  const loadUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const setUserIdWithStorage = async (id: string | null) => {
    try {
      if (id) {
        await AsyncStorage.setItem("userId", id);
      } else {
        await AsyncStorage.removeItem("userId");
      }
      setUserId(id);
    } catch (error) {
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        setUserId: setUserIdWithStorage,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);