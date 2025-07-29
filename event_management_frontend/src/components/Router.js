import React, { useState, useEffect } from "react";

/**
 * Minimal single-page router ("hash routing").
 */
// PUBLIC_INTERFACE
export function Router({ routes, fallback = null }) {
  const [path, setPath] = useState(window.location.hash.slice(1) || "/");

  useEffect(() => {
    const onHashChange = () =>
      setPath(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const route = routes.find(({ path: routePath }) =>
    path === routePath || (routePath.endsWith("*") && path.startsWith(routePath.slice(0, -1)))
  );
  if (route) return route.element;
  return fallback;
}

// PUBLIC_INTERFACE
export function navigate(to) {
  window.location.hash = to;
}
