# Session System & Environment Variables

## Environment Variables Strategy

To avoid duplication of the Privy App ID between frontend and backend configuration while maintaining security best practices, we use the following strategy:

1.  **Frontend (`VITE_PRIVY_APP_ID`)**:
    - This variable is **public**.
    - It is defined in `.env` (or `.env.local`) with the `VITE_` prefix.
    - It is bundled into the client-side code by Vite.

2.  **Backend (`PRIVY_APP_ID` & `PRIVY_APP_SECRET`)**:
    - These variables are for the **server-side** (Vercel Functions).
    - `PRIVY_APP_SECRET` is **secret** and must never be exposed to the client.
    - `PRIVY_APP_ID` is the same as the frontend ID.

### Local Development (No Duplication)
To simplify local development and avoid defining the same ID twice (once as `VITE_...` and once as `...`), the backend client is configured to fall back to `VITE_PRIVY_APP_ID` if `PRIVY_APP_ID` is not present in the environment.

**`.env` example:**
```bash
# Public App ID (Frontend) - Backend will use this if PRIVY_APP_ID is missing
VITE_PRIVY_APP_ID=your_app_id

# Private Secret (Backend only)
PRIVY_APP_SECRET=your_app_secret
```

### Production (Vercel)
In Vercel Project Settings > Environment Variables:

- Add `VITE_PRIVY_APP_ID` (for Frontend).
- Add `PRIVY_APP_ID` (for Backend - optional if fallback is used, but recommended for clarity).
- Add `PRIVY_APP_SECRET` (for Backend).

## Setup Instructions

1.  Get your App ID and Secret from the Privy Dashboard.
2.  Add them to your `.env` file as shown above.
3.  Deploying: Ensure Vercel environment variables are set.
