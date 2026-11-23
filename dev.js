const { spawn } = require("node:child_process");
const path = require("node:path");

const root = __dirname;
const backend = spawn(process.execPath, ["server.js"], {
  cwd: path.join(root, "backend"),
  stdio: "inherit",
});
const frontend = spawn(
  process.execPath,
  [path.join("node_modules", "vite", "bin", "vite.js"), "--host", "0.0.0.0"],
  {
    cwd: path.join(root, "js-tailoring-shop"),
    stdio: "inherit",
  }
);

const children = [backend, frontend];
let stopping = false;

function stopAll(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null && !child.killed) child.kill();
  }
  process.exitCode = exitCode;
}

for (const child of children) {
  child.on("error", (error) => {
    console.error("Could not start the app:", error.message);
    stopAll(1);
  });
  child.on("exit", (code) => {
    if (!stopping) stopAll(code || 0);
  });
}

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));
