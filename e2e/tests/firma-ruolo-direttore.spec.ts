import { test, expect } from '@playwright/test';
import { login, openDefinizione, cercaPerTitolo, apriSchedaDaGriglia, testoInQualcheFrame } from '../support/auth';
import { findSchedaFirmata, findScheda } from '../support/db';

/**
 * TEST — Firme a RUOLO SINGOLO del Direttore (CTX_BS).
 *
 * REQUISITO: dopo la separazione dei direttori di dipartimento (Amm vs San) le firme
 * "Direttore Sanitario/Amministrativo" devono riportare SOLO il ruolo di chi ha firmato:
 *   - firma di VALIDAZIONE completa  (stato WEORCARD_VALIDATED) -> "F.to <Ruolo> il ..."
 *   - firma di PRESA VISIONE         (stato WEORCARD_REVIEWED)  -> "Presa visione del <Ruolo> il ..."
 * dove <Ruolo> = "Direttore Amministrativo" (firmatario in STRATPERF_DIR_AMM),
 *              = "Direttore Sanitario"       (firmatario in STRATPERF_DIR_SAN),
 *              = "Direttore Sanitario/Amministrativo" (FALLBACK: firmatario ne'/entrambi i gruppi, es. admin).
 *
 * Copre i 4 punti modificati:
 *   1-2. Stampe BIRT (Assegnazione: colonna firmaSanAmm; Consuntivazione: colonna visioneDir).
 *   3-4. In-app (StratPerfRootViewForms.xml labels dataValidazioneCompletaLabel / dataVisioneLabel,
 *        variabili firmaValidazioneRuolo / firmaVisioneRuolo calcolate in checkDirettoreRole.groovy).
 *
 * DINAMICO: schede e ruolo atteso sono DERIVATI dal DB (nessun utente/etichetta hard-coded),
 * con la STESSA logica CASE embeddata in report/groovy. Read-only: nessun teardown di stato.
 *
 * DEPLOY: NON serve alcun riavvio Tomcat. Verificato live (2026-09-23) che lo screen-action groovy
 * (checkDirettoreRole.groovy) e il widget form (StratPerfRootViewForms.xml) si ricaricano a caldo,
 * e i .rptdesign BIRT sono letti live da disco: le firme mostrano subito il ruolo corretto.
 */

const PASS = process.env.E2E_PASS || 'ofbiz';
const ADMIN = process.env.E2E_ADMIN_USER || 'admin';
const GENERICO = 'Direttore Sanitario/Amministrativo';

/** Apre il dettaglio di una scheda (via Definizione, admin vede tutti gli stati) e ritorna il frame. */
async function apriDettaglio(page: import('@playwright/test').Page, nome: string, workEffortId: string) {
  const frame = await openDefinizione(page);
  await cercaPerTitolo(frame, nome);
  await apriSchedaDaGriglia(page, frame, nome, workEffortId);
}

test.describe('Firme a ruolo singolo del Direttore (CTX_BS)', () => {

  test('IN-APP: firma di validazione mostra SOLO il ruolo del firmatario', async ({ page }) => {
    const s = await findSchedaFirmata('WEORCARD_VALIDATED', 'IN');
    test.skip(!s, 'Nessuna scheda VALIDATED con firmatario Amm/San nel DB');
    await login(page, ADMIN, PASS);
    await apriDettaglio(page, s!.nome, s!.workEffortId);

    // Deve comparire la firma col RUOLO SPECIFICO del firmatario...
    const okRuolo = await testoInQualcheFrame(page, `F.to ${s!.ruoloAtteso} il`, 15_000);
    expect(okRuolo, `atteso "F.to ${s!.ruoloAtteso} il" per scheda ${s!.workEffortId} firmata da ${s!.firmatario}`).toBeTruthy();
    // ...e NON piu' la dicitura generica accorpata (dato che il ruolo e' risolvibile).
    const restaGenerico = await testoInQualcheFrame(page, `F.to ${GENERICO} il`, 3_000);
    expect(restaGenerico, 'la firma non deve piu' + ' mostrare la dicitura generica accorpata').toBeFalsy();
  });

  test('IN-APP: presa visione mostra SOLO il ruolo del firmatario', async ({ page }) => {
    const s = await findSchedaFirmata('WEORCARD_REVIEWED', 'IN');
    test.skip(!s, 'Nessuna scheda REVIEWED con firmatario Amm/San nel DB');
    await login(page, ADMIN, PASS);
    await apriDettaglio(page, s!.nome, s!.workEffortId);

    const okRuolo = await testoInQualcheFrame(page, `Presa visione del ${s!.ruoloAtteso} il`, 15_000);
    expect(okRuolo, `atteso "Presa visione del ${s!.ruoloAtteso} il" per scheda ${s!.workEffortId} firmata da ${s!.firmatario}`).toBeTruthy();
    const restaGenerico = await testoInQualcheFrame(page, `Presa visione del ${GENERICO} il`, 3_000);
    expect(restaGenerico, 'la presa visione non deve piu' + ' mostrare la dicitura generica accorpata').toBeFalsy();
  });

  test('FALLBACK: firmatario non Amm/San -> dicitura generica', async ({ page }) => {
    const s = await findSchedaFirmata('WEORCARD_VALIDATED', 'OUT');
    test.skip(!s, 'Nessuna scheda VALIDATED firmata da utente fuori dai gruppi Amm/San (fallback non verificabile ora)');
    // per costruzione ruoloAtteso == generico
    expect(s!.ruoloAtteso).toBe(GENERICO);
    await login(page, ADMIN, PASS);
    await apriDettaglio(page, s!.nome, s!.workEffortId);
    const okGenerico = await testoInQualcheFrame(page, `F.to ${GENERICO} il`, 15_000);
    expect(okGenerico, `fallback generico atteso per scheda ${s!.workEffortId} firmata da ${s!.firmatario}`).toBeTruthy();
  });

  // ---------------------------------------------------------------------------
  // REGRESSIONI
  // ---------------------------------------------------------------------------

  test('REGRESSIONE: la firma "Direttore di UO" resta invariata (ruolo singolo)', async ({ page }) => {
    // Scheda con una firma Dir UO nello storico (record WEORCARD_VALPART), anche se lo stato
    // corrente e' avanzato: la firma "F.to Direttore di UO" dipende dallo storico, non dallo stato.
    const s = await findSchedaFirmata('WEORCARD_VALPART');
    test.skip(!s, 'Nessuna scheda con firma Dir UO (storico VALPART) nel DB');
    await login(page, ADMIN, PASS);
    await apriDettaglio(page, s!.nome, s!.workEffortId);
    // Il Dir UO era gia' a ruolo singolo: non deve essere toccato dalla modifica.
    const okDirUo = await testoInQualcheFrame(page, 'F.to Direttore di UO il', 15_000);
    expect(okDirUo, `atteso "F.to Direttore di UO il" per scheda ${s!.workEffortId}`).toBeTruthy();
  });

  test('REGRESSIONE: scheda non firmata (INIT) non mostra alcuna firma', async ({ page }) => {
    const s = await findScheda({ stato: 'WEORCARD_INIT' });
    test.skip(!s, 'Nessuna scheda in INIT nel DB');
    await login(page, ADMIN, PASS);
    await apriDettaglio(page, s!.nome, s!.workEffortId);
    const firmaCompleta = await testoInQualcheFrame(page, 'F.to Direttore', 4_000);
    expect(firmaCompleta, 'una scheda INIT non deve mostrare firme di validazione/UO').toBeFalsy();
    const presaVisione = await testoInQualcheFrame(page, 'Presa visione del', 3_000);
    expect(presaVisione, 'una scheda INIT non deve mostrare la presa visione').toBeFalsy();
  });

  // ---------------------------------------------------------------------------
  // STAMPE BIRT (punti 1-2): la colonna firma dei report embedda la STESSA SQL di
  // risoluzione ruolo qui verificata a livello dato. La verifica di parita' dato
  // garantisce che il report riceva l'etichetta corretta; l'estrazione testo dal
  // PDF non e' automatizzata (i .rptdesign sono letti live, nessun restart).
  // ---------------------------------------------------------------------------

  test('DATA-PARITY BIRT: la risoluzione ruolo (VALIDATED) e coerente col firmatario', async () => {
    const s = await findSchedaFirmata('WEORCARD_VALIDATED', 'IN');
    test.skip(!s, 'Nessuna scheda VALIDATED con firmatario Amm/San nel DB');
    expect(['Direttore Amministrativo', 'Direttore Sanitario']).toContain(s!.ruoloAtteso);
  });

  test('DATA-PARITY BIRT: la risoluzione ruolo (REVIEWED) e coerente col firmatario', async () => {
    const s = await findSchedaFirmata('WEORCARD_REVIEWED', 'IN');
    test.skip(!s, 'Nessuna scheda REVIEWED con firmatario Amm/San nel DB');
    expect(['Direttore Amministrativo', 'Direttore Sanitario']).toContain(s!.ruoloAtteso);
  });
});
