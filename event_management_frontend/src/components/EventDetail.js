import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { getEventById, getEventAttendees, rsvpEvent, getRSVPStatus as getRSVP, deleteEvent } from "../api";
import { navigate } from "./Router";
import { useNotification } from "../contexts/NotificationContext";

/**
 * PUBLIC_INTERFACE
 * EventDetail: Shows full info, attendees, RSVP, allows edit/delete if organizer.
 */
function EventDetail({ eventId }) {
  const { user, isOrganizer } = useAuth();
  const { notify } = useNotification();
  const event = getEventById(eventId);

  if (!event)
    return (
      <div style={{ margin: 40, fontSize: 20 }}>Event not found.</div>
    );

  const canEdit =
    user &&
    (user.id === event.creatorId || isOrganizer());

  const attendees = getEventAttendees(eventId);

  const handleDelete = () => {
    if (window.confirm("Delete event?")) {
      deleteEvent(eventId);
      notify("success", "Event deleted!");
      navigate("/my-events");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "30px auto" }}>
      <h2>{event.title}</h2>
      <div style={{ margin: "10px 0", opacity: 0.7 }}>{event.description}</div>
      <div>
        <span style={{ marginRight: 25 }}>
          📅 {new Date(event.date).toLocaleString()}
        </span>
        <span>
          {event.visibility === "private" ? "🔒 Private" : "🌎 Public"}
        </span>
      </div>
      {event.capacity && (
        <div>
          Capacity: {attendees.length}/{event.capacity}
        </div>
      )}
      <div>
        Organizer: {event.creatorId === user?.id ? "You" : event.creatorId}
      </div>

      <hr />
      <RSVPSection event={event} user={user} />
      <hr />
      <div>
        <strong>Attendees ({attendees.length}):</strong>{" "}
        <ul>
          {attendees.map((a) => (
            <li key={a.id}>{a.username || a.id}</li>
          ))}
          {attendees.length === 0 && <li>No attendees yet</li>}
        </ul>
      </div>
      {canEdit && (
        <div style={{ marginTop: 24 }}>
          <button className="btn" onClick={() => navigate(`/edit/${eventId}`)}>
            Edit
          </button>
          <button
            className="btn"
            onClick={handleDelete}
            style={{
              background: "#f44336",
              color: "#fff",
              marginLeft: 10
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// RSVP component
function RSVPSection({ event, user }) {
  const { notify } = useNotification();
  if (!user) return <div>Login to RSVP.</div>;
  const alreadyRSVP = getRSVP(event.id, user.id);

  const handle = (status) => {
    try {
      rsvpEvent(event.id, user.id, status);
      notify("success", `RSVP ${status === "yes" ? "submitted" : status}`);
      window.location.reload(); // reload for MVP simplicity (replace with prop-lifting for advanced)
    } catch (e) {
      notify("error", e.message);
    }
  };

  return (
    <div>
      <div>
        <strong>Your RSVP:</strong>{" "}
        {alreadyRSVP ? alreadyRSVP.toUpperCase() : "None"}
      </div>
      <div>
        <button className="btn" onClick={() => handle("yes")}>
          {alreadyRSVP === "yes" ? "✓ Yes" : "Yes"}
        </button>
        <button className="btn" onClick={() => handle("maybe")}>
          {alreadyRSVP === "maybe" ? "✓ Maybe" : "Maybe"}
        </button>
        <button className="btn" onClick={() => handle("no")}>
          {alreadyRSVP === "no" ? "✓ No" : "No"}
        </button>
      </div>
    </div>
  );
}

export default EventDetail;
