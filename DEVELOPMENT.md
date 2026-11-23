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

The frontend is deployed on Vercel and the Express API runs on Render. Set the
Vercel project's Root Directory to `js-tailoring-shop`. Its local `vercel.json`
uses commands relative to that directory, and `.env.production` points the
frontend at `https://js-tailoring-shop-api.onrender.com`.

The API client appends `/api` to that URL, so account and reservation requests
go to the Render service. If the Render service URL changes, update
`VITE_API_BASE_URL` in `.env.production` and in Vercel's Production environment
variables, then redeploy.
