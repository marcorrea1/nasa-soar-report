import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:3001/api';

export interface Comptype {
  comp_id: number;
  ss_id: number;
  comptype_name: string;
  comptype_code: string;
  hasData: boolean;
}

export interface Subsystem {
  ss_id: number;
  ss_name: string;
  ss_code: string;
  comptypes: Comptype[];
}

export interface TableData {
  tableName: string;
  columns: string[];
  rows: Record<string, unknown>[];
}

// Fetch all subsystems with their comptypes
export function useSubsystems() {
  const [subsystems, setSubsystems] = useState<Subsystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/subsystems`)
      .then(r => r.json())
      .then(data => {
        setSubsystems(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { subsystems, loading, error };
}

// Fetch data for a specific comptype
export function useComptypeData(compId: number | null) {
  const [data, setData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!compId) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/comptypes/${compId}/data`)
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [compId]);

  return { data, loading, error };
}

// Plain async fetch (not a hook) — used for batch chapter exports
export async function fetchComptypeData(compId: number): Promise<TableData> {
  const res = await fetch(`${API_BASE}/comptypes/${compId}/data`);
  if (!res.ok) throw new Error(`Failed to fetch comptype ${compId}`);
  return res.json();
}

// Search across all tables
export function useSearch(query: string) {
  const [results, setResults] = useState<{ tableName: string; compId: number | null; row: Record<string, unknown> }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(d => {
        setResults(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query]);

  return { results, loading };
}
