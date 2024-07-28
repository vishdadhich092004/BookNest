import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};
export type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
};

type Props = {
  children: React.ReactNode;
};
// we use || undefined becuase when the app loads for the first time!
const AppContext = React.createContext<AppContext | undefined>(undefined);

export default function AppContextProvider({ children }: Props) {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const { isError } = useQuery("validate-token", apiClient.validateToken, {
    retry: false,
  });
  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError,
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => {
            setToast(undefined);
          }}
        />
      )}
      {children}
    </AppContext.Provider>
  );
}
export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};
