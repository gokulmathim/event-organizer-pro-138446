import React, { useState, useMemo } from "react";
import { getEvents } from "../api";
import { navigate } from "./Router";

/**
 * PUBLIC_INTERFACE
 * EventList: shows list of events, search/filter, link to details.
 * Props: showMine (optional boolean for displaying user's events)
 */
function EventList({ showMine = false, userId }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const events = useMemo(() => {
    let evts = getEvents({});
    if (showMine && userId) evts = evts.filter(ev => ev.creatorId === userId);
    // Search/filter
    if (search) {
      const s = search.toLowerCase();
      evts = evts.filter(
        ev =>
          ev.title.toLowerCase().includes(s) ||
          (ev.description && ev.description.toLowerCase().includes(s))
      );
    }
    if (filter === "upcoming") {
      evts = evts.filter(
        ev => new Date(ev.date) >= new Date()
      );
    }
    if (filter === "past") {
      evts = evts.filter(
        ev => new Date(ev.date) < new Date()
      );
    }
    return evts.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [showMine, userId, search, filter]);

  return (
    <div>
      <div style={{ marginBottom: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search events"
          placeholder="Search events..."
          style={{
            padding: 8, borderRadius: 6, border: "1px solid var(--border-color)"
          }}
        />
        <select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter">
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>
      <div>
        {events.length === 0 && (
          <div style={{ opacity: 0.6, marginTop: 30 }}>
            No events found.
          </div>
        )}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {events.map(ev => (
            <li
              key={ev.id}
              style={{
                margin: "16px 0",
                padding: 20,
                border: "1px solid var(--border-color)",
                borderRadius: 12,
                background: "var(--bg-secondary)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
              }}
              tabIndex="0"
              aria-label={`Open details for event ${ev.title}`}
              onClick={() => navigate(`/events/${ev.id}`)}
              onKeyPress={e => e.key === "Enter" && navigate(`/events/${ev.id}`)}
              role="button"
            >
              <div style={{ fontSize: 18, fontWeight: 600 }}>{ev.title}</div>
              <div style={{ opacity: 0.7 }}>{ev.description || "--"}</div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 7 }}>
                📅 {new Date(ev.date).toLocaleString()} &nbsp;
                {ev.visibility === "private" ? <span>🔒</span> : <span>🌎</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EventList;
