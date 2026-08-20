import { test, expect } from '@playwright/test';
import { login, openDefinizione, cercaPerTitolo } from '../support/auth';
import { findSchedaConDirUO } from '../support/db';

/**
 * TEST #1 — Visibilità di una scheda in stato INIT (vista Definizione).
 *
 * Regola attesa (vista Definizione strategica):
 *   - admin (AORNADMIN)                 -> vede TUTTE le schede, INIT compreso        => VISIBILE
 *   - Direttore UO della stessa scheda  -> in Definizione vede solo dallo stato "Da validare" (TOVALIDATE)
 *                                          in poi; una scheda ancora INIT              => NON VISIBILE
 *
 * DINAMICO: la scheda INIT e il suo Direttore UO (ORG_RESPONSIBLE della UO) sono DERIVATI dal DB,
 * diversi ad ogni run. Password 'ofbiz'. I risultati sono paginati -> si filtra per titolo.
 */

const PASS = process.env.E2E_PASS || 'ofbiz';
const ADMIN = process.env.E2E_ADMIN_USER || 'admin';

test.describe('Visibilità scheda INIT in Definizione (dinamico)', () => {

  test('admin VEDE una scheda in stato "Inizializzata"', async ({ page }) => {
    const s = await findSchedaConDirUO({ stato: 'WEORCARD_INIT' });
    test.skip(!s, 'Nessuna scheda INIT con Direttore UO derivabile dal DB');
    await login(page, ADMIN, PASS);
    const frame = await openDefinizione(page);
    await cercaPerTitolo(frame, s!.nome);
    // match ESATTO: il nome INIT può essere PREFISSO di un'altra scheda (es. variante "... C.O.")
    await expect(frame.getByText(s!.nome, { exact: true }).first()).toBeVisible({ timeout: 20_000 });
  });

  test('il Direttore UO NON vede la propria scheda ancora "Inizializzata"', async ({ page }) => {
    const s = await findSchedaConDirUO({ stato: 'WEORCARD_INIT' });
    test.skip(!s, 'Nessuna scheda INIT con Direttore UO derivabile dal DB');
    await login(page, s!.dirUserLoginId, PASS);
    const frame = await openDefinizione(page);
    await cercaPerTitolo(frame, s!.nome);
    // Il Dir UO NON vede la propria scheda ancora INIT. NB: la griglia può NON essere vuota, perché la
    // ricerca per titolo (contains) può restituire altre schede col nome simile che il Dir UO VEDE (es.
    // la variante pregresso "... C.O." in TO_VALIDATE). Quindi non si pretende la griglia vuota: si
    // asserisce che la scheda INIT SPECIFICA (nome ESATTO) non compaia.
    await frame.locator('table.selectable, #searchForm').first().waitFor({ state: 'attached', timeout: 10_000 }).catch(() => {});
    await expect(frame.getByText(s!.nome, { exact: true })).toHaveCount(0, { timeout: 20_000 });
  });
});
