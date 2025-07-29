import React, { createContext, useState, useContext, useEffect } from "react";
import {
  getCurrentUser,
  logoutUser,
  loginUser,
  registerUser,
  updateUser
} from "../api";
import { useNotification } from "./NotificationContext";

const AuthContext = createContext();

/**
 * Provides authentication state and convenience functions to children.
 * Supports login, logout, register, getUser, role-checks.
 */
// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const { notify } = useNotification();

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  // PUBLIC_INTERFACE
  const login = (username, password) => {
    try {
      const user = loginUser({ username, password });
      setUser(user);
      notify("success", "Logged in successfully!");
      return true;
    } catch (e) {
      notify("error", e.message);
      return false;
    }
  };

  // PUBLIC_INTERFACE
  const register = (username, password, role = "attendee") => {
    try {
      const user = registerUser({ username, password, role });
      setUser(user);
      notify("success", "Registered and logged in!");
      return true;
    } catch (e) {
      notify("error", e.message);
      return false;
    }
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    logoutUser();
    setUser(null);
    notify("info", "Logged out.");
  };

  // PUBLIC_INTERFACE
  const update = (userObj) => {
    updateUser(userObj);
    setUser(userObj);
    notify("success", "Profile updated.");
  };

  // PUBLIC_INTERFACE
  const isOrganizer = () => user?.role === "organizer";

  return (
    <AuthContext.Provider value={{ user, login, register, logout, update, isOrganizer }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
