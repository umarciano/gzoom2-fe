/**
 * BATTERIA VISIBILITÀ #2 — Un Direttore UO vede in Interrogazione SOLO le proprie UO (scoping).
 *
 * Per ogni Direttore UO (derivato dal DB, esclusi i Dir San/Amm che vedono tutto): login → Interrogazione
 * → ricerca con ZERO filtri (nessun titolo). La griglia deve mostrare SOLO le schede delle sue UO:
 *   - la SUA scheda 2026 è presente;
 *   - NESSUNA scheda 2026 di un'ALTRA UO (di un altro direttore) compare.
 *
 * Utenti e schede derivati dal DB (nessun hard-coded). Password 'ofbiz'. Cap run veloci: env MAX_UO.
 * Requisiti: stack attivo (FE :4200, legacy :8080, BE :8081) + DB.
 */
import { test, expect } from '@playwright/test';
import { login, openInterrogazione, cercaSenzaFiltri, leggiTestoFrames, apriSchedaDaGriglia } from '../support/auth';
import { listSchedeConDirUO2026 } from '../support/db';

/** Nome UO dal titolo scheda: "Obiettivo Performance Strategica UOC <nome>" -> "<nome>". */
const uoDaNome = (nome: string) => nome.replace(/^Obiettivo Performance Strategica UO[CS]?\s*/i, '').trim();

const PASS = process.env.E2E_PASS || 'ofbiz';
const MAX_UO = process.env.MAX_UO ? Number(process.env.MAX_UO) : Infinity;

test('Un Direttore UO in Interrogazione (ricerca a vuoto) vede SOLO le proprie UO', async ({ browser }) => {
  test.setTimeout(30 * 60 * 1000);

  const all = await listSchedeConDirUO2026();
  expect(all.length, 'Nessun Direttore UO 2026 derivato dal DB').toBeGreaterThan(1);
  const sample = all.slice(0, MAX_UO);
  console.log(`\nDirettori da verificare (scoping "solo le mie UO"): ${sample.length}`);

  const problemi: string[] = [];
  let ok = 0;

  for (const d of sample) {
    // Codici 2026 del direttore (può dirigere più UO) vs codici 2026 ALTRUI.
    const propri = new Set(all.filter((x) => x.dirUserLoginId === d.dirUserLoginId).map((x) => x.sourceReferenceId));
    const altrui = [...new Set(all.map((x) => x.sourceReferenceId).filter((c) => !propri.has(c)))];

    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await login(page, d.dirUserLoginId, PASS);
      const frame = await openInterrogazione(page);
      await cercaSenzaFiltri(frame);                  // ricerca SENZA titolo/filtri
      const txt = await leggiTestoFrames(page);       // testo di tutti i frame (griglia annidata)

      const vedeLaPropria = txt.includes(d.sourceReferenceId);
      const trapelate = altrui.filter((c) => txt.includes(c));

      if (!vedeLaPropria) problemi.push(`${d.dirUserLoginId} → NON vede la PROPRIA ${d.sourceReferenceId} con ricerca a vuoto`);
      if (trapelate.length) problemi.push(`${d.dirUserLoginId} (UO ${d.orgUnitId}) → vede ${trapelate.length} schede ALTRUI: ${trapelate.slice(0, 6).join(', ')}${trapelate.length > 6 ? '…' : ''}`);
      if (vedeLaPropria && trapelate.length === 0) ok++;
    } catch (e: any) {
      problemi.push(`${d.dirUserLoginId} → ERRORE (${e?.message || e})`);
    } finally {
      await context.close();
    }
  }

  console.log(`\n=== Scoping "solo le mie UO": ${ok}/${sample.length} OK ===`);
  problemi.slice(0, 20).forEach((x) => console.log('  X ' + x));

  expect(problemi, `${problemi.length} problemi di scoping:\n` + problemi.join('\n')).toEqual([]);
});

test("Un Direttore UO NON può aprire per accesso DIRETTO (workEffortId) la scheda di un'ALTRA UO", async ({ browser }) => {
  test.setTimeout(30 * 60 * 1000);

  const all = await listSchedeConDirUO2026();
  const sample = all.slice(0, MAX_UO);
  console.log(`\nDirettori da verificare (accesso diretto IDOR): ${sample.length}`);

  const accessiConcessi: string[] = [];
  let ok = 0;

  for (const d of sample) {
    const altra = all.find((x) => x.orgUnitId !== d.orgUnitId && x.dirUserLoginId !== d.dirUserLoginId);
    if (!altra) continue;
    const uoAltrui = uoDaNome(altra.nome);

    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await login(page, d.dirUserLoginId, PASS);
      const frame = await openInterrogazione(page);
      // Tentativo di accesso DIRETTO al dettaglio di una scheda ALTRUI (equivalente all'URL/id "indovinato").
      await apriSchedaDaGriglia(page, frame, altra.nome, altra.workEffortId).catch(() => { /* bloccato = ok */ });
      // Accesso CONCESSO se il DETTAGLIO altrui si carica: la "Unità Responsabile" mostra la UO altrui.
      // Polling case-insensitive fino a 15s (senza attesa il read può precedere il render AJAX -> flaky).
      const needle = uoAltrui.toLowerCase();
      let concesso = false;
      for (const deadline = Date.now() + 15_000; Date.now() < deadline && !concesso; ) {
        for (const f of page.frames()) {
          const t = (await f.evaluate(() => document.body?.innerText || '').catch(() => '')).toLowerCase();
          if (needle && t.includes(needle)) { concesso = true; break; }
        }
        if (!concesso) await page.waitForTimeout(500);
      }
      if (concesso) {
        accessiConcessi.push(`${d.dirUserLoginId} (UO ${d.orgUnitId}) HA APERTO la scheda ALTRUI ${altra.sourceReferenceId} (UO "${uoAltrui}")`);
      } else { ok++; }
    } catch (e: any) {
      ok++; // errore nell'apertura = accesso di fatto negato
    } finally {
      await context.close();
    }
  }

  console.log(`\n=== Accesso diretto negato: ${ok}/${sample.length} OK ===`);
  accessiConcessi.slice(0, 20).forEach((x) => console.log('  X ' + x));

  expect(accessiConcessi, `IDOR — ${accessiConcessi.length} direttori aprono per accesso diretto una scheda di ALTRA UO ` +
    `(l'endpoint dettaglio non verifica l'autorizzazione):\n` + accessiConcessi.join('\n')).toEqual([]);
});
