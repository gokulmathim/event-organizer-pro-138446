import React, { useState } from "react";
import { createEvent, getEventById, updateEvent } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import { navigate } from "./Router";

/**
 * PUBLIC_INTERFACE
 * EventForm: form for creation or editing of an event.
 * Props: eventId (existing to edit, or undefined to create)
 */
function EventForm({ eventId }) {
  const editing = Boolean(eventId);
  const { user } = useAuth();
  const { notify } = useNotification();
  const event = editing ? getEventById(eventId) : null;

  const [form, setForm] = useState(
    event
      ? {
          title: event.title || "",
          description: event.description || "",
          date: event.date ? event.date.slice(0, 16) : "",
          capacity: event.capacity || "",
          visibility: event.visibility || "public"
        }
      : {
          title: "",
          description: "",
          date: "",
          capacity: "",
          visibility: "public"
        }
  );
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!form.title || !form.date) {
        notify("error", "Title and date are required");
        setSubmitting(false);
        return;
      }
      if (editing) {
        updateEvent(eventId, form);
        notify("success", "Event updated!");
        navigate(`/events/${eventId}`);
      } else {
        const newEvent = createEvent({
          ...form,
          creatorId: user.id,
        });
        notify("success", "Event created!");
        navigate(`/events/${newEvent.id}`);
      }
    } catch (e) {
      notify("error", e.message);
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 500,
        margin: "32px auto",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: 10,
        padding: 28,
      }}
    >
      <h2>{editing ? "Edit Event" : "Create Event"}</h2>
      <label htmlFor="title">Title*</label>
      <input
        name="title"
        id="title"
        value={form.title}
        onChange={handleChange}
        required
        autoFocus
        style={inputStyle}
      />

      <label htmlFor="desc">Description</label>
      <textarea
        name="description"
        id="desc"
        value={form.description}
        onChange={handleChange}
        style={inputStyle}
      />

      <label htmlFor="date">Date & Time*</label>
      <input
        type="datetime-local"
        name="date"
        id="date"
        value={form.date}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <label htmlFor="capacity">Capacity</label>
      <input
        type="number"
        min="1"
        name="capacity"
        id="capacity"
        value={form.capacity}
        onChange={handleChange}
        style={inputStyle}
      />

      <label htmlFor="visibility">Visibility</label>
      <select
        name="visibility"
        id="visibility"
        value={form.visibility}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>

      <button className="btn" type="submit" disabled={submitting} style={{ marginTop: 18 }}>
        {editing ? "Update" : "Create"}
      </button>
    </form>
  );
}

const inputStyle = {
  width: "100%",
  margin: "7px 0 18px 0",
  padding: "9px 12px",
  borderRadius: 6,
  border: "1px solid var(--border-color)",
  fontSize: "1rem",
  background: "var(--bg-primary)"
};

export default EventForm;
