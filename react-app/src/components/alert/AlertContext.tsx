import React, { createContext, useContext, useState, useEffect } from "react";
import AlertModal from "./AlertModal";

type AlertType = "success" | "error";

interface AlertContextType {
  showAlert: (message: string, type?: AlertType, onConfirm?: () => void) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<{ message: string; type: AlertType; callback?: () => void } | null>(null);

  const showAlert = (message: string, type: AlertType = "success", onConfirm?: () => void) => {
    setAlert({ message, type, callback: onConfirm });
  };

  const closeAlert = () => {
    const callback = alert?.callback;
    setAlert(null);
    if (callback) callback(); // 확인 버튼 누른 후 동작 실행
  };

  // 키보드 차단 로직 (엔터/스페이스바 방지)
  useEffect(() => {
    if (!alert) return;
    const blockKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") e.preventDefault();
    };
    window.addEventListener("keydown", blockKey);
    return () => window.removeEventListener("keydown", blockKey);
  }, [alert]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <AlertModal
          message={alert.message}
          type={alert.type}
          onClose={closeAlert}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within an AlertProvider");
  return context;
};