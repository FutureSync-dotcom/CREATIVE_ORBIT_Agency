# Creative Orbit Backend

Express + MongoDB backend prepared for Vercel deployment.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set values:

- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN` (optional, comma-separated list)

3. Start local server:

```bash
npm run dev
```

## Vercel Deployment

This backend includes:

- `api/index.js` as the Vercel serverless entrypoint
- `vercel.json` routing all requests through the Express app

### Required Environment Variables (Vercel)

Set these in Vercel project settings:

- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN` (set to your Netlify domain, e.g. `https://your-site.netlify.app`)

## Health Endpoint

- `GET /health`
