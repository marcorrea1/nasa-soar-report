# NASA Small Spacecraft State-of-the-Art Report
### Interactive Web Application — NASA Ames Research Center

A living web app that replaces the static NASA AMS Small Spacecraft State-of-the-Art Report PDF. Users can browse all report chapters, search across every dataset, and export data to CSV, PDF, or Excel. Authorized admins can edit data directly in the browser with changes saved instantly to the database.

---

## What This Project Does

The NASA Small Spacecraft State-of-the-Art Report covers 10+ technology chapters (Propulsion, Power, GN&C, Communications, Structures, Thermal, etc.), each containing multiple data tables with hundreds of product entries. This app makes that data searchable, browsable, and exportable — and lets NASA editors keep it up to date without releasing a new PDF.

---

## Architecture Overview

```
├── src/                        ← React frontend (deployed to Vercel)
│   ├── app/
│   │   ├── components/         ← All UI pages and components
│   │   ├── hooks/              ← API data fetching hooks
│   │   ├── contexts/           ← Global state (admin auth)
│   │   └── utils/              ← Export logic (CSV, PDF, Excel)
│
├── server/                     ← Node.js + Express backend (deployed to Railway)
│   └── index.js                ← All API routes + PostgreSQL connection
│
└── railway.toml                ← Tells Railway how to build & start the backend
```

---

## Key Files to Know

### Backend — `server/index.js`
The entire backend lives in one file. It:
- Connects to PostgreSQL (local or Railway via `DATABASE_URL`)
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

Both open a password modal. Password is set in `AdminContext.tsx`. Once logged in, every table cell becomes clickable and editable — changes are sent via `PATCH` to the backend and saved to the database instantly.

### Exports — `src/app/utils/exportUtils.ts`
Handles all three export formats:
- CSV — single table, plain text
- PDF — single table, formatted with NASA branding using jsPDF
- Excel (.xlsx) — one sheet per chapter, all tables combined, using SheetJS

### API Connection — `src/app/hooks/useReportData.ts`
All frontend API calls live here. Uses `VITE_API_URL` environment variable to switch between local (`localhost:3001`) and production (Railway) automatically.

---

## Running Locally

**Requirements:** Node.js, PostgreSQL (Postgres.app on Mac), the `Sub-System_DB` database loaded

**Step 1 — Start the backend:**
```bash
cd server
node index.js
# NASA Report API running at http://localhost:3001
# Mapped 89 component types to tables
```

**Step 2 — Start the frontend:**
```bash
npm run dev
# http://localhost:5173
```

**Two links for demos:**
- Public view: `http://localhost:5173/`
- Admin view: `http://localhost:5173/?admin` *(password in AdminContext.tsx)*

---

## Deployment

| Service | Purpose | Config |
|---------|---------|--------|
| Vercel | Hosts the React frontend | Set `VITE_API_URL` env var to Railway backend URL |
| Railway | Hosts the Node.js backend + PostgreSQL | Set `DATABASE_URL` env var; `railway.toml` defines build/start commands |

The frontend automatically uses the Railway backend in production via `.env.production`.

---

## Environment Variables

| Variable | Where | Value |
|----------|-------|-------|
| `VITE_API_URL` | Vercel (frontend) | `https://nasa-soar-report-production.up.railway.app` |
| `DATABASE_URL` | Railway (backend) | PostgreSQL connection string from Railway Postgres service |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| UI Components | Radix UI (pre-built accessible components) |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| PDF Export | jsPDF + jsPDF-AutoTable |
| Excel Export | SheetJS (xlsx) |
| Hosting | Vercel (frontend) + Railway (backend + DB) |
