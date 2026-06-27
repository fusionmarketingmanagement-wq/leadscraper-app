import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { Lead } from './types';

const DATA_DIR = join(process.cwd(), 'data');
const LEADS_FILE = join(DATA_DIR, 'leads.json');

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

export function readLeads(): Lead[] {
  ensureDir();
  if (!existsSync(LEADS_FILE)) return [];
  try {
    const raw = readFileSync(LEADS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLeads(newLeads: Lead[]): number {
  ensureDir();
  const existing = readLeads();
  const existingIds = new Set(existing.map((l) => l.id));
  const fresh = newLeads.filter((l) => !existingIds.has(l.id));
  const merged = [...existing, ...fresh];
  writeFileSync(LEADS_FILE, JSON.stringify(merged, null, 2), 'utf-8');
  return fresh.length;
}

export function clearLeads(): void {
  ensureDir();
  writeFileSync(LEADS_FILE, '[]', 'utf-8');
}

export function getLeadsCount(): number {
  return readLeads().length;
}
