# Environment Setup Guide

This project uses a split environment variable strategy to ensure security and proper functionality on Vercel.

## 1. Frontend Variables (Public)

These variables are prefixed with `VITE_` and are bundled into the application code. They are visible to anyone inspecting the browser.

*   `VITE_APP_URL`: The URL of your application (e.g., `https://your-project.vercel.app`).
*   `VITE_PRIVY_APP_ID`: Your Privy Application ID for authentication.
*   `VITE_ALCHEMY_API_KEY`: (Optional) For wallet connection providers.

**Where to set:**
*   **Local Development:** Create a `.env` file in the root directory.
*   **Vercel Dashboard:** Project Settings > Environment Variables.

## 2. Backend Secrets (Private)

These variables are **NOT** prefixed with `VITE_`. They are only accessible by the serverless functions running on Vercel (`/api/*`).

*   `OPENAI_API_KEY`: Your OpenAI API Key. Get it from [platform.openai.com](https://platform.openai.com).
*   `KV_REST_API_URL`: The URL for your Vercel KV (Redis) store.
*   `KV_REST_API_TOKEN`: The authentication token for your Vercel KV store.

**Where to set:**
*   **Local Development:** You must pull these from Vercel using `vercel env pull` or manually add them to `.env`.
*   **Vercel Dashboard:**
    1.  **Vercel KV:** Go to the "Storage" tab in your Vercel project and create/link a KV database. This will automatically add `KV_REST_API_URL` and `KV_REST_API_TOKEN` to your environment.
    2.  **OpenAI:** Add `OPENAI_API_KEY` manually in Project Settings > Environment Variables.

## 3. Setup Steps for Vercel

1.  **Deploy Project:** Push your code to GitHub and deploy to Vercel.
2.  **Add Storage:** In the Vercel Project Dashboard, click on "Storage", create a new KV (Redis) database, and link it to your project.
3.  **Add Secrets:** Go to Settings > Environment Variables and add your `OPENAI_API_KEY`.
4.  **Redeploy:** You may need to redeploy for the new variables to take effect.

## 4. Local Development

To run the full stack locally (frontend + backend functions), use:

```bash
vercel dev
```

Or if you only need the frontend:

```bash
yarn dev
```

*Note: `yarn dev` will not run the `/api` functions correctly. Use `vercel dev` to emulate the serverless environment.*
