import { test, expect, Page } from '@playwright/test';
import { login, openConsuntivazione, openDefinizione, cercaPerTitolo, apriSchedaDaGriglia } from '../support/auth';
import {
  findSchedaConAlmenoNIndicatori, getIndicatoriDiScheda, setFlagIndicatore,
  getStatoScheda, setStatoScheda, getScoreKpi, clearMovimentiMisura,
  findUtenteInGruppi, IndicatoreMisura, SchedaConDir,
} from '../support/db';

/**
 * TEST — Doppio ciclo di consuntivazione (CTX_BS): flusso completo end-to-end su una scheda
 * con 5 indicatori misti (3 flag consuntivabileParzialmente='Y' + 2 flag 'N').
 *
 * FLUSSO:
 *   1. Setup: scheda -> TOVALIDATE, 3 indicatori con flag Y, 2 con flag N.
 *   2. Dir UO -> "Valida" -> VALPART.
 *   3. Dir San/Amm -> "Valida" -> validaCompletaWorkEffort decide TOACC_INT
 *      (perché almeno un indicatore ha flag Y).
 *   4. Referente (admin per semplicità E2E) salva ACTUAL_INT per i 3 indicatori Y:
 *      il terzo salvataggio innesca l'ECA checkCardCompleteAndAdvance -> ACC_INT.
 *   5. Comando admin massivo avviaConsuntivazioneFinaleBs -> TOACCOUNT.
 *   6. Referente salva ACTUAL per tutti e 5 gli indicatori -> SCOREKPI/ACTUAL sui 5.
 *   7. Verifiche DB: SCOREKPI/ACTUAL_INT presente solo sui 3 Y; SCOREKPI/ACTUAL su tutti.
 *   8. Teardown: ripristina flag, stato, pulizia movimenti.
 *
 * NB: usa una scheda ESISTENTE con ≥5 indicatori (scelta dinamica). Il test è auto-cleanup.
 */

const PASS = process.env.E2E_PASS || 'ofbiz';
const ADMIN = process.env.E2E_ADMIN_USER || 'admin';

interface AuthCtx { auth: string; base: string; }

async function apriPortaleECattura(page: Page): Promise<AuthCtx | null> {
  try {
    const [resp] = await Promise.all([
      page.waitForResponse((r) => /consuntivazione\/albero/.test(r.url()), { timeout: 30_000 }),
      openConsuntivazione(page),
    ]);
    const auth = await resp.request().headerValue('authorization');
    if (!auth) return null;
    const base = resp.url().replace(/consuntivazione\/albero.*$/, '');
    return { auth, base };
  } catch {
    return null;
  }
}

async function postValore(
  page: Page, ctx: AuthCtx,
  workEffortId: string, glAccountId: string,
  glFiscalTypeId: 'ACTUAL' | 'ACTUAL_INT', transValue: number,
) {
  return page.request.post(ctx.base + 'consuntivazione/valori', {
    headers: { Authorization: ctx.auth, 'Content-Type': 'application/json' },
    data: [{ workEffortId, glAccountId, glFiscalTypeId, transValue }],
  });
}

async function comandoMassivoAvvioFinale(page: Page, workEffortId: string): Promise<{ ok: boolean; body: string }> {
  const url = new URL(page.url());
  const origin = `${url.protocol}//${url.host}`;
  const res = await page.request.post(`${origin}/stratperf/control/avviaConsuntivazioneFinaleBs`, {
    form: { workEffortIds: workEffortId },
  });
  return { ok: res.ok(), body: await res.text() };
}

test.describe('Doppio ciclo consuntivazione CTX_BS (E2E, scheda mista 3Y+2N)', () => {

  test('flusso completo: TOVALIDATE -> VALPART -> TOACC_INT -> auto ACC_INT -> TOACCOUNT -> ACCOUNTED', async ({ page, request }) => {
    test.setTimeout(180_000);

    // ---- SETUP ----------------------------------------------------------------
    const scheda: SchedaConDir | null = await findSchedaConAlmenoNIndicatori(5);
    test.skip(!scheda, 'Nessuna scheda CTX_BS con almeno 5 indicatori e Dir UO responsabile');

    const dirSanAmm = await findUtenteInGruppi(['STRATPERF_DIR_SAN', 'STRATPERF_DIR_AMM']);
    test.skip(!dirSanAmm, 'Nessun Dir San/Amm nel DB');

    const indicatori: IndicatoreMisura[] = await getIndicatoriDiScheda(scheda!.workEffortId);
    expect(indicatori.length, 'la scheda deve avere ≥5 indicatori').toBeGreaterThanOrEqual(5);

    const cinque = indicatori.slice(0, 5);
    const gruppoY = cinque.slice(0, 3); // 3 flag=Y
    const gruppoN = cinque.slice(3);    // 2 flag=N

    const statoOriginale = scheda!.statoCorrente ?? await getStatoScheda(scheda!.workEffortId);
    const flagOriginali = new Map<string, 'Y' | 'N'>();

    try {
      // Marca i primi 3 come Y, gli ultimi 2 come N (salvando lo stato originale).
      for (const ind of gruppoY) flagOriginali.set(ind.glAccountId, await setFlagIndicatore(ind.glAccountId, 'Y'));
      for (const ind of gruppoN) flagOriginali.set(ind.glAccountId, await setFlagIndicatore(ind.glAccountId, 'N'));

      // Pulizia movimenti pre-esistenti per test deterministico.
      for (const ind of cinque) await clearMovimentiMisura(ind.workEffortMeasureId);

      // Porta la scheda in TOVALIDATE (stato di partenza).
      await setStatoScheda(scheda!.workEffortId, 'WEORCARD_TOVALIDATE');

      // ---- STEP 1: Dir UO valida -> VALPART ----------------------
      await login(page, scheda!.dirUserLoginId, PASS);
      page.on('dialog', (d) => { d.accept().catch(() => {}); });
      let frame = await openDefinizione(page);
      await cercaPerTitolo(frame, scheda!.nome);
      await apriSchedaDaGriglia(page, frame, scheda!.nome, scheda!.workEffortId);
      const btnParziale = frame.getByRole('button', { name: 'Valida', exact: true });
      await expect(btnParziale).toBeVisible({ timeout: 20_000 });
      await btnParziale.click();
      await expect.poll(() => getStatoScheda(scheda!.workEffortId),
        { timeout: 20_000, message: 'stato non passato a VALPART' }).toBe('WEORCARD_VALPART');

      // ---- STEP 2: Dir San/Amm valida completa -> TOACC_INT -------------------
      // (validaCompletaWorkEffort decide TOACC_INT perché ci sono indicatori Y)
      await page.context().clearCookies();
      await login(page, dirSanAmm!, PASS);
      frame = await openDefinizione(page);
      await cercaPerTitolo(frame, scheda!.nome);
      await apriSchedaDaGriglia(page, frame, scheda!.nome, scheda!.workEffortId);
      const btnValida = frame.getByRole('button', { name: 'Valida', exact: true });
      await expect(btnValida).toBeVisible({ timeout: 20_000 });
      await btnValida.click();
      await expect.poll(() => getStatoScheda(scheda!.workEffortId),
        { timeout: 20_000, message: 'stato non passato a TOACC_INT' }).toBe('WEORCARD_TOACC_INT');

      // ---- STEP 3: salva ACTUAL_INT sui 3 indicatori Y (l'ultimo auto-avanza ACC_INT) -----
      await page.context().clearCookies();
      await login(page, ADMIN, PASS);
      const ctx = await apriPortaleECattura(page);
      test.skip(!ctx, 'Portale referente non disponibile / token non catturato');

      for (const [i, ind] of gruppoY.entries()) {
        const res = await postValore(page, ctx!, scheda!.workEffortId, ind.glAccountId, 'ACTUAL_INT', 50 + i * 10);
        expect(res.ok(), `save ACTUAL_INT indicatore ${ind.accountCode} deve andare a buon fine`).toBeTruthy();
      }

      // Dopo l'ultimo salvataggio l'ECA checkCardCompleteAndAdvance deve promuovere ACC_INT.
      await expect.poll(() => getStatoScheda(scheda!.workEffortId),
        { timeout: 15_000, message: 'stato non passato ad ACC_INT (auto-advance ECA fallito)' }).toBe('WEORCARD_ACC_INT');

      // Movimenti intermedi: SCOREKPI/ACTUAL_INT su tutti e 3 gli Y, nessuno sugli N.
      for (const ind of gruppoY) {
        const s = await getScoreKpi(ind.workEffortMeasureId, 'ACTUAL_INT');
        expect(s, `SCOREKPI/ACTUAL_INT deve esistere per ${ind.accountCode}`).not.toBeNull();
      }
      for (const ind of gruppoN) {
        const s = await getScoreKpi(ind.workEffortMeasureId, 'ACTUAL_INT');
        expect(s, `SCOREKPI/ACTUAL_INT NON deve esistere per l'annuale ${ind.accountCode}`).toBeNull();
      }

      // ---- STEP 4: comando admin massivo ACC_INT -> TOACCOUNT ----------------
      const massivo = await comandoMassivoAvvioFinale(page, scheda!.workEffortId);
      expect(massivo.ok, `comando massivo deve rispondere OK (body=${massivo.body.slice(0, 200)})`).toBeTruthy();
      await expect.poll(() => getStatoScheda(scheda!.workEffortId),
        { timeout: 15_000, message: 'stato non passato a TOACCOUNT dopo comando massivo' }).toBe('WEORCARD_TOACCOUNT');

      // ---- STEP 5: salva ACTUAL su tutti i 5 indicatori (fase finale) --------
      for (const [i, ind] of cinque.entries()) {
        const res = await postValore(page, ctx!, scheda!.workEffortId, ind.glAccountId, 'ACTUAL', 100 + i * 5);
        expect(res.ok(), `save ACTUAL indicatore ${ind.accountCode}`).toBeTruthy();
      }

      // Movimenti finali: SCOREKPI/ACTUAL su tutti e 5.
      for (const ind of cinque) {
        const s = await getScoreKpi(ind.workEffortMeasureId, 'ACTUAL');
        expect(s, `SCOREKPI/ACTUAL deve esistere per ${ind.accountCode}`).not.toBeNull();
      }
      // Gli SCOREKPI/ACTUAL_INT devono restare INVARIATI (non cancellati dal salvataggio finale).
      for (const ind of gruppoY) {
        const s = await getScoreKpi(ind.workEffortMeasureId, 'ACTUAL_INT');
        expect(s, `SCOREKPI/ACTUAL_INT deve persistere per ${ind.accountCode} dopo la fase finale`).not.toBeNull();
      }

      // ---- STEP 6: chiusura workflow (opzionale: verifica solo passaggio TOACCOUNT->ACCOUNTED via DB) ---
      // Il resto del workflow è testato altrove (validazione-workflow.spec.ts).
    } finally {
      // ---- TEARDOWN -----------------------------------------------------------
      for (const [glAccountId, prev] of flagOriginali) {
        await setFlagIndicatore(glAccountId, prev);
      }
      for (const ind of cinque) {
        await clearMovimentiMisura(ind.workEffortMeasureId);
      }
      if (statoOriginale) await setStatoScheda(scheda!.workEffortId, statoOriginale);
    }
  });
});
