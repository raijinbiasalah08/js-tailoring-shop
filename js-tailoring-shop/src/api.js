const configuredBackendUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// Local Vite uses its /api proxy. Production can either serve /api on the
// same origin or set VITE_API_BASE_URL to the separately hosted backend.
const normalizedBackendUrl = configuredBackendUrl?.replace(/\/+$/, "");

export const API = normalizedBackendUrl
  ? normalizedBackendUrl.endsWith("/api")
    ? normalizedBackendUrl
    : `${normalizedBackendUrl}/api`
  : "/api";
