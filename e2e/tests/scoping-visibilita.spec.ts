import { test, expect } from '@playwright/test';
import { login, openDefinizione, openInterrogazione, cercaPerTitolo } from '../support/auth';
import { findSchedaConDirUO, findScheda, findSchedaAltraUO, findUtenteInGruppi } from '../support/db';

/**
 * TEST #6 — Scoping di visibilità delle schede CTX_BS (doc 10 §3/§4). Casi concreti che verificano
 * che ognuno veda SOLO ciò che deve:
 *  - il Direttore di UO NON vede le schede di UN'ALTRA UO in Definizione;
 *  - il Direttore Sanitario/Amministrativo vede QUALSIASI scheda in Interrogazione (vede tutto).
 *
 * DINAMICO: attori e schede derivati a caso dal DB ad ogni esecuzione. Password 'ofbiz'.
 */

const PASS = process.env.E2E_PASS || 'ofbiz';

test.describe('Scoping visibilità CTX_BS (dinamico)', () => {

  test("un Direttore UO NON vede in Definizione una scheda di un'ALTRA UO", async ({ page }) => {
    const mia = await findSchedaConDirUO({}); // scheda + il suo Direttore UO (DIRETTORE_UOC)
    test.skip(!mia, 'Nessun Direttore UO derivabile dal DB');
    // Una scheda di un'ALTRA UO in stato "Da validare" (sarebbe visibile al SUO direttore, non a questo).
    const altra = await findSchedaAltraUO(mia!.orgUnitId, { stato: 'WEORCARD_TOVALIDATE' });
    test.skip(!altra, "Nessuna scheda di un'altra UO disponibile");

    await login(page, mia!.dirUserLoginId, PASS);
    const frame = await openDefinizione(page);
    await cercaPerTitolo(frame, altra!.nome);
    // La scheda dell'altra UO NON deve comparire per questo Direttore (match ESATTO sul nome).
    await expect(frame.getByText(altra!.nome, { exact: true })).toHaveCount(0, { timeout: 20_000 });
  });

  test('un Direttore Sanitario/Amministrativo vede in Interrogazione una scheda di qualsiasi UO', async ({ page }) => {
    const u = await findUtenteInGruppi(['STRATPERF_DIR_SAN', 'STRATPERF_DIR_AMM']);
    const s = await findScheda({}); // una scheda CTX_BS qualsiasi
    test.skip(!u || !s, 'Nessun Dir San/Amm o nessuna scheda derivabile dal DB');

    await login(page, u!, PASS);
    const frame = await openInterrogazione(page);
    await cercaPerTitolo(frame, s!.nome);
    await expect(frame.getByText(s!.nome, { exact: false }).first()).toBeVisible({ timeout: 20_000 });
  });
});
