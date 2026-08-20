import { test, expect, Page } from '@playwright/test';
import { login, openDefinizione, cercaPerTitolo, openMenu, linkStrategica, STRAT_HREF } from '../support/auth';
import { findScheda, findSchedaConDirUO, findUtenteInGruppi } from '../support/db';

/**
 * TEST #4 — Stampe e visibilità schede (CTX_BS). Vedi doc 12 + doc 10.
 *
 * (a) La voce di menu "Stampe" (Performance Strategica → Consultazione) è visibile ad admin e DIRETTORI:
 *     da lì stampano Scheda 1 (assegnazione) e Scheda 3 (consuntivazione).
 * (b) L'admin vede in Definizione una scheda CTX_BS.
 *
 * DINAMICO: i direttori sono DERIVATI dal DB (nessun utente fisso). Password 'ofbiz'.
 */

const PASS = process.env.E2E_PASS || 'ofbiz';
const ADMIN = process.env.E2E_ADMIN_USER || 'admin';

/**
 * Ritorna il locator della voce di menu "Stampe" di PERFORMANCE STRATEGICA (per href univoco:
 * l'individuale ha una "Stampe" diversa, GP_MENU_00208). Presenza nel menu = l'utente ha accesso
 * alla stampa; la voce è dentro il folder "Consultazione" (può essere collassato), quindi si
 * asserisce che sia ATTACHED al DOM, non necessariamente già visibile a schermo.
 */
async function voceStampe(page: Page) {
  await openMenu(page);
  return linkStrategica(page, STRAT_HREF.stampe);
}

test.describe('Stampe e visibilità CTX_BS', () => {

  test('admin VEDE la voce "Stampe" (controllo positivo)', async ({ page }) => {
    await login(page, ADMIN, PASS);
    await expect(await voceStampe(page)).toHaveCount(1, { timeout: 20_000 });
  });

  test('un Direttore UO (derivato) VEDE la voce "Stampe"', async ({ page }) => {
    const s = await findSchedaConDirUO();
    test.skip(!s, 'Nessun Dir UO derivabile dal DB');
    await login(page, s!.dirUserLoginId, PASS);
    await expect(await voceStampe(page)).toHaveCount(1, { timeout: 20_000 });
  });

  test('un Direttore San/Amm (derivato) VEDE la voce "Stampe"', async ({ page }) => {
    const u = await findUtenteInGruppi(['STRATPERF_DIR_SAN', 'STRATPERF_DIR_AMM']);
    test.skip(!u, 'Nessun Dir San/Amm derivabile dal DB');
    await login(page, u!, PASS);
    await expect(await voceStampe(page)).toHaveCount(1, { timeout: 20_000 });
  });

  test('admin VEDE in Definizione una scheda CTX_BS', async ({ page }) => {
    const scheda = await findScheda();
    test.skip(!scheda, 'Nessuna scheda CTX_BS nel DB');
    await login(page, ADMIN, PASS);
    const frame = await openDefinizione(page);
    await cercaPerTitolo(frame, scheda!.nome);
    await expect(frame.getByText(scheda!.nome, { exact: false }).first()).toBeVisible({ timeout: 20_000 });
  });
});
