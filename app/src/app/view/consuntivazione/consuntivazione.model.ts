// Modello dati del Portale Referente - Consuntivazione (CTX_BS).
// Shape restituito da ConsuntivazioneService.albero() (oggi mock, poi endpoint BE
// GET consuntivazione/albero) e trasformato in PrimeNG TreeNode dal componente.

// 'A/B*100' = rapporto (ΣA/ΣB×100); '(A-B)/B*100' = variazione %; 'SUM(A)' = somma conteggi (ΣA);
// 'SI_NO' = esito; 'DIRETTO' (o null/altro) = valore singolo.
export type TipoIndicatore = 'A/B*100' | '(A-B)/B*100' | 'SUM(A)' | 'SI_NO' | 'DIRETTO';

// Definizione di un parametro da inserire (per gli indicatori num/den).
// ruolo: 'A' = numeratore, 'B' = denominatore. etichetta = formula "parlante".
export interface ParametroDef {
  parId: string;        // gl_fiscal_type PAR_<COD>_<seq>
  etichetta: string;    // gl_fiscal_type.description
  ruolo: string;        // 'A' | 'B'
  valoreCorrente?: number; // movimento gia' salvato (null in v1)
}

// Una UO (scheda) che usa l'indicatore: qui il referente inserisce i valori del periodo.
export interface UoConsuntivo {
  workEffortId: string;
  uo: string;           // nome UO / scheda
  peso: number;         // kpi_score_weight
  orgUnitId?: string;   // work_effort.org_unit_id
  statoScheda?: string; // work_effort.current_status_id (WEORCARD_*)
  periodo?: string;     // work_effort_measure.period_type_id (tipo)
  anno?: number;        // anno del ciclo (da estimated_completion_date)
  valoreActual?: number; // ACTUAL gia' inserito (read-back)
  punteggio?: number;    // punteggio gia' calcolato (null in v1)
  valoriParametri?: { [parId: string]: number }; // valori PAR_* gia' salvati (read-back)
}

// Un indicatore di cui il referente e' in carico (WEM_IND_IN_CHARGE della sua UOC).
export interface IndicatoreConsuntivo {
  glAccountId?: string;
  codice: string;       // gl_account.account_code (es. S05)
  nome: string;         // gl_account.account_name
  tipo: TipoIndicatore; // gl_account.calc_custom_method_id
  fonte?: string;       // gl_account.source
  area?: string;        // gl_resource_type.description
  descrizione?: string; // gl_account.description (estesa)
  parametri: ParametroDef[]; // definizione input (num/den); vuoto per SI_NO / DIRETTO
  uo: UoConsuntivo[];        // UO/schede dove l'indicatore e' assegnato
}
