import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { navigate } from "./Router";

/**
 * PUBLIC_INTERFACE
 * LoginForm, RegisterForm, RoleSwitch – all auth flows.
 */

export function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });

  const handle = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const submit = (e) => {
    e.preventDefault();
    if (login(form.username, form.password)) {
      navigate("/");
    }
  };
  return (
    <form onSubmit={submit} style={formStyle}>
      <h2>Login</h2>
      <label>Username</label>
      <input name="username" value={form.username} onChange={handle} required style={inputStyle} />
      <label>Password</label>
      <input name="password" value={form.password} onChange={handle} type="password" required style={inputStyle} />
      <button className="btn" type="submit">Login</button>
      <div style={{ marginTop: 10, fontSize: 14 }}>
        <span>Need an account? </span>
        <a href="#/register">Register here</a>
      </div>
    </form>
  );
}

export function RegisterForm() {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: "", password: "", role: "attendee" });

  const handle = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const submit = (e) => {
    e.preventDefault();
    if (register(form.username, form.password, form.role)) {
      navigate("/");
    }
  };
  return (
    <form onSubmit={submit} style={formStyle}>
      <h2>Register</h2>
      <label>Username</label>
      <input name="username" value={form.username} onChange={handle} required style={inputStyle} />
      <label>Password</label>
      <input name="password" value={form.password} onChange={handle} type="password" required style={inputStyle} />
      <label>Role</label>
      <select name="role" value={form.role} onChange={handle} style={inputStyle}>
        <option value="attendee">Attendee</option>
        <option value="organizer">Organizer</option>
      </select>
      <button className="btn" type="submit">Register &amp; Login</button>
      <div style={{ marginTop: 10, fontSize: 14 }}>
        <span>Already have an account? </span>
        <a href="#/login">Login here</a>
      </div>
    </form>
  );
}

// Optional: allow role switch for demo
export function RoleSwitch() {
  const { user, update } = useAuth();
  if (!user) return null;
  return (
    <div style={{ marginTop: 25 }}>
      Role:&nbsp;
      <select
        value={user.role}
        onChange={e => {
          update({ ...user, role: e.target.value });
          window.location.reload();
        }}
        style={{ padding: 4, borderRadius: 5 }}
      >
        <option value="attendee">Attendee</option>
        <option value="organizer">Organizer</option>
      </select>
      <span style={{ fontSize: 13, marginLeft: 10, opacity: 0.6 }}> (For demo only)</span>
    </div>
  );
}

const formStyle = {
  maxWidth: 380,
  margin: "34px auto",
  padding: 26,
  background: "var(--bg-secondary)",
  border: "1px solid var(--border-color)",
  borderRadius: 10,
  minHeight: 260,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const inputStyle = {
  fontSize: "1rem",
  borderRadius: 5,
  border: "1px solid var(--border-color)",
  padding: "8px 10px",
  background: "var(--bg-primary)"
};
