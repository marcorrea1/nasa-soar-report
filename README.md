# NASA Small Spacecraft State-of-the-Art Report
### Interactive Web Application — NASA Ames Research Center

A living web app that replaces the static NASA AMS Small Spacecraft State-of-the-Art Report PDF. Users can browse all report chapters, search across every dataset, and export data to CSV, PDF, or Excel. Authorized admins can edit data directly in the browser with changes saved instantly to the database.

---

## Getting Started

### 1. Install the required software

You only need two things installed on your computer:

- **Node.js** (v18 or newer) — download from https://nodejs.org and run the installer.
- **PostgreSQL** with the `Sub-System_DB` database loaded. On Mac, the easiest option is [Postgres.app](https://postgresapp.com).

To check if Node.js is already installed, open a terminal and run:
```bash
node --version
```
If you see a version number (e.g. `v20.18.3`), you're set.

### 2. Verify PostgreSQL is running

The app talks to a local PostgreSQL server on port 5432. Before starting the app, make sure Postgres is up and the database is loaded.

**Mac (Postgres.app):**
- Open Postgres.app. You should see an elephant icon in your menu bar and "Running on Port 5432" in the window.
- Verify the `Sub-System_DB` database is listed in the sidebar. If not, you'll need to load it from a `.sql` dump first (your admin should have provided one).

**Mac/Linux (command line check):**
```bash
psql -l | grep Sub-System_DB
```
If you see `Sub-System_DB` in the output, you're good.

**Windows (pgAdmin):**
- Open pgAdmin → expand "Servers" → "PostgreSQL" → "Databases" → confirm `Sub-System_DB` is listed.

### 3. Open a terminal in this project folder

- **Mac:** right-click the project folder in Finder → *New Terminal at Folder*.
- **Windows:** open the folder in File Explorer → click the address bar → type `cmd` → press Enter.

### 4. Install the project's dependencies (one-time)

```bash
npm run setup
```

This installs both the frontend and backend packages. Takes a minute or two on first run.

### 5. Start the app

```bash
npm start
```

This boots:
- **Backend** on port 3001 (talks to PostgreSQL)
- **Frontend** on port 5173 (the web UI)

You'll see logs from both in the terminal, color-coded.

### 6. What you should see in the terminal

A successful startup looks roughly like this:

```
[server] Schemas found: [ 'public' ] | Tables found: 92
[server] Mapped 89 component types to tables
[server] NASA Report API running at http://localhost:3001
[client]
[client]   VITE v6.3.5  ready in 242 ms
[client]
[client]   ➜  Local:   http://localhost:5173/
[client]   ➜  Network: use --host to expose
```

If you don't see "Mapped 89 component types to tables", PostgreSQL or the database isn't set up right — see Troubleshooting below.

### 7. Open the app in your browser

| What you want | URL |
|---|---|
| Public view (browse / search / export) | http://localhost:5173/ |
| Admin view (edit data) | http://localhost:5173/?admin |

**Admin password:** `nasa2024`

(To change it, edit `VITE_ADMIN_PASSWORD` in `.env.local` and restart `npm start`.)

### Stopping the app

Press `Ctrl+C` in the terminal where `npm start` is running. Both servers shut down together.

### Troubleshooting

- **"Port 3001 is already in use"** — another backend is still running. On Mac/Linux, run `lsof -i :3001` to find the process ID, then `kill <PID>`. On Windows, run `netstat -ano | findstr :3001` then `taskkill /PID <PID> /F`.
- **"Port 5173 is in use"** — Vite will automatically use 5174, 5175, etc. Check the terminal output for the actual URL it picked.
- **App loads but tables are empty** — PostgreSQL isn't running, or the `Sub-System_DB` database isn't loaded. Start Postgres.app (or your equivalent), then refresh.
- **"role does not exist" / "password authentication failed"** in the backend log — the backend connects using your OS username by default. Either create a Postgres role matching your username, or set `DB_USER` in `.env.local` to a role that exists.
- **Admin login rejects `nasa2024`** — you have a `.env.local` file overriding the password. Either use the password from `.env.local`, or delete that file and restart `npm start`.
- **"Failed to fetch" errors in the browser** — the backend isn't running or crashed. Check the terminal for `[server]` errors.

---

## Using the App

### Public mode (no login needed)

- **Browse:** use the left sidebar (TOC) to expand chapters and pick a sub-category. The main panel loads the matching data table.
- **Search:** type into the top search bar. Results show across all tables, with a match count and links into each row.
- **Sort / filter columns:** click a column header to sort. Use the column picker (top-right of each table) to hide columns before exporting.
- **Sticky rows:** click the pin icon on any row to lock it in place while scrolling vertically — useful for comparing items.
- **Export:**
  - **CSV** — single table, current view
  - **PDF** — single table, formatted with NASA branding
  - **Excel (.xlsx)** — combined workbook with one sheet per chapter (the *Download* button in the top-right opens a builder that lets you choose which chapters to include)

### Admin mode (after login)

Once you log in at `/?admin` with `nasa2024`, an amber **"Admin Mode"** badge appears in the top-right.

- **Edit a cell:** click any cell. It becomes editable inline. Press `Enter` (or click away) to save.
- **Saves are immediate** — your change `PATCH`es the backend and writes to PostgreSQL right away. There is no "Save" or "Undo" button.
- **Exit admin mode:** click the *Exit* button next to the admin badge. Your session is also cleared if you close the browser.

---

## Backing Up the Database

**Important:** Admin edits write to PostgreSQL immediately and there is no undo. Before letting editors use admin mode, take a backup.

```bash
pg_dump -U $(whoami) Sub-System_DB > backup_$(date +%Y%m%d).sql
```

This creates a file like `backup_20260511.sql` in the current folder. To restore from a backup:

```bash
psql -U $(whoami) Sub-System_DB < backup_20260511.sql
```

Keep dated backups before major editing sessions.

---

## Sharing on Your Local Network

To let someone else on the same Wi-Fi network open the app from their device:

1. Stop `npm start` (Ctrl+C).
2. Restart the frontend with the `--host` flag:
   ```bash
   npm run dev -- --host
   ```
3. Vite will print a `Network:` URL like `http://192.168.1.42:5173/`. Share that URL.

Note: the backend only listens on `localhost`, so the other device needs to be on the same machine *or* you'll need to also expose port 3001. For most demo use cases, both people sit at the same laptop.

---

## Environment Variables

All optional — sensible defaults are built in. Set these in `.env.local` (frontend) or pass them when starting the backend.

| Variable | Default | Used by | Purpose |
|---|---|---|---|
| `VITE_API_URL` | `http://localhost:3001` | frontend | Override the backend URL (for deployed setups) |
| `VITE_ADMIN_PASSWORD` | `nasa2024` | admin login modal | Change the admin password |
| `DB_USER` | current OS username | backend | Postgres role to connect as |
| `DATABASE_URL` | (unset) | backend | Full connection string (overrides all other DB settings — use for cloud Postgres like Neon/Supabase) |

Example `.env.local` (frontend):
```
VITE_API_URL=
VITE_ADMIN_PASSWORD=nasa2024
```

To set backend variables on Mac/Linux, run them inline:
```bash
DB_USER=postgres npm start
```

---

## Production Build

To create a static, deployable version of the frontend:

```bash
npm run build
```

This generates a `dist/` folder containing minified HTML, CSS, and JS. You can:

- **Serve it from the backend** — copy `dist/` to a hosting service that also runs `server/index.js`.
- **Host as static** — upload `dist/` to Vercel, Netlify, GitHub Pages, etc. You'll still need to deploy the backend separately and set `VITE_API_URL` to point to it.

The dev server (`npm start`) is fine for everyday use, demos, and editing. Only build for production when you're deploying.

---

## What This Project Does

The NASA Small Spacecraft State-of-the-Art Report covers 10+ technology chapters (Propulsion, Power, GN&C, Communications, Structures, Thermal, etc.), each containing multiple data tables with hundreds of product entries. This app makes that data searchable, browsable, and exportable — and lets NASA editors keep it up to date without releasing a new PDF.

---

## Project Structure

```
.
├── QUICKSTART.md                ← short version of the run steps
├── README.md                    ← you are here
├── .env.example                 ← template for .env.local
├── .env.local                   ← your local config (gitignored)
├── package.json                 ← frontend deps + npm scripts
├── vite.config.ts               ← build/dev server config
├── index.html                   ← Vite entry point
├── postcss.config.mjs           ← Tailwind/PostCSS config
│
├── src/                         ← React frontend source
│   ├── main.tsx                 ← React app bootstrap
│   ├── styles/                  ← Tailwind + theme CSS
│   ├── assets/                  ← Static images (NASA logo)
│   └── app/
│       ├── App.tsx              ← Top-level component + admin provider
│       ├── routes.tsx           ← React Router routes
│       ├── components/          ← All UI components (HomePage, SearchResultsPage, modals, etc.)
│       ├── hooks/               ← API data fetching (useReportData.ts)
│       ├── contexts/            ← Global state (AdminContext.tsx)
│       ├── data/                ← Static report metadata
│       └── utils/               ← Export helpers (exportUtils.ts: CSV/PDF/Excel)
│
└── server/                      ← Node.js + Express backend
    ├── index.js                 ← All API routes + PostgreSQL connection (single file)
    └── package.json             ← Backend deps (express, cors, pg)
```

---

## Key Files to Know

### Backend — `server/index.js`
The entire backend lives in one file. It:
- Connects to PostgreSQL on `localhost:5432`, database `Sub-System_DB`, user = your OS username
- On startup, scans all tables with a `comp_id` column and builds a lookup map
- Serves 4 API endpoints:
  - `GET /api/subsystems` — all chapters and sub-categories
  - `GET /api/comptypes/:id/data` — full data table for a sub-category
  - `GET /api/search?q=term` — full-text search across all tables
  - `PATCH /api/comptypes/:id/rows/:modelId` — admin cell edit (saves to DB)

### Main Page — `src/app/components/SearchResultsPage.tsx`
The heart of the frontend. Contains:
- TOC sidebar — browse chapters and sub-categories
- DataTable — renders any database table with sticky/lockable columns, inline admin editing, and row highlighting
- Column picker — choose which columns to include before exporting
- Export buttons — CSV and PDF per table, Excel per chapter or across all chapters

### Admin System — `src/app/contexts/AdminContext.tsx` + `TopNav.tsx` + `HomePage.tsx`
Admin access is hidden from regular users. Two ways to activate it:
1. Click the NASA logo 5 times quickly on any page
2. Navigate to `/?admin` in the URL bar

Both open a password modal. The default password is `nasa2024` (defined as a fallback in `AdminContext.tsx`). Override it by setting `VITE_ADMIN_PASSWORD` in `.env.local`. Once logged in, every table cell becomes clickable and editable — changes are sent via `PATCH` to the backend and saved to the database instantly.

### Exports — `src/app/utils/exportUtils.ts`
Handles all three export formats:
- CSV — single table, plain text
- PDF — single table, formatted with NASA branding using jsPDF
- Excel (.xlsx) — one sheet per chapter, all tables combined, using SheetJS

### API Connection — `src/app/hooks/useReportData.ts`
All frontend API calls live here. Defaults to `localhost:3001`. Set `VITE_API_URL` to point to a different backend if needed.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Icons | lucide-react |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| PDF Export | jsPDF + jsPDF-AutoTable |
| Excel Export | SheetJS (xlsx) |
