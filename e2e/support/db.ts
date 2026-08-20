import { Client } from 'pg';

/**
 * Accesso DB (Postgres) per test DINAMICI: le spec trovano a runtime — con ORDER BY random(), quindi
 * DIVERSI ad ogni esecuzione — sia la SCHEDA CTX_BS nello stato giusto, sia l'ATTORE (direttore/referente)
 * DERIVATO dalla scheda/dai gruppi. Nessun utente hard-coded. Tutte le password sono 'ofbiz'.
 * Config via .env (default: cardarelli @ localhost).
 */
function newClient(): Client {
  return new Client({
    host: process.env.E2E_DB_HOST || 'localhost',
    port: Number(process.env.E2E_DB_PORT || 5432),
    database: process.env.E2E_DB_NAME || 'cardarelli',
    user: process.env.E2E_DB_USER || 'postgres',
    password: process.env.E2E_DB_PASS || 'postgres',
  });
}

export async function withDb<T>(fn: (c: Client) => Promise<T>): Promise<T> {
  const c = newClient();
  await c.connect();
  try {
    return await fn(c);
  } finally {
    await c.end();
  }
}

export interface SchedaBs {
  workEffortId: string;
  nome: string;
  statoCorrente: string;
  orgUnitId: string;
  anno: number | null;
}
export interface SchedaConDir extends SchedaBs {
  /**
   * userLoginId del Direttore UO responsabile della scheda. DEVE essere il DIRETTORE_UOC (relazione
   * DIRETTORE_UOC/ORG_RESPONSIBLE): lo scoping legacy della Definizione (executePerformFindBSWorkEffortRoot.groovy,
   * riga 53) filtra ESATTAMENTE roleTypeIdTo='DIRETTORE_UOC' — un semplice ORG_RESPONSIBLE con ruolo diverso
   * (es. DIRETTORE_UOSD) verrebbe messo in STRATPERF_DIR_UO da POST_IMPORT ma vedrebbe 0 schede (orgUnitId='__NONE__').
   */
  dirUserLoginId: string;
}

export interface FiltroScheda {
  stato?: string;
  /** true = pregresso 2025 (anno <= 2025); false = NON pregresso (data null o anno >= 2026). */
  pregresso?: boolean;
}

/** Costruisce le clausole comuni (stato + pregresso) accodando i parametri. */
function clausole(f: FiltroScheda, params: any[]): string[] {
  const w: string[] = [`we.work_effort_type_id = 'CTX_BS'`];
  if (f.stato) { params.push(f.stato); w.push(`we.current_status_id = $${params.length}`); }
  if (f.pregresso === true) {
    w.push(`we.estimated_completion_date IS NOT NULL AND EXTRACT(YEAR FROM we.estimated_completion_date) <= 2025`);
  } else if (f.pregresso === false) {
    w.push(`(we.estimated_completion_date IS NULL OR EXTRACT(YEAR FROM we.estimated_completion_date) >= 2026)`);
  }
  return w;
}

function mapScheda(row: any): SchedaBs {
  return {
    workEffortId: row.work_effort_id,
    nome: row.work_effort_name,
    statoCorrente: row.current_status_id,
    orgUnitId: row.org_unit_id,
    anno: row.anno,
  };
}

/** Una scheda CTX_BS a caso (per il Dir San/Amm, che vede tutte). */
export async function findScheda(f: FiltroScheda = {}): Promise<SchedaBs | null> {
  return withDb(async (c) => {
    const params: any[] = [];
    const sql = `
      SELECT we.work_effort_id, we.work_effort_name, we.current_status_id, we.org_unit_id,
             EXTRACT(YEAR FROM we.estimated_completion_date)::int AS anno
      FROM work_effort we
      WHERE ${clausole(f, params).join(' AND ')}
      ORDER BY random() LIMIT 1`;
    const r = await c.query(sql, params);
    return r.rowCount ? mapScheda(r.rows[0]) : null;
  });
}

/**
 * Una scheda CTX_BS a caso INSIEME al suo Direttore UO (l'ORG_RESPONSIBLE della UO, nel gruppo
 * STRATPERF_DIR_UO). Attore derivato dalla scheda -> diverso ad ogni run. null se non esiste.
 */
export async function findSchedaConDirUO(f: FiltroScheda = {}): Promise<SchedaConDir | null> {
  return withDb(async (c) => {
    const params: any[] = [];
    const sql = `
      SELECT we.work_effort_id, we.work_effort_name, we.current_status_id, we.org_unit_id,
             EXTRACT(YEAR FROM we.estimated_completion_date)::int AS anno,
             ul.user_login_id AS dir_user
      FROM work_effort we
      JOIN party_relationship pr ON pr.party_id_from = we.org_unit_id
        AND pr.party_relationship_type_id = 'ORG_RESPONSIBLE'
        AND pr.role_type_id_to = 'DIRETTORE_UOC'   -- come lo scoping legacy (Definizione): solo il DIRETTORE_UOC vede la scheda
        AND (pr.thru_date IS NULL OR pr.thru_date > now())
      JOIN user_login ul ON ul.party_id = pr.party_id_to
      JOIN user_login_security_group g ON g.user_login_id = ul.user_login_id
        AND g.group_id = 'STRATPERF_DIR_UO' AND (g.thru_date IS NULL OR g.thru_date > now())
      WHERE ${clausole(f, params).join(' AND ')}
      ORDER BY random() LIMIT 1`;
    const r = await c.query(sql, params);
    if (!r.rowCount) return null;
    return { ...mapScheda(r.rows[0]), dirUserLoginId: r.rows[0].dir_user };
  });
}

/**
 * Un VALUTATORE individuale (gruppo EMPLPERF_VALUTATORE) SENZA alcun profilo Performance Strategica
 * (nessun gruppo STRATPERF_*): ha un portale/menu ma NON deve vedere la voce "Performance Strategica".
 * Derivato a caso dal DB (diverso ad ogni run). null se non esiste.
 */
export async function findUtenteSenzaProfiloStrategica(): Promise<string | null> {
  return withDb(async (c) => {
    const sql = `
      SELECT user_login_id FROM (
        SELECT DISTINCT ul.user_login_id
        FROM user_login_security_group g
        JOIN user_login ul ON ul.user_login_id = g.user_login_id AND ul.enabled = 'Y'
        WHERE g.group_id = 'EMPLPERF_VALUTATORE' AND (g.thru_date IS NULL OR g.thru_date > now())
          AND ul.user_login_id NOT IN (
            SELECT user_login_id FROM user_login_security_group
            WHERE group_id LIKE 'STRATPERF\\_%' AND (thru_date IS NULL OR thru_date > now())
          )
      ) t
      ORDER BY random() LIMIT 1`;
    const r = await c.query(sql);
    return r.rowCount ? r.rows[0].user_login_id : null;
  });
}

/** Un utente a caso appartenente a uno dei gruppi indicati (es. Dir San/Amm, Referente). */
export async function findUtenteInGruppi(groups: string[]): Promise<string | null> {
  return withDb(async (c) => {
    // NB: con DISTINCT non si può ORDER BY random() (espressione fuori select list) -> subquery.
    const sql = `
      SELECT user_login_id FROM (
        SELECT DISTINCT ul.user_login_id
        FROM user_login_security_group g
        JOIN user_login ul ON ul.user_login_id = g.user_login_id
        WHERE g.group_id = ANY($1) AND (g.thru_date IS NULL OR g.thru_date > now())
      ) t
      ORDER BY random() LIMIT 1`;
    const r = await c.query(sql, [groups]);
    return r.rowCount ? r.rows[0].user_login_id : null;
  });
}

export async function getStatoScheda(workEffortId: string): Promise<string | null> {
  return withDb(async (c) => {
    const r = await c.query('SELECT current_status_id FROM work_effort WHERE work_effort_id = $1', [workEffortId]);
    return r.rowCount ? r.rows[0].current_status_id : null;
  });
}

/** Ripristina lo stato di una scheda (per rendere i test ripetibili dopo una transizione). */
export async function setStatoScheda(workEffortId: string, stato: string): Promise<void> {
  await withDb(async (c) => {
    await c.query(
      'UPDATE work_effort SET current_status_id = $1, last_updated_stamp = now() WHERE work_effort_id = $2',
      [stato, workEffortId]);
  });
}
