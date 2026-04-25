# Creative Orbit Frontend

Vite + React frontend prepared for Netlify deployment.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

The app uses `/api/*` requests. During local development, Vite proxies those calls to `http://localhost:5001`.

## Build

```bash
npm run build
```

## Netlify Deployment

This repo includes `netlify.toml` with:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect: all routes rewrite to `index.html`

### Required Environment Variable (Netlify)

Set this in your Netlify site environment variables:

- `VITE_API_BASE_URL`: your deployed Vercel backend URL (example: `https://creative-orbit-api.vercel.app`)

If `VITE_API_BASE_URL` is set, frontend `/api/*` requests are sent to that backend URL automatically.
