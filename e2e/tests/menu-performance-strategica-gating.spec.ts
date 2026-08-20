import { test, expect } from '@playwright/test';
import { login, openMenu } from '../support/auth';
import { findUtenteSenzaProfiloStrategica } from '../support/db';

/**
 * TEST #2 — Gating del menu «Performance Strategica».
 *
 * Un utente normale (valutatore della performance individuale, SENZA profilo Performance Strategica)
 * NON deve vedere la voce di menu «PERFORMANCE STRATEGICA». L'admin invece la vede (controllo positivo).
 *
 * DINAMICO: l'utente "senza profilo" è DERIVATO dal DB (un EMPLPERF_VALUTATORE che non appartiene ad
 * alcun gruppo STRATPERF_*), diverso ad ogni run. Nessun utente hard-coded. Password 'ofbiz'.
 *
 * La voce di menu è un <a role="link" aria-label="{label}"> => match per accessible name (univoco: la
 * radice "PERFORMANCE STRATEGICA" non collide con l'individuale).
 */

const PASS = process.env.E2E_PASS || 'ofbiz';
const ADMIN = process.env.E2E_ADMIN_USER || 'admin';
const VOCE = 'PERFORMANCE STRATEGICA';

test.describe('Gating menu «Performance Strategica»', () => {

  test('admin (controllo positivo) VEDE «PERFORMANCE STRATEGICA»', async ({ page }) => {
    await login(page, ADMIN, PASS);
    await openMenu(page);
    await expect(page.getByRole('link', { name: VOCE, exact: true })).toBeVisible({ timeout: 20_000 });
  });

  test('un valutatore senza profilo (derivato) NON vede «PERFORMANCE STRATEGICA»', async ({ page }) => {
    const u = await findUtenteSenzaProfiloStrategica();
    test.skip(!u, 'Nessun EMPLPERF_VALUTATORE senza profilo strategica derivabile dal DB');
    await login(page, u!, PASS);
    await openMenu(page);
    await expect(page.getByRole('link', { name: VOCE, exact: true })).toHaveCount(0);
  });
});
