import { test, expect, Page } from '@playwright/test';
import { login, openConsuntivazione } from '../support/auth';
import { findUtenteInGruppi } from '../support/db';

/**
 * TEST #5 — Consuntivazione referente (CTX_BS). Vedi doc 11/13.
 *
 * DINAMICO: il referente è DERIVATO dal DB (utente a caso del gruppo STRATPERF_REFERENTE),
 * diverso ad ogni run. Password 'ofbiz'.
 *
 * Regole attese: il referente accede al portale e vede gli indicatori della propria UOC (solo schede
 * in stato TOACCOUNT); l'admin vede tutto. Qui si verifica ACCESSO e CARICAMENTO del portale.
 * Le asserzioni di dettaglio (scoping TOACCOUNT/UOC, campi valore) richiedono i selettori del
 * componente Angular: lasciate come TODO da completare dopo la prima ispezione del DOM del portale.
 */

const PASS = process.env.E2E_PASS || 'ofbiz';
const ADMIN = process.env.E2E_ADMIN_USER || 'admin';

async function apriPortale(page: Page) {
  await openConsuntivazione(page);
  await expect(page).toHaveURL(/consuntiv|CTX_BS/i, { timeout: 20_000 });
}

test.describe('Consuntivazione referente CTX_BS (dinamico)', () => {

  test('admin ACCEDE al portale consuntivazione (controllo positivo)', async ({ page }) => {
    await login(page, ADMIN, PASS);
    await apriPortale(page);
    // TODO(selettori Angular): asserire che l'albero mostra >0 indicatori per l'admin.
  });

  test('un referente (derivato) ACCEDE al portale', async ({ page }) => {
    const ref = await findUtenteInGruppi(['STRATPERF_REFERENTE']);
    test.skip(!ref, 'Nessun referente (STRATPERF_REFERENTE) derivabile dal DB');
    await login(page, ref!, PASS);
    await apriPortale(page);
    // TODO(selettori Angular): asserire indicatori della UOC del referente, solo schede TOACCOUNT.
  });
});
