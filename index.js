// Vercel detects this root Express entry point. The backend starts its listener
// on the platform-provided PORT when this module is loaded.
require("express");
require("./backend/server");
