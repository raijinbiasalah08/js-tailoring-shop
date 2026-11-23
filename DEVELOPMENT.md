# Running and deploying the app

From `js-tailoring-shop`, run:

```sh
npm run dev:fullstack
```

This starts the Express API on port 5000 and the Vite app on port 5174. Vite
forwards `/api` requests to the local backend.

For a production deployment where the frontend and backend use different
hosts, set `VITE_API_BASE_URL` in the frontend build environment to the backend
origin (for example, `https://your-backend.example.com`). The app adds `/api`
unless the value already ends with `/api`.

## Deploying to Vercel

Set the Vercel project's Root Directory to the repository root. The root
`index.js` starts the Express backend, and the build writes the Vite frontend
to the root `public` directory for Vercel to serve. The frontend uses the
same-origin `/api` path, so no `VITE_API_BASE_URL` is needed for this setup.
