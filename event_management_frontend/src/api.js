//
// PUBLIC_INTERFACE
// Mock API/services for client-side-only MVP, and abstraction layer for future backend integration
//

/**
 * Simulated API interface using localStorage for:
 * - User auth/session
 * - Event CRUD
 * - RSVP system
 */

const USERS_KEY = "eop_users";
const SESSION_KEY = "eop_session";
const EVENTS_KEY = "eop_events";
const RSVP_KEY = "eop_rsvp";

// Helper: Read/Write localStorage, with fallback
function getItem(key) {
  const v = window.localStorage.getItem(key);
  return v ? JSON.parse(v) : null;
}
function setItem(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

// --- Authentication ---

// PUBLIC_INTERFACE
export function registerUser({ username, password, role = "attendee" }) {
  /** Create new user if username unused. Roles: attendee (default), organizer */
  let users = getItem(USERS_KEY) || [];
  if (users.find((u) => u.username === username)) {
    throw new Error("Username already exists");
  }
  const user = {
    id: Date.now().toString(),
    username,
    password,
    role,
  };
  users.push(user);
  setItem(USERS_KEY, users);
  setItem(SESSION_KEY, user);
  return user;
}

// PUBLIC_INTERFACE
export function loginUser({ username, password }) {
  /** Authenticate user (by username/password), store session */
  let users = getItem(USERS_KEY) || [];
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) throw new Error("Invalid username or password");
  setItem(SESSION_KEY, user);
  return user;
}

// PUBLIC_INTERFACE
export function getCurrentUser() {
  /** Return the currently logged-in user object or null. */
  return getItem(SESSION_KEY);
}

// PUBLIC_INTERFACE
export function logoutUser() {
  /** Remove the current session. */
  window.localStorage.removeItem(SESSION_KEY);
}

// PUBLIC_INTERFACE
export function updateUser(userObj) {
  /** Update the current user's info (role switching, etc.) */
  let users = getItem(USERS_KEY) || [];
  users = users.map((u) => (u.id === userObj.id ? userObj : u));
  setItem(USERS_KEY, users);
  setItem(SESSION_KEY, userObj);
}

// --- Events ---

// PUBLIC_INTERFACE
export function createEvent({ title, description, date, capacity, visibility, creatorId }) {
  /** Create a new event. "visibility": 'public'|'private'. Returns created event. */
  let events = getItem(EVENTS_KEY) || [];
  const id = Date.now().toString();
  const event = {
    id,
    title,
    description,
    date,
    capacity: capacity ? parseInt(capacity, 10) : null,
    visibility: visibility || "public",
    creatorId,
    attendees: [],
    createdAt: new Date().toISOString(),
  };
  events.push(event);
  setItem(EVENTS_KEY, events);
  return event;
}

// PUBLIC_INTERFACE
export function getEvents({ onlyVisibleToUser } = {}) {
  /** List all events. (onlyVisibleToUser restricts to events visible to current user) */
  let events = getItem(EVENTS_KEY) || [];
  const user = getCurrentUser();
  if (!onlyVisibleToUser || !user) return events;
  return events.filter(
    (evt) =>
      evt.visibility === "public" ||
      evt.creatorId === user.id ||
      (evt.visibility === "private" && isUserRSVPed(evt.id, user.id))
  );
}

// PUBLIC_INTERFACE
export function getEventById(eventId) {
  let events = getItem(EVENTS_KEY) || [];
  return events.find((ev) => ev.id === eventId);
}

// PUBLIC_INTERFACE
export function updateEvent(eventId, updatedFields) {
  /** Update given event with new fields */
  let events = getItem(EVENTS_KEY) || [];
  events = events.map((ev) =>
    ev.id === eventId ? { ...ev, ...updatedFields } : ev
  );
  setItem(EVENTS_KEY, events);
  return events.find((ev) => ev.id === eventId);
}

// PUBLIC_INTERFACE
export function deleteEvent(eventId) {
  let events = getItem(EVENTS_KEY) || [];
  events = events.filter((ev) => ev.id !== eventId);
  setItem(EVENTS_KEY, events);

  // Remove RSVPs for that event
  let rsvps = getItem(RSVP_KEY) || [];
  rsvps = rsvps.filter((item) => item.eventId !== eventId);
  setItem(RSVP_KEY, rsvps);
}

// --- RSVP/Attendance ---

// PUBLIC_INTERFACE
export function rsvpEvent(eventId, userId, status = "yes") {
  /** status: 'yes'|'no'|'maybe'. Add/update RSVP entry. */
  let rsvps = getItem(RSVP_KEY) || [];
  rsvps = rsvps.filter((item) => !(item.eventId === eventId && item.userId === userId));
  rsvps.push({ eventId, userId, status });
  setItem(RSVP_KEY, rsvps);
}

// PUBLIC_INTERFACE
export function getEventAttendees(eventId) {
  let rsvps = getItem(RSVP_KEY) || [];
  let users = getItem(USERS_KEY) || [];
  return rsvps
    .filter((item) => item.eventId === eventId && item.status === "yes")
    .map((item) => users.find((u) => u.id === item.userId))
    .filter(Boolean);
}

// PUBLIC_INTERFACE
export function getUserRSVPs(userId) {
  let rsvps = getItem(RSVP_KEY) || [];
  return rsvps.filter((item) => item.userId === userId);
}

// PUBLIC_INTERFACE
export function isUserRSVPed(eventId, userId) {
  let rsvps = getItem(RSVP_KEY) || [];
  return !!rsvps.find(
    (item) => item.eventId === eventId && item.userId === userId && item.status === "yes"
  );
}

// PUBLIC_INTERFACE
export function getRSVPStatus(eventId, userId) {
  let rsvps = getItem(RSVP_KEY) || [];
  const item = rsvps.find((it) => it.eventId === eventId && it.userId === userId);
  return item ? item.status : null;
}
