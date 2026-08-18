import { test, expect } from '@playwright/test';
import { login, openMenu } from '../support/auth';

/**
 * TEST #2 — Gating del menu «Performance Strategica».
 *
 * Un utente normale (NON Direttore UO / non profilo Performance Strategica) NON deve
 * vedere la voce di menu «PERFORMANCE STRATEGICA».
 *
 * Modello di visibilità (verificato a DB):
 *   - i "valutati" puri (EMPLPERF_VALUTATO) sono anche NOPORTAL_EVAL => non entrano nel portale;
 *   - l'utente normale CON portale ma SENZA Performance Strategica è il VALUTATORE della
 *     performance individuale (capo che valuta i collaboratori): ha un menu, ma non questo.
 *
 * Casi:
 *   - admin (AORNADMIN)  -> controllo POSITIVO: la voce c'è (prova che selettore e menu sono ok);
 *   - VALUTATORE normale -> caso richiesto: la voce NON c'è.
 *
 * La voce di menu è un <a role="link" aria-label="{label}"> => match per accessible name.
 */

const VOCE_MENU = 'PERFORMANCE STRATEGICA';

type Caso = { etichetta: string; user?: string; pass?: string; shouldSee: boolean };

const casi: Caso[] = [
  {
    etichetta: 'admin (AORNADMIN) — controllo positivo',
    user: process.env.E2E_ADMIN_USER,
    pass: process.env.E2E_ADMIN_PASS,
    shouldSee: true,
  },
  {
    etichetta: 'utente normale (VALUTATORE, senza Performance Strategica)',
    user: process.env.E2E_NOPROF_USER,
    pass: process.env.E2E_NOPROF_PASS,
    shouldSee: false,
  },
];

test.describe('Gating menu «Performance Strategica»', () => {
  for (const c of casi) {
    test(`${c.etichetta} ${c.shouldSee ? 'VEDE' : 'NON vede'} «${VOCE_MENU}»`, async ({ page }) => {
      test.skip(!c.user || !c.pass, `Credenziali mancanti in .env per "${c.etichetta}"`);

      await login(page, c.user!, c.pass!);
      await openMenu(page);

      const voce = page.getByRole('link', { name: VOCE_MENU, exact: true });
      if (c.shouldSee) {
        await expect(voce).toBeVisible({ timeout: 20_000 });
      } else {
        await expect(voce).toHaveCount(0);
      }
    });
  }
});
