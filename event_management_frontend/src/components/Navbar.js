import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { navigate } from "./Router";

/**
 * Top navigation bar: dashboard, events, "Create", login/logout, etc.
 */
// PUBLIC_INTERFACE
function Navbar() {
  const { user, logout, isOrganizer } = useAuth();

  return (
    <nav className="navbar" style={navbarStyles}>
      <div>
        <span
          style={{ fontWeight: 700, fontSize: 20, letterSpacing: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Event Organizer Pro
        </span>
      </div>
      <div>
        <a className="nav-link" href="#/" style={linkStyle}>Dashboard</a>
        <a className="nav-link" href="#/events" style={linkStyle}>Browse Events</a>
        {user && (
          <a className="nav-link" href="#/my-events" style={linkStyle}>My Events</a>
        )}
        {user && isOrganizer() && (
          <a className="nav-link" href="#/create" style={linkStyle}>Create Event</a>
        )}
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 12 }}>{user.username} ({user.role})</span>
            <button className="btn" onClick={logout} aria-label="Logout">Logout</button>
          </>
        ) : (
          <>
            <a className="nav-link" href="#/login" style={linkStyle}>Login</a>
            <a className="nav-link" href="#/register" style={linkStyle}>Register</a>
          </>
        )}
      </div>
    </nav>
  );
}

const navbarStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "var(--bg-secondary)",
  padding: "10px 24px",
  borderBottom: "1px solid var(--border-color)",
  position: "sticky",
  top: 0,
  zIndex: 99,
};

const linkStyle = {
  textDecoration: "none",
  color: "var(--text-primary)",
  margin: "0 12px",
  fontWeight: 500
};

export default Navbar;
