/**
 * BATTERIA VISIBILITÀ #3 — Un Direttore UO NON può MODIFICARE la valutazione (scheda in sola lettura).
 *
 * Il Direttore, aprendo la PROPRIA scheda in Definizione, può solo VALIDARE ("Valida parzialmente"):
 * i campi della scheda/valutazione sono in SOLA LETTURA. Segnale robusto (verificato a DOM confrontando
 * direttore vs admin): il direttore NON ha campi editabili del form di gestione scheda
 * `WorkEffortRootViewManagementForm_*` (l'admin sì, incl. `uomRangeScoreId`). Gli unici input editabili
 * ammessi sono il form di RICERCA e `reasonDescription`/`reasonDescriptionSimplified` (motivazione di validazione).
 *
 * Utenti/schede derivati dal DB. Password 'ofbiz'. Cap run veloci: env MAX_UO. Stack + DB attivi.
 */
import { test, expect } from '@playwright/test';
import { login, openDefinizione, apriSchedaDaGriglia } from '../support/auth';
import { listSchedeConDirUO2026 } from '../support/db';

const PASS = process.env.E2E_PASS || 'ofbiz';
const MAX_UO = process.env.MAX_UO ? Number(process.env.MAX_UO) : Infinity;

/** Conta gli input editabili del FORM DI GESTIONE della scheda (dettaglio) su tutti i frame.
 *  Editabile = non readonly/disabled e appartenente al ManagementForm (scheda), non al form di ricerca. */
async function campiSchedaEditabili(page: import('@playwright/test').Page): Promise<string[]> {
  const out: string[] = [];
  for (const f of page.frames()) {
    const found = await f.evaluate(() => {
      const res: string[] = [];
      document.querySelectorAll('input,textarea,select').forEach((e: any) => {
        const key = ((e.getAttribute('name') || '') + ' ' + (e.id || ''));
        if (!/ManagementForm|WorkEffortMeasure|scoreKpi|kpiScore|weScore/i.test(key)) return; // solo campi scheda/valutazione
        const ro = e.readOnly || e.disabled || e.getAttribute('readonly') !== null || e.getAttribute('disabled') !== null;
        const type = (e.getAttribute('type') || e.tagName).toLowerCase();
        if (!ro && !['hidden', 'submit', 'button'].includes(type)) res.push(`${e.tagName.toLowerCase()} ${key.trim().slice(0, 60)}`);
      });
      return res;
    }).catch(() => [] as string[]);
    out.push(...found);
  }
  return [...new Set(out)];
}

test('Un Direttore UO NON può modificare la valutazione (scheda in sola lettura)', async ({ browser }) => {
  test.setTimeout(30 * 60 * 1000);

  const dirs = (await listSchedeConDirUO2026()).slice(0, MAX_UO);
  expect(dirs.length, 'Nessun Direttore UO 2026 derivato dal DB').toBeGreaterThan(0);
  console.log(`\nDirettori da verificare (valutazione sola lettura): ${dirs.length}`);

  const modificabili: string[] = [];
  let ok = 0;

  for (const d of dirs) {
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await login(page, d.dirUserLoginId, PASS);
      const frame = await openDefinizione(page);
      await apriSchedaDaGriglia(page, frame, d.nome, d.workEffortId);
      await page.waitForTimeout(1_500); // render dettaglio
      const editabili = await campiSchedaEditabili(page);
      if (editabili.length > 0) {
        modificabili.push(`${d.dirUserLoginId} (${d.sourceReferenceId}) → ${editabili.length} campi scheda EDITABILI: ${editabili.slice(0, 5).join(', ')}`);
      } else { ok++; }
    } catch (e: any) {
      modificabili.push(`${d.dirUserLoginId} → ERRORE (${e?.message || e})`);
    } finally {
      await context.close();
    }
  }

  console.log(`\n=== Valutazione sola lettura: ${ok}/${dirs.length} OK ===`);
  modificabili.slice(0, 20).forEach((x) => console.log('  X ' + x));

  expect(modificabili, `${modificabili.length} direttori possono MODIFICARE la scheda/valutazione:\n` + modificabili.join('\n')).toEqual([]);
});
