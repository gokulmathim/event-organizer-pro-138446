import React, { useState, useEffect } from "react";
import "./App.css";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import { Router } from "./components/Router";
import Dashboard from "./components/Dashboard";
import EventList from "./components/EventList";
import EventDetail from "./components/EventDetail";
import EventForm from "./components/EventForm";
import { LoginForm, RegisterForm } from "./components/AuthForms";
import { useAuth } from "./contexts/AuthContext";

// Main App Component
function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Theme toggler button
  const ThemeToggle = () => (
    <button
      className="theme-toggle"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      style={{ position: "fixed", top: 25, right: 25 }}
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );

  return (
    <NotificationProvider>
      <AuthProvider>
        <ThemeToggle />
        <Navbar />
        <main className="container" style={{ paddingBottom: 60, marginTop: 32 }}>
          <AppRoutes />
        </main>
      </AuthProvider>
    </NotificationProvider>
  );
}

// PUBLIC_INTERFACE (for Router and page components)
function AppRoutes() {
  const { user } = useAuth() ?? {};

  // Parse hash routes with params: e.g., "/events/:id"/"/edit/:id"
  const hash = window.location.hash.replace("#", "") || "/";
  if (hash.startsWith("/events/") && hash.length > "/events/".length) {
    const eventId = hash.replace("/events/", "");
    return <EventDetail eventId={eventId} />;
  }
  if (hash.startsWith("/edit/") && hash.length > "/edit/".length) {
    return <EventForm eventId={hash.replace("/edit/", "")} />;
  }

  const routes = [
    { path: "/", element: <Dashboard /> },
    { path: "/login", element: <LoginForm /> },
    { path: "/register", element: <RegisterForm /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/events", element: <EventList /> },
    { path: "/my-events", element: user ? <EventList showMine userId={user.id} /> : <LoginForm /> },
    { path: "/create", element: user ? <EventForm /> : <LoginForm /> },
  ];
  return <Router routes={routes} fallback={<div>Not found</div>} />;
}

export default App;
