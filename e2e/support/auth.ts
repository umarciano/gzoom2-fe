import { Page, FrameLocator, Locator, expect } from '@playwright/test';

/** Login via UI sulla pagina iniziale dell'app Angular (:4200). */
export async function login(page: Page, user: string, pass: string): Promise<void> {
  await page.goto('/');
  // gli input di login usano aria-label, non placeholder: uso selettori strutturali stabili.
  await page.locator('input[name="username"]').fill(user);
  await page.locator('input[name="password"]').fill(pass);
  await page.locator('form[name="form"] button').click();
  // A login avvenuto compare l'header con l'hamburger della sidebar (classe stabile, no i18n).
  await expect(page.locator('a.navbar-toggleable-sm')).toBeVisible({ timeout: 20_000 });
  // Attende che la PAGINA INIZIALE (dashboard o "Mie Performance" per i direttori) finisca di caricare,
  // altrimenti una navigazione via menu subito dopo il login "corre" con l'auto-redirect e i click si perdono.
  // Basta lo spinner globale nascosto (evito networkidle che con long-polling attenderebbe sempre il max).
  await page.locator('app-loader p-progressspinner')
    .waitFor({ state: 'hidden', timeout: 20_000 }).catch(() => {});
  // CRITICO: l'app fa un auto-redirect alla home (dashboard, o Mie Performance per i doppio-profilo) che
  // può scattare TARDI, anche DOPO una navigazione via menu, sovrascrivendola (verificato: la vista
  // strategica veniva riportata su NOPORTAL_MY). Si attende che l'URL si STABILIZZI prima di procedere.
  await waitUrlStable(page);
}

/** Attende che l'URL smetta di cambiare per `quietMs` (l'auto-redirect post-login si è esaurito). */
async function waitUrlStable(page: Page, quietMs = 1500, timeout = 20_000): Promise<void> {
  const start = Date.now();
  let last = page.url();
  let lastChange = Date.now();
  while (Date.now() - start < timeout) {
    await page.waitForTimeout(250);
    const cur = page.url();
    if (cur !== last) { last = cur; lastChange = Date.now(); }
    else if (Date.now() - lastChange >= quietMs) return;
  }
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
 * HREF STABILI delle voci foglia del menu "PERFORMANCE STRATEGICA" (id GP_MENU_* fissi da config).
 *
 * PERCHÉ per href e non per etichetta: PERFORMANCE STRATEGICA e PERFORMANCE INDIVIDUALE hanno
 * ENTRAMBE figli chiamati "Gestione/Consultazione/Interrogazione/Stampe/Valutazione". Con gli utenti
 * a doppio profilo il match per nome accessibile è AMBIGUO e — a seconda dell'ordine con cui il
 * backend rende i due sotto-menu — `.first()` può cadere sull'individuale (verificato: il test
 * atterrava su GP_MENU_00124 = individuale). L'href della foglia è invece UNIVOCO.
 */
export const STRAT_HREF = {
  definizione: '/c/legacy/GP_MENU_00086/GP_MENU_00401/GP_MENU_00092',
  valutazione: '/c/legacy/GP_MENU_00086/GP_MENU_00401/GP_MENU_00101',
  interrogazione: '/c/legacy/GP_MENU_00086/GP_MENU_00402/GP_MENU_00104',
  consuntivazione: '/c/CTX_BS/consuntivazione', // etichetta reale: "Consuntivazione indicatori"
  stampe: '/c/legacy/GP_MENU_00086/GP_MENU_00402/GP_MENU_00209',
  portale: '/c/legacy/GP_MENU_00086/GP_MENU_00402/NOPORTAL_BSC',
} as const;

/** Locator della voce di menu strategica per href (utile anche per asserire presenza/assenza). */
export function linkStrategica(page: Page, href: string): Locator {
  return page.locator(`#sidebar a[href="${href}"]`);
}

/**
 * Naviga a una voce foglia di PERFORMANCE STRATEGICA cliccandola per href.
 * Usa dispatchEvent('click'): la foglia può stare in un folder collassato (non "visibile"); il
 * routerLink Angular reagisce comunque al click sintetico — così si evitano sia l'espansione a
 * cascata dei folder (con relative animazioni instabili) sia le collisioni di etichetta.
 */
export async function apriVoceStrategica(
  page: Page, href: string, verifica?: () => Promise<void>,
): Promise<void> {
  await openMenu(page);
  const leaf = linkStrategica(page, href).first();
  await leaf.waitFor({ state: 'attached', timeout: 20_000 });
  if (!verifica) {
    await waitNoLoader(page);
    await leaf.dispatchEvent('click');
    await waitNoLoader(page);
    return;
  }
  // Ri-clicca finché la destinazione non "attecchisce": subito dopo il login l'app fa un auto-redirect
  // alla home (Mie Performance, per gli utenti a doppio profilo) che può SOVRASCRIVERE il primo click
  // sul menu. Il toPass ripete click + verifica finché la vista strategica non è davvero caricata.
  await expect(async () => {
    await waitNoLoader(page);
    await leaf.dispatchEvent('click');
    await verifica();
  }).toPass({ timeout: 45_000, intervals: [500, 1000, 2000, 3000] });
}

/**
 * Naviga Performance Strategica → Gestione → Definizione (per href) e ritorna il FrameLocator legacy.
 */
export async function openDefinizione(page: Page): Promise<FrameLocator> {
  const frame = page.frameLocator('iframe');
  await apriVoceStrategica(page, STRAT_HREF.definizione, async () => {
    // atterrati sulla Definizione strategica (non sull'individuale) E iframe legacy caricato
    await expect(page).toHaveURL(/GP_MENU_00092/, { timeout: 4_000 });
    // #searchForm è nell'iframe di primo livello (verificato a DOM: WorkeffortExtScreens.xml).
    await frame.locator('#searchForm').waitFor({ state: 'attached', timeout: 6_000 });
  });
  return frame;
}

/**
 * Filtra per Titolo e lancia la ricerca nella griglia legacy.
 * (Il filtro è necessario: i risultati sono paginati a 20/pagina.)
 * Selettori verificati sul DOM dell'iframe (searchForm + toolbar "Ricerca").
 */
export async function cercaPerTitolo(frame: FrameLocator, titolo: string): Promise<void> {
  const campo = frame.locator('#WorkEffortRootViewSearchForm_workEffortName_fld0_value');
  if (!(await campo.isVisible().catch(() => false))) {
    // prova ad espandere il pannello "Filtri Principali" (in alcune viste è collassato)
    await frame.getByText('Filtri Principali', { exact: false }).first().click({ timeout: 3_000 }).catch(() => {});
  }
  if (await campo.isVisible().catch(() => false)) {
    await campo.fill(titolo);
    await frame.locator('li.search.action-menu-item').click();
  }
  // se il campo non c'è (griglia già scopata sul profilo), non si filtra: si apre dalla griglia.
}

/**
 * Performance Strategica → Consultazione → Interrogazione (schermata SOLA LETTURA).
 * Ritorna il FrameLocator legacy col form filtri.
 */
export async function openInterrogazione(page: Page): Promise<FrameLocator> {
  const frame = page.frameLocator('iframe');
  await apriVoceStrategica(page, STRAT_HREF.interrogazione, async () => {
    await expect(page).toHaveURL(/GP_MENU_00104/, { timeout: 4_000 });
    await frame.locator('#searchForm').waitFor({ state: 'attached', timeout: 6_000 });
  });
  // il campo titolo può richiedere l'espansione dei filtri: attesa tollerante (non blocca la vista)
  await frame.locator('#WorkEffortRootViewSearchForm_workEffortName_fld0_value')
    .waitFor({ state: 'visible', timeout: 8_000 }).catch(() => {});
  return frame;
}

/**
 * Apre il dettaglio (root view) di una scheda dalla griglia legacy con un DOPPIO-CLICK sulla riga
 * (gesto utente reale). La lista ha class 'dblclick-open-management' e l'app registra
 * onDblClickSelectEnd->openManagement (register-search-result-list-form-responder.js), che apre il
 * dettaglio con i parametri corretti. Attende la toolbar del dettaglio (li.back).
 */
export async function apriSchedaDaGriglia(page: Page, frame: FrameLocator, testo: string, workEffortId: string): Promise<void> {
  // La lista "Definizione" strategica NON ha link <a> nelle righe (a differenza della lista di
  // Performance Individuale) e il doppio-click SINTETICO non innesca l'apertura TableKit/openManagement
  // (verificato: seleziona soltanto). L'apertura reale, catturata a rete al doppio-click dell'utente, è
  // una richiesta AJAX IN-PLACE: `ajaxUpdateAreas -> /stratperf/control/managementContainerOnly`. Si
  // replica ESATTAMENTE quella richiesta dell'app (endpoint + parametri) nel frame legacy: apre il
  // dettaglio con i tab corretti (Dettaglio obiettivo strategico / Stato / Ruoli / Indicatori).
  void testo; // il titolo serve solo alla ricerca a monte (cercaPerTitolo); qui si apre per workEffortId
  // Frame legacy GIUSTO: quello che ha ajaxUpdateAreas E la lista (#searchForm/table.selectable), non un
  // frame annidato che eredita la funzione ma non il DOM della lista.
  let legacy: any = null;
  for (const f of page.frames()) {
    if (await f.evaluate(() => typeof (window as any).ajaxUpdateAreas === 'function'
      && !!document.querySelector('#searchForm, table.selectable')).catch(() => false)) { legacy = f; break; }
  }
  if (!legacy) throw new Error('Frame legacy con ajaxUpdateAreas non trovato per aprire la scheda');
  await legacy.evaluate((weId: string) => {
    // shim difensivo: ajaxUpdateAreas -> waitSpinnerShow legge #wait-spinner.style; se manca in questo
    // frame va in null-crash (selectall.js:655). Lo si crea nascosto per evitarlo.
    if (!document.getElementById('wait-spinner')) {
      const d = document.createElement('div'); d.id = 'wait-spinner'; d.style.visibility = 'hidden'; document.body.appendChild(d);
    }
    const p = 'entityName=WorkEffortView&workEffortId=' + weId + '&workEffortIdRoot=' + weId
      + '&workEffortTypeIdRoot=CTX_BS&loadTreeView=Y&specialized=Y&rootTree=N&rootInqyTree=N'
      + '&screenNameListIndex=5&noLeftBar=true&noInfoToolbar=true&clearSaveView=N&definition=Y&menuItem=BS';
    (window as any).ajaxUpdateAreas('common-container,/stratperf/control/managementContainerOnly,' + p);
  }, workEffortId);
  // Attende il caricamento del DETTAGLIO. NB: non uso li.back (alla radice è 'back-disabled' e non
  // matcherebbe 'li.back'): uso il contenitore del dettaglio (#main-container-screenlet) e il tab
  // "Dettaglio obiettivo strategico".
  await frame.locator('#main-container-screenlet, #main-container').first().waitFor({ state: 'visible', timeout: 20_000 });
  await frame.getByText('Dettaglio obiettivo strategico', { exact: false }).first()
    .waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {});
}

/**
 * Performance Strategica → Consultazione → "Consuntivazione indicatori" (portale referente Angular).
 * Naviga via menu per href stabile (/c/CTX_BS/consuntivazione).
 */
export async function openConsuntivazione(page: Page): Promise<void> {
  await apriVoceStrategica(page, STRAT_HREF.consuntivazione, async () => {
    await expect(page).toHaveURL(/consuntiv|CTX_BS/i, { timeout: 4_000 });
  });
  await waitNoLoader(page);
}
