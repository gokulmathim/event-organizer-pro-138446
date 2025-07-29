import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserRSVPs, getEventById } from "../api";
import { navigate } from "./Router";
import { RoleSwitch } from "./AuthForms";

/**
 * PUBLIC_INTERFACE
 * Dashboard: Landing page for logged-in user, displays profile + summary of upcoming events.
 */
function Dashboard() {
  const { user } = useAuth();
  if (!user) return <LandingWelcome />;

  // Show upcoming RSVP'd events
  const rsvps = getUserRSVPs(user.id);
  const upcoming = rsvps
    .map(rsvp => getEventById(rsvp.eventId))
    .filter(ev => ev && new Date(ev.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div style={{ maxWidth: 600, margin: "28px auto" }}>
      <h2>Welcome, {user.username}!</h2>
      <RoleSwitch />
      <div style={{ fontSize: 15, opacity: 0.8, margin: "12px 0 26px 0" }}>
        {user.role === "organizer"
          ? "You can create/manage new events and view attendee lists."
          : "Browse and RSVP to your favorite events!"}
      </div>
      <div>
        <h3>Upcoming Events You're Attending:</h3>
        <ul>
          {upcoming.length === 0 && <li>No upcoming events RSVP'd.</li>}
          {upcoming.map(ev => (
            <li key={ev.id}>
              <a
                href={`#/events/${ev.id}`}
                style={{ color: "var(--button-bg)" }}
              >
                {ev.title}
              </a>
              {" — "}
              {new Date(ev.date).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: 22 }}>
        <button className="btn" onClick={() => navigate("/events")}>Browse All Events</button>
      </div>
    </div>
  );
}

function LandingWelcome() {
  return (
    <div style={{ maxWidth: 460, margin: "50px auto", textAlign: "center" }}>
      <h1>Event Organizer Pro</h1>
      <p>
        Organize. RSVP. Connect.<br />
        <span style={{ opacity: 0.85 }}>
          Sign up or log in to discover and manage events!
        </span>
      </p>
      <a href="#/login" className="btn" style={{ marginRight: 12 }}>Login</a>
      <a href="#/register" className="btn btn-outline">Register</a>
    </div>
  );
}

export default Dashboard;
