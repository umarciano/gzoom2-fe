import { test, expect, Page } from '@playwright/test';
import { login, openConsuntivazione } from '../support/auth';
import { findScheda } from '../support/db';

/**
 * TEST #7 — Validazioni server-side del salvataggio consuntivo del referente (controlli B2/B6,
 * ConsuntivazioneService.salvaValori nel BE). Casi concreti che DEVONO essere RIFIUTATI:
 *  - indicatore/scheda FUORI dal proprio albero (whitelist B2) -> SecurityException;
 *  - valore NEGATIVO (B6) -> IllegalArgumentException;
 *  - indicatore SI/NO con valore != 0/100 (B6) -> IllegalArgumentException.
 *
 * Approccio: si apre il portale (Angular) e si CATTURA la richiesta reale GET consuntivazione/albero
 * per ricavare base URL + token (Authorization Bearer) e l'albero valido; poi si fa POST diretto
 * a consuntivazione/valori con payload invalidi. I payload invalidi vengono respinti PRIMA di salvare
 * (validazione all-or-nothing) -> nessun effetto collaterale sui dati.
 * Attore: admin (l'albero dell'admin contiene tutti gli indicatori con referente). Password 'ofbiz'.
 */

const PASS = process.env.E2E_PASS || 'ofbiz';
const ADMIN = process.env.E2E_ADMIN_USER || 'admin';

interface Ctx { auth: string | null; base: string; albero: any[]; }

async function apriPortaleECattura(page: Page): Promise<Ctx> {
  const [resp] = await Promise.all([
    page.waitForResponse((r) => /consuntivazione\/albero/.test(r.url()), { timeout: 30_000 }),
    openConsuntivazione(page),
  ]);
  const auth = await resp.request().headerValue('authorization');
  const base = resp.url().replace(/consuntivazione\/albero.*$/, ''); // .../rest/api/
  let albero: any[] = [];
  try { albero = ((await resp.json()) as any).results || []; } catch { /* portale vuoto */ }
  return { auth, base, albero };
}

function coppiaValida(albero: any[]): { we: string; gl: string } | null {
  for (const ind of albero) {
    for (const uo of (ind.uo || [])) {
      if (uo.workEffortId && ind.glAccountId) return { we: uo.workEffortId, gl: ind.glAccountId };
    }
  }
  return null;
}

async function postValori(page: Page, ctx: Ctx, movimenti: any[]) {
  return page.request.post(ctx.base + 'consuntivazione/valori', {
    headers: { Authorization: ctx.auth || '', 'Content-Type': 'application/json' },
    data: movimenti,
  });
}

test.describe('Consuntivazione: validazioni salvataggio (B2/B6)', () => {

  test('RIFIUTA il salvataggio di un indicatore FUORI dal proprio albero (whitelist)', async ({ page }) => {
    await login(page, ADMIN, PASS);
    const ctx = await apriPortaleECattura(page);
    test.skip(!ctx.auth, 'Token/endpoint albero non catturati');
    const init = await findScheda({ stato: 'WEORCARD_INIT' }); // scheda NON in "Da consuntivare" => non ammessa
    test.skip(!init, 'Nessuna scheda INIT nel DB');
    const res = await postValori(page, ctx, [
      { workEffortId: init!.workEffortId, glAccountId: 'GL_BOGUS_TEST', glFiscalTypeId: 'ACTUAL', transValue: 10 },
    ]);
    const body = await res.text();
    expect(res.ok(), `salvataggio non autorizzato deve essere respinto (status=${res.status()}, body=${body.slice(0, 200)})`).toBeFalsy();
  });

  test('RIFIUTA un valore NEGATIVO su un indicatore del proprio albero', async ({ page }) => {
    // ATTENZIONE: se il BE NON applica il controllo B6 (validazione presente nel sorgente gzoom2-be ma
    // non ancora committata/deployata su :8081), questo POST SALVEREBBE davvero il valore. Skip di default
    // per non scrivere dati; abilitare con E2E_BE_VALIDAZIONI=1 dopo il rebuild del BE con le validazioni.
    test.skip(!process.env.E2E_BE_VALIDAZIONI, 'Richiede gzoom2-be ricompilato con le validazioni B6 attive (E2E_BE_VALIDAZIONI=1)');
    await login(page, ADMIN, PASS);
    const ctx = await apriPortaleECattura(page);
    const pair = coppiaValida(ctx.albero);
    test.skip(!ctx.auth || !pair, 'Albero senza coppie valide (nessuna scheda in "Da consuntivare")');
    const res = await postValori(page, ctx, [
      { workEffortId: pair!.we, glAccountId: pair!.gl, glFiscalTypeId: 'ACTUAL', transValue: -1 },
    ]);
    const body = await res.text();
    expect(res.ok(), `valore negativo deve essere respinto (status=${res.status()}, body=${body.slice(0, 200)})`).toBeFalsy();
  });

  test('RIFIUTA un valore != 0/100 su un indicatore SI/NO', async ({ page }) => {
    // Stessa cautela del test precedente: senza il controllo B6 attivo sul BE, il POST SALVEREBBE 50.
    test.skip(!process.env.E2E_BE_VALIDAZIONI, 'Richiede gzoom2-be ricompilato con le validazioni B6 attive (E2E_BE_VALIDAZIONI=1)');
    await login(page, ADMIN, PASS);
    const ctx = await apriPortaleECattura(page);
    const ind = ctx.albero.find((i) => i.tipo && /SI[_\s]?NO/i.test(String(i.tipo)));
    const uo = ind && (ind.uo || [])[0];
    test.skip(!ctx.auth || !ind || !uo, 'Nessun indicatore SI/NO nell\'albero');
    const res = await postValori(page, ctx, [
      { workEffortId: uo.workEffortId, glAccountId: ind.glAccountId, glFiscalTypeId: 'ACTUAL', transValue: 50 },
    ]);
    const body = await res.text();
    expect(res.ok(), `SI/NO con valore 50 deve essere respinto (status=${res.status()}, body=${body.slice(0, 200)})`).toBeFalsy();
  });
});
