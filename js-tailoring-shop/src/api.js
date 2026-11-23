const configuredBackendUrl = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).trim().replace(/\/+$/, "");

export const API = configuredBackendUrl.endsWith("/api")
  ? configuredBackendUrl
  : `${configuredBackendUrl}/api`;
