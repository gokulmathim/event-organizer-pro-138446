import React, { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

// PUBLIC_INTERFACE
export function NotificationProvider({ children }) {
  /** Global notification provider for toasts/snackbars */
  const [notification, setNotification] = useState(null);

  // Show notification for 3 seconds
  const notify = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notification && (
        <div
          className={`notification notification-${notification.type}`}
          role="alert"
          aria-live="assertive"
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            zIndex: 1000,
            background: notification.type === "error" ? "#f44336" : "#1976d2",
            color: "#fff",
            borderRadius: 8,
            padding: "12px 20px",
            fontWeight: 500,
            minWidth: 200,
            textAlign: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.18)"
          }}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useNotification() {
  /** Hook to access the notify() method from anywhere */
  return useContext(NotificationContext);
}
