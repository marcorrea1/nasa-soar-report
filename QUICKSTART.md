# Quickstart

## Requirements
- **Node.js** — download from https://nodejs.org (v18 or newer)
- **PostgreSQL** with the `Sub-System_DB` database already loaded

## Run it

Open a terminal in this folder and run:

```bash
npm run setup    # one-time: installs frontend + backend dependencies
npm start        # boots backend (port 3001) and frontend (port 5173) together
```

Then open **http://localhost:5173/** in your browser.

## Admin mode

- Go to **http://localhost:5173/?admin** (or click the NASA logo 5 times quickly)
- Password: **`nasa2024`**

To change the password, edit `VITE_ADMIN_PASSWORD` in `.env.local` and restart `npm start`.

## Stopping the app

Press `Ctrl+C` in the terminal where `npm start` is running.
