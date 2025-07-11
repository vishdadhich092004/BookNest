import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "react-query";
import { validateToken } from "../api-client"; // Adjust import path as necessary
import Loader from "../components/Loader";

// Define types for user and context
type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  readBooks: string[];
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  refetchUser: () => void; // Added refetchUser to context
};

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component
export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Use React Query's useQuery to fetch the user data
  const { data, refetch, isLoading } = useQuery(
    "validate-token",
    validateToken,
    { retry: false }
  );

  const user = data?.user || null;
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        refetchUser: refetch,
      }}
    >
      {isLoading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};
