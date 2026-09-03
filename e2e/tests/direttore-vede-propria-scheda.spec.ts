/**
 * BATTERIA VISIBILITÀ #1 — Ogni Direttore UO VEDE la propria scheda di Performance Organizzativa (CTX_BS 2026).
 *
 * Giro COMPLETO (non a campione): per OGNI Direttore UO (ORG_RESPONSIBLE della propria UO, qualunque ruolo,
 * in STRATPERF_DIR_UO, esclusi i Dir San/Amm che vedono tutto) si fa login come quel direttore, si apre
 * Performance Strategica → Interrogazione e si verifica che la SUA scheda 2026 sia presente.
 *
 * Direttori e schede sono derivati dal DB (nessun utente hard-coded). Password 'ofbiz' (ambiente locale).
 * Requisiti: stack attivo (FE :4200, legacy :8080, BE :8081) + DB. Cap per run veloci: env MAX_UO.
 */
import { test, expect } from '@playwright/test';
import { login, openInterrogazione, cercaPerTitolo, testoInQualcheFrame } from '../support/auth';
import { listSchedeConDirUO2026 } from '../support/db';

const PASS = process.env.E2E_PASS || 'ofbiz';
const MAX_UO = process.env.MAX_UO ? Number(process.env.MAX_UO) : Infinity;

test('Ogni Direttore UO vede la PROPRIA scheda CTX_BS 2026 in Interrogazione', async ({ browser }) => {
  test.setTimeout(30 * 60 * 1000);

  const dirs = (await listSchedeConDirUO2026()).slice(0, MAX_UO);
  expect(dirs.length, 'Nessun Direttore UO 2026 derivato dal DB — verificare POST_IMPORT_ASSEGNA_PROFILI').toBeGreaterThan(0);
  console.log(`\nDirettori UO 2026 da verificare: ${dirs.length}`);

  const nonVede: string[] = [];
  let ok = 0;

  for (const d of dirs) {
    // CONTEXT NUOVO per ogni direttore = sessione pulita (senza, il login successivo resta appeso
    // perché l'app è già autenticata e non ripropone il form). Si chiude a fine iterazione.
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await login(page, d.dirUserLoginId, PASS);
      const frame = await openInterrogazione(page);
      await cercaPerTitolo(frame, d.nome);
      // Asserzione sul CODICE scheda 2026 (univoco), cercato in TUTTI i frame (la griglia è annidata).
      const visibile = await testoInQualcheFrame(page, d.sourceReferenceId);
      if (visibile) { ok++; }
      else { nonVede.push(`${d.dirUserLoginId} → NON vede "${d.sourceReferenceId}" (${d.nome}, UO ${d.orgUnitId}, stato ${d.statoCorrente})`); }
    } catch (e: any) {
      nonVede.push(`${d.dirUserLoginId} → ERRORE (${e?.message || e}) su "${d.nome}"`);
    } finally {
      await context.close();
    }
  }

  console.log(`\n=== Direttore vede propria scheda: ${ok}/${dirs.length} OK ===`);
  nonVede.slice(0, 20).forEach((x) => console.log('  X ' + x));

  expect(nonVede, `${nonVede.length} direttori NON vedono la propria scheda in Interrogazione:\n` + nonVede.join('\n')).toEqual([]);
});
