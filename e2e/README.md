# E2E Playwright — Performance Strategica CTX_BS

Test end-to-end (Microsoft Edge) del portale AORN Cardarelli. Progetto **self-contained**
(non tocca la build Angular).

## Prerequisiti
- Ambiente in esecuzione: **FE :4200**, **legacy :8080**, **BE :8081**, DB `cardarelli`.
- Microsoft Edge installato (i test usano `channel: 'msedge'`).

## Setup
```bash
cd workspace/gzoom2-fe/e2e
npm install
npx playwright install msedge   # solo se Edge non è già usabile da Playwright
cp .env.example .env             # poi compila le password (il .env NON si committa)
```

## Esecuzione
```bash
npm test            # headless
npm run test:headed # con browser visibile
npm run report      # apre l'ultimo report HTML
```

## Test presenti
- `tests/visibilita-scheda-init.spec.ts` — **Test #1**: una scheda in stato INIT
  (UOC *Gestione Risorse Umane*, BAA9903) è visibile in **Definizione** solo ai profili giusti:
  `admin` la vede, il **Direttore UO** (rossella.dangelo) **no** (vede solo le proprie TO_VALIDATE).
- `tests/menu-performance-strategica-gating.spec.ts` — **Test #2**: un utente **normale**
  (VALUTATORE della performance individuale, senza profilo Performance Strategica) **non** vede
  la voce di menu «PERFORMANCE STRATEGICA». Controllo positivo: `admin` la vede.
  Richiede `E2E_NOPROF_USER`/`E2E_NOPROF_PASS` in `.env` (altrimenti il caso è `skip`).

## Note
- Selettori della **griglia legacy** (iframe) **verificati sul DOM** (`support/auth.ts`):
  form `#searchForm`, filtro Titolo `#WorkEffortRootViewSearchForm_workEffortName_fld0_value`,
  bottone ricerca `li.search.action-menu-item`. I risultati sono **paginati** (20/pagina): il test
  filtra per Titolo e asserisce sul codice UOC univoco `BAA9903`.
- Le credenziali stanno **solo** in `.env` (mai nel codice/commit).

## Prossimi test (TODO)
- **Test #3**: l'utente normale **non** raggiunge Performance Strategica nemmeno via URL diretto
  (route-guard), non solo via menu (Test #2 copre il menu).
