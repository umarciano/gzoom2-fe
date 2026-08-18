import { Page, FrameLocator, expect } from '@playwright/test';

/** Login via UI sulla pagina iniziale dell'app Angular (:4200). */
export async function login(page: Page, user: string, pass: string): Promise<void> {
  await page.goto('/');
  // gli input di login usano aria-label, non placeholder: uso selettori strutturali stabili.
  await page.locator('input[name="username"]').fill(user);
  await page.locator('input[name="password"]').fill(pass);
  await page.locator('form[name="form"] button').click();
  // A login avvenuto compare l'header con l'hamburger della sidebar (classe stabile, no i18n).
  await expect(page.locator('a.navbar-toggleable-sm')).toBeVisible({ timeout: 20_000 });
}

/** Attende che l'overlay di caricamento globale (app-loader) sparisca, per non
 *  farsi intercettare i click dallo spinner. */
async function waitNoLoader(page: Page): Promise<void> {
  await page
    .locator('app-loader p-progressspinner')
    .waitFor({ state: 'hidden', timeout: 20_000 })
    .catch(() => { /* se non compare mai, ok */ });
}

/** Apre il menu laterale e clicca la voce indicata (folder=espande, leaf=naviga). */
async function clickMenu(page: Page, name: string): Promise<void> {
  await waitNoLoader(page);
  await page.getByRole('link', { name, exact: true }).click();
}

/**
 * Apre la sidebar (hamburger) e attende che i root del menu — caricati async dal
 * backend in base al profilo dell'utente — siano renderizzati. Serve per poter
 * asserire in modo affidabile la PRESENZA o l'ASSENZA di una voce (niente falsi verdi).
 */
export async function openMenu(page: Page): Promise<void> {
  // La sidebar è aperta di default dopo il login; l'hamburger AGGIUNGE la classe
  // 'collapse' (la chiude). Quindi apro solo se risulta collassata.
  const cls = (await page.locator('#sidebar').getAttribute('class')) || '';
  if (cls.includes('collapse')) {
    await page.locator('a.navbar-toggleable-sm').click();
  }
  // almeno un root del menu è visibile => il menu si è caricato ed è aperto
  await page.locator('#sidebar a[role="link"]').first().waitFor({ state: 'visible', timeout: 20_000 });
}

/**
 * Naviga Performance Strategica → Gestione → Definizione (via menu, no URL diretti)
 * e ritorna il FrameLocator della schermata legacy (iframe) col form filtri pronto.
 */
export async function openDefinizione(page: Page): Promise<FrameLocator> {
  await openMenu(page);
  // Attivo il root PERFORMANCE STRATEGICA: così SOLO i suoi figli diventano visibili
  // (quelli degli altri root restano display:none e non confondono i match per nome).
  await clickMenu(page, 'PERFORMANCE STRATEGICA');
  await clickMenu(page, 'Gestione');
  await clickMenu(page, 'Definizione');
  const frame = page.frameLocator('iframe');
  // il form filtri legacy (id verificato a DOM)
  await frame.locator('#searchForm').waitFor({ state: 'attached' });
  await frame.locator('#WorkEffortRootViewSearchForm_workEffortName_fld0_value').waitFor({ state: 'visible' });
  return frame;
}

/**
 * Filtra per Titolo e lancia la ricerca nella griglia legacy.
 * (Il filtro è necessario: i risultati sono paginati a 20/pagina.)
 * Selettori verificati sul DOM dell'iframe (searchForm + toolbar "Ricerca").
 */
export async function cercaPerTitolo(frame: FrameLocator, titolo: string): Promise<void> {
  await frame.locator('#WorkEffortRootViewSearchForm_workEffortName_fld0_value').fill(titolo);
  await frame.locator('li.search.action-menu-item').click();
}
