const configuredBackendUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// Local Vite uses its /api proxy; production uses the Render URL from
// .env.production or Vercel's VITE_API_BASE_URL setting.
const normalizedBackendUrl = configuredBackendUrl?.replace(/\/+$/, "");

export const API = normalizedBackendUrl
  ? normalizedBackendUrl.endsWith("/api")
    ? normalizedBackendUrl
    : `${normalizedBackendUrl}/api`
  : "/api";
