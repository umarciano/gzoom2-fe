import { test, expect, Page, FrameLocator } from '@playwright/test';
import {
  login, openDefinizione, openInterrogazione, cercaPerTitolo, apriSchedaDaGriglia,
} from '../support/auth';
import {
  findScheda, findSchedaConDirUO, findUtenteInGruppi, getStatoScheda, setStatoScheda, SchedaBs,
} from '../support/db';

/**
 * TEST #3 — Workflow validazione schede Performance Strategica (CTX_BS). Vedi doc 10.
 *
 * COMPLETAMENTE DINAMICO: nessun utente/ID hard-coded.
 *   - la SCHEDA è scelta a caso dal DB (ORDER BY random()) -> diversa ad ogni esecuzione;
 *   - l'ATTORE è DERIVATO: il Dir UO = ORG_RESPONSIBLE della UO della scheda (gruppo STRATPERF_DIR_UO);
 *     il Dir San/Amm = un utente a caso dei gruppi STRATPERF_DIR_SAN/AMM;
 *   - tutte le password sono 'ofbiz' (E2E_PASS per override);
 *   - se la scheda non è già nello stato sorgente, ci viene PORTATA (arrange) e poi RIPRISTINATA.
 *
 * Regole (StratPerfRootViewForms.xml + checkDirettoreRole.groovy):
 *   - "Valida parzialmente" -> Dir UO responsabile, TOVALIDATE, NON pregresso, solo Definizione  (=> VALPART)
 *   - "Valida"              -> Dir San/Amm, VALPART, NON pregresso, solo Definizione              (=> VALIDATED)
 *   - "Presa visione"       -> Dir UO responsabile, ACCOUNTED, NON pregresso, solo Definizione    (=> REVIEWED)
 *   - bottoni MAI in Interrogazione; MAI su schede pregresso 2025
 *
 * NB: "Valida" è sottostringa di "Valida parzialmente" -> match SEMPRE esatto per nome accessibile.
 */

const PASS = process.env.E2E_PASS || 'ofbiz';
const BTN_PARZIALE = 'Valida parzialmente';
const BTN_COMPLETA = 'Valida';
const BTN_VISIONE = 'Presa visione';

const btn = (frame: FrameLocator, name: string) => frame.getByRole('button', { name, exact: true });
function autoAcceptDialogs(page: Page): void { page.on('dialog', (d) => { d.accept().catch(() => {}); }); }

async function apriInDefinizione(page: Page, nome: string, workEffortId: string): Promise<FrameLocator> {
  const frame = await openDefinizione(page);
  await cercaPerTitolo(frame, nome); // verifica che la scheda sia VISIBILE al ruolo (scoping)
  await apriSchedaDaGriglia(page, frame, nome, workEffortId); // apre il dettaglio (AJAX come il doppio-click)
  return frame;
}

/** Procura una scheda + Dir UO nello stato sorgente (trova, o predispone una candidata). */
async function procuraDirUO(statoSorgente: string, pregresso: boolean) {
  const gia = await findSchedaConDirUO({ stato: statoSorgente, pregresso });
  if (gia) return { scheda: gia as SchedaBs, statoOriginale: statoSorgente, dirUser: gia.dirUserLoginId };
  const cand = await findSchedaConDirUO({ pregresso });
  if (!cand) return null;
  await setStatoScheda(cand.workEffortId, statoSorgente);
  return { scheda: cand as SchedaBs, statoOriginale: cand.statoCorrente, dirUser: cand.dirUserLoginId };
}

/** Procura una scheda (attore esterno, es. Dir San/Amm) nello stato sorgente. */
async function procuraScheda(statoSorgente: string, pregresso: boolean) {
  const gia = await findScheda({ stato: statoSorgente, pregresso });
  if (gia) return { scheda: gia, statoOriginale: statoSorgente };
  const cand = await findScheda({ pregresso });
  if (!cand) return null;
  await setStatoScheda(cand.workEffortId, statoSorgente);
  return { scheda: cand, statoOriginale: cand.statoCorrente };
}

test.describe('Workflow validazione CTX_BS (dinamico da DB)', () => {

  test('Dir UO: TOVALIDATE → VALPART con "Valida parzialmente"', async ({ page }) => {
    const p = await procuraDirUO('WEORCARD_TOVALIDATE', false);
    test.skip(!p, 'Nessuna scheda CTX_BS con Dir UO responsabile disponibile');
    autoAcceptDialogs(page);
    await login(page, p!.dirUser, PASS);
    try {
      const frame = await apriInDefinizione(page, p!.scheda.nome, p!.scheda.workEffortId);
      await expect(btn(frame, BTN_PARZIALE)).toBeVisible({ timeout: 20_000 });
      await btn(frame, BTN_PARZIALE).click();
      await expect.poll(() => getStatoScheda(p!.scheda.workEffortId),
        { timeout: 20_000, message: 'stato non passato a VALPART' }).toBe('WEORCARD_VALPART');
      // (D) firma+data: dopo la validazione l'app torna alla lista e la scheda VALPART esce dalla
      // Definizione del Dir UO; riapro il dettaglio per id e verifico la firma (letta da WorkEffortStatus).
      await apriSchedaDaGriglia(page, frame, p!.scheda.nome, p!.scheda.workEffortId);
      await expect(frame.getByText('F.to Direttore di UO il', { exact: false }).first())
        .toBeVisible({ timeout: 15_000 });
    } finally {
      await setStatoScheda(p!.scheda.workEffortId, p!.statoOriginale);
    }
  });

  test('Dir UO: ACCOUNTED → REVIEWED con "Presa visione"', async ({ page }) => {
    const p = await procuraDirUO('WEORCARD_ACCOUNTED', false);
    test.skip(!p, 'Nessuna scheda CTX_BS con Dir UO responsabile disponibile');
    autoAcceptDialogs(page);
    await login(page, p!.dirUser, PASS);
    try {
      const frame = await apriInDefinizione(page, p!.scheda.nome, p!.scheda.workEffortId);
      await expect(btn(frame, BTN_VISIONE)).toBeVisible({ timeout: 20_000 });
      await btn(frame, BTN_VISIONE).click();
      await expect.poll(() => getStatoScheda(p!.scheda.workEffortId),
        { timeout: 20_000, message: 'stato non passato a REVIEWED' }).toBe('WEORCARD_REVIEWED');
      // (D) presa visione: riapro il dettaglio per id e verifico la label "Presa visione del Direttore di UO il <data>"
      await apriSchedaDaGriglia(page, frame, p!.scheda.nome, p!.scheda.workEffortId);
      await expect(frame.getByText('Presa visione del Direttore di UO il', { exact: false }).first())
        .toBeVisible({ timeout: 15_000 });
    } finally {
      await setStatoScheda(p!.scheda.workEffortId, p!.statoOriginale);
    }
  });

  test('Dir San/Amm: VALPART → VALIDATED con "Valida"', async ({ page }) => {
    const dirUser = await findUtenteInGruppi(['STRATPERF_DIR_SAN', 'STRATPERF_DIR_AMM']);
    const p = dirUser ? await procuraScheda('WEORCARD_VALPART', false) : null;
    test.skip(!dirUser || !p, 'Nessun Dir San/Amm o nessuna scheda CTX_BS disponibile');
    autoAcceptDialogs(page);
    await login(page, dirUser!, PASS);
    try {
      const frame = await apriInDefinizione(page, p!.scheda.nome, p!.scheda.workEffortId);
      await expect(btn(frame, BTN_COMPLETA)).toBeVisible({ timeout: 20_000 });
      await expect(btn(frame, BTN_PARZIALE)).toHaveCount(0);
      await btn(frame, BTN_COMPLETA).click();
      await expect.poll(() => getStatoScheda(p!.scheda.workEffortId),
        { timeout: 20_000, message: 'stato non passato a VALIDATED' }).toBe('WEORCARD_VALIDATED');
      // (D) firma+data: riapro il dettaglio per id e verifico "F.to Direttore Sanitario/Amministrativo il <data>"
      await apriSchedaDaGriglia(page, frame, p!.scheda.nome, p!.scheda.workEffortId);
      await expect(frame.getByText('F.to Direttore Sanitario/Amministrativo il', { exact: false }).first())
        .toBeVisible({ timeout: 15_000 });
    } finally {
      await setStatoScheda(p!.scheda.workEffortId, p!.statoOriginale);
    }
  });

  test('Dir UO: NESSUN bottone di validazione in Interrogazione (sola lettura)', async ({ page }) => {
    const p = await procuraDirUO('WEORCARD_TOVALIDATE', false);
    test.skip(!p, 'Nessuna scheda CTX_BS con Dir UO responsabile disponibile');
    await login(page, p!.dirUser, PASS);
    try {
      const frame = await openInterrogazione(page);
      await cercaPerTitolo(frame, p!.scheda.nome);
      await apriSchedaDaGriglia(page, frame, p!.scheda.nome, p!.scheda.workEffortId);
      await expect(btn(frame, BTN_PARZIALE)).toHaveCount(0);
    } finally {
      await setStatoScheda(p!.scheda.workEffortId, p!.statoOriginale);
    }
  });

  test('Scheda PREGRESSO 2025: nessun bottone di validazione', async ({ page }) => {
    const p = await procuraDirUO('WEORCARD_TOVALIDATE', true);
    test.skip(!p, 'Nessuna scheda CTX_BS PREGRESSO con Dir UO responsabile disponibile');
    await login(page, p!.dirUser, PASS);
    try {
      const frame = await apriInDefinizione(page, p!.scheda.nome, p!.scheda.workEffortId);
      await expect(btn(frame, BTN_PARZIALE)).toHaveCount(0);
      await expect(btn(frame, BTN_VISIONE)).toHaveCount(0);
    } finally {
      await setStatoScheda(p!.scheda.workEffortId, p!.statoOriginale);
    }
  });
});
