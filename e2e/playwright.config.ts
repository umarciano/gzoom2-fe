import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

// Test E2E Performance Strategica CTX_BS (AORN Cardarelli).
// Requisiti: FE su :4200, legacy su :8080, BE su :8081 in esecuzione.
// Browser: Microsoft Edge (channel 'msedge') — vedi memory di progetto.
export default defineConfig({
  testDir: './tests',
  // I test dinamici fanno molti passi (query DB + login + navigazione legacy + transizione + verifica DB):
  // serve un timeout ampio.
  timeout: 150_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,        // stessi utenti/sessione legacy: meglio seriale
  workers: 1,
  // E2E su legacy stateful (login/navigazione/transizioni): un retry assorbe la flakiness da
  // interferenza tra test consecutivi. Ogni test è comunque idempotente (arrange + ripristino).
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:4200',
    channel: 'msedge',
    headless: false,
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
  ],
});
