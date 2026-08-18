import { test, expect } from '@playwright/test';
import { login, openDefinizione, cercaPerTitolo } from '../support/auth';

/**
 * TEST #1 — Visibilità di una scheda in stato INIT (vista Definizione).
 *
 * Scheda campione: work_effort 10400 = "...UOC Gestione Risorse Umane"
 *   - Unità Responsabile: BAA9903 - GESTIONE RISORSE UMANE
 *   - Stato: WEORCARD_INIT
 *
 * Regola attesa (groovy executePerformFindBSWorkEffortRoot, vista Definizione):
 *   - admin (AORNADMIN)                         -> vede tutte le schede (INIT compreso) => VISIBILE
 *   - Direttore UO della stessa UOC (rossella.dangelo): in Definizione vede SOLO le proprie
 *     schede in TO_VALIDATE; la sua unica scheda è proprio questa INIT              => NON VISIBILE
 *
 * Nota: i risultati sono paginati (20/pagina) → si filtra per Titolo così la scheda,
 * se visibile, è in pagina 1. Asserzione sul codice UOC univoco "BAA9903".
 */

const TITOLO_FILTRO = 'Gestione Risorse Umane';
const UOC_CODE = 'BAA9903';

type Caso = { etichetta: string; user?: string; pass?: string; shouldSee: boolean };

const casi: Caso[] = [
  { etichetta: 'admin (AORNADMIN)', user: process.env.E2E_ADMIN_USER, pass: process.env.E2E_ADMIN_PASS, shouldSee: true },
  { etichetta: 'Direttore UO (rossella.dangelo)', user: process.env.E2E_DIRUO_USER, pass: process.env.E2E_DIRUO_PASS, shouldSee: false },
];

test.describe('Visibilità scheda INIT in Definizione', () => {
  for (const c of casi) {
    test(`${c.etichetta} ${c.shouldSee ? 'VEDE' : 'NON vede'} la scheda INIT (${UOC_CODE})`, async ({ page }) => {
      test.skip(!c.user || !c.pass, `Credenziali mancanti in .env per "${c.etichetta}"`);

      await login(page, c.user!, c.pass!);
      const frame = await openDefinizione(page);
      await cercaPerTitolo(frame, TITOLO_FILTRO);

      if (c.shouldSee) {
        await expect(frame.getByText(UOC_CODE, { exact: false })).toBeVisible({ timeout: 20_000 });
      } else {
        // attende il completamento della ricerca (griglia vuota) prima di asserire l'assenza
        await expect(frame.getByText(/non è stato trovato alcun dato/i)).toBeVisible({ timeout: 20_000 });
        await expect(frame.getByText(UOC_CODE, { exact: false })).toHaveCount(0);
      }
    });
  }
});
