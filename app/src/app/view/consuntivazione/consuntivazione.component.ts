import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

import { ConsuntivazioneService, MovimentoConsuntivo } from '../../api/service/consuntivazione.service';
import { IndicatoreConsuntivo, TipoIndicatore, UoConsuntivo } from './consuntivazione.model';

interface ParametroRiga {
  parId?: string; etichetta: string; ruolo?: string; tipoInput: 'num' | 'sino'; value: any;
}
interface UoRow {
  uo: string; peso: number; workEffortId: string; glAccountId: string; anno?: number;
  tipo: TipoIndicatore; fonte?: string; area?: string; descrizione?: string; codice: string;
  params: ParametroRiga[]; expanded: boolean; salvataggio?: boolean;
}
interface IndRow {
  codice: string; nome: string; glAccountId: string; tipo: TipoIndicatore; fonte?: string; area?: string; descrizione?: string;
  uo: UoRow[]; expanded: boolean;
}
type Stato = 'NON_INIZIATO' | 'INCOMPLETO' | 'COMPLETATO';

/**
 * Portale Referente - Consuntivazione (CTX_BS).
 * Gerarchia: Indicatore -> (espandi) -> UO -> (clic UO) -> Tipo/Valori/Fonte/Periodo.
 * Un indicatore puo' essere assegnato a PIU' UO.
 */
@Component({
  selector: 'app-consuntivazione',
  templateUrl: './consuntivazione.component.html',
  providers: [MessageService],
  styles: [`
    :host { font-family: "Trebuchet MS", Tahoma, Arial, sans-serif; color:#2b3240; display:block; }
    :host h1,:host h2,:host h3,:host h4,:host h5,:host span,:host small,:host label,:host button { font-family: inherit; }

    :host ::ng-deep .p-inputtext:enabled:focus,
    :host ::ng-deep button:focus { box-shadow:none !important; outline:none !important; }
    :host ::ng-deep .p-inputtext:enabled:focus { border-color:#8fa4d8; }

    .head { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:.6rem; }
    .head h4 { margin:0 0 .25rem 0; font-size:1.55rem; }
    .head .sub { color:#7a828e; }

    .tabs { display:flex; gap:.5rem; margin:1rem 0; }
    .tab { border:1px solid #e2e6ec; background:#fff; border-radius:8px; padding:.4rem .9rem; cursor:pointer; color:#4a515c; }
    .tab.active { border-color:#2b6cff; color:#2b6cff; background:#f4f8ff; font-weight:600; }

    .box { border:1px solid #e7eaf0; border-radius:12px; overflow:hidden; }

    /* riga indicatore */
    .ind-head { display:flex; align-items:center; gap:.65rem; padding:1rem; cursor:pointer; border-bottom:1px solid #f0f2f6; }
    .ind-head:hover { background:#fcfdff; }
    .ind-head .cod { font-weight:700; }
    .ind-head .nome { color:#5b6472; font-size:.9rem; }
    .ind-head .right { margin-left:auto; display:flex; align-items:center; gap:1rem; }
    .uo-count { color:#7a828e; font-size:.85rem; }

    .chev { border:none; background:none; cursor:pointer; color:#2b6cff; padding:0; width:1rem; }
    .sem { font-size:.7rem; }
    .sem.COMPLETATO{color:#2e9e4f;} .sem.INCOMPLETO{color:#e0a800;} .sem.NON_INIZIATO{color:#c1c6cf;}

    /* elenco UO sotto un indicatore */
    .uo-wrap { background:#fbfcfe; padding:.25rem .5rem .6rem 2.4rem; border-bottom:1px solid #f0f2f6; }
    .uo-head { display:flex; align-items:center; gap:.6rem; padding:.6rem .5rem; cursor:pointer; border-bottom:1px dashed #eceff4; }
    .uo-head:hover { background:#f4f7fc; border-radius:6px; }
    .uo-head .bld { color:#3a4a63; }
    .peso-tag{ background:#eef1f4; border-radius:10px; padding:1px 8px; font-size:.78rem; color:#5b6472; }
    .uo-head .right { margin-left:auto; }

    .stato{ display:inline-flex; align-items:center; gap:.4rem; font-size:.9rem; }
    .stato.COMPLETATO{color:#2e9e4f;} .stato.INCOMPLETO{color:#c99400;} .stato.NON_INIZIATO{color:#9aa0a6;}

    /* dettaglio UO (solo dopo clic) */
    .uo-detail { padding:.8rem 1rem 1rem 2rem; display:flex; flex-direction:column; gap:.8rem; }
    .row-flex { display:flex; align-items:center; gap:1rem; flex-wrap:wrap; }
    .badge{ display:inline-block; border-radius:6px; padding:2px 8px; font-size:.8rem; font-weight:600; }
    .badge.sino{ background:#e6f4ea; color:#2e7d32; } .badge.perc{ background:#e7edfb; color:#3b5bdb; } .badge.dir{ background:#f0eefb; color:#6a4bd0; }
    .tipo-sub{ color:#7a828e; font-size:.82rem; }
    .param{ display:flex; align-items:center; gap:.6rem; margin:.2rem 0; }
    .param .lbl{ color:#4a515c; font-size:.9rem; min-width:20rem; }
    .param input{ width:7rem; text-align:right; }
    .seg{ display:inline-flex; border:1px solid #d8dee7; border-radius:8px; overflow:hidden; }
    .seg button{ background:#fff; border:none; padding:.45rem 1.4rem; cursor:pointer; color:#4a515c; }
    .seg button + button{ border-left:1px solid #d8dee7; }
    .seg button.on-si{ background:#e6f4ea; color:#2e7d32; font-weight:700; }
    .seg button.on-no{ background:#fdecec; color:#c0392b; font-weight:700; }
    .risultato{ background:#f5f7fa; border-radius:8px; padding:.4rem .9rem; text-align:center; }
    .risultato .lab{ color:#8a919c; font-size:.72rem; } .risultato .num{ color:#2b6cff; font-weight:700; }
    .meta{ color:#5b6472; font-size:.85rem; } .meta b{ color:#3a4a63; }
  `]
})
export class ConsuntivazioneComponent implements OnInit {

  context: string;
  loading = false;
  indicatori: IndRow[] = [];
  filtro: 'TUTTI' | 'DA_COMPLETARE' | 'COMPLETATI' = 'TUTTI';

  constructor(
    private route: ActivatedRoute,
    private service: ConsuntivazioneService,
    private messages: MessageService
  ) { }

  ngOnInit(): void {
    this.context = this.route.snapshot.paramMap.get('context') || 'CTX_BS';
    this.load();
  }

  load(): void {
    this.loading = true;
    this.service.albero(this.context).subscribe({
      next: (data) => { this.indicatori = this.build(data); this.loading = false; },
      error: (err) => { this.loading = false; console.error(err);
        this.messages.add({ severity: 'error', summary: 'Errore', detail: 'Caricamento indicatori fallito' }); }
    });
  }

  private build(data: IndicatoreConsuntivo[]): IndRow[] {
    return (data || []).map(ind => ({
      codice: ind.codice, nome: ind.nome, glAccountId: ind.glAccountId, tipo: ind.tipo, fonte: ind.fonte,
      area: ind.area, descrizione: ind.descrizione, expanded: false,
      uo: (ind.uo || []).map(u => ({
        uo: u.uo, peso: u.peso, workEffortId: u.workEffortId, glAccountId: ind.glAccountId, anno: u.anno,
        tipo: ind.tipo, fonte: ind.fonte, area: ind.area, descrizione: ind.descrizione, codice: ind.codice,
        params: this.buildParams(ind, u), expanded: false
      }))
    }));
  }

  /** Costruisce i parametri della UO, pre-compilando dai valori gia' salvati (read-back). */
  private buildParams(ind: IndicatoreConsuntivo, u: UoConsuntivo): ParametroRiga[] {
    const vp = u.valoriParametri || {};
    if (ind.tipo === 'SI_NO') {
      const v = u.valoreActual;
      return [{ etichetta: 'Esito', tipoInput: 'sino', value: v === 100 ? 'SI' : (v === 0 ? 'NO' : null) }];
    }
    // Qualsiasi tipo con parametri definiti (A/B*100, (A-B)/B*100, SUM(A)): una casella per parametro.
    if (ind.parametri && ind.parametri.length) return ind.parametri
      .map(p => ({ parId: p.parId, etichetta: p.etichetta, ruolo: p.ruolo, tipoInput: 'num' as const,
        value: (p.parId && vp[p.parId] != null) ? vp[p.parId] : null }));
    // Valore diretto: una sola casella, pre-compilata dall'ACTUAL.
    return [{ etichetta: 'Valore', tipoInput: 'num', value: (u.valoreActual != null ? u.valoreActual : null) }];
  }

  // ---- stato / calcoli ----
  private compilato(p: ParametroRiga): boolean { return p.value !== null && p.value !== undefined && p.value !== ''; }

  statoUo(u: UoRow): Stato {
    const c = u.params.filter(p => this.compilato(p)).length;
    if (c === 0) return 'NON_INIZIATO';
    return c < u.params.length ? 'INCOMPLETO' : 'COMPLETATO';
  }
  statoInd(ind: IndRow): Stato {
    const stati = ind.uo.map(u => this.statoUo(u));
    if (stati.every(s => s === 'COMPLETATO') && stati.length > 0) return 'COMPLETATO';
    if (stati.every(s => s === 'NON_INIZIATO')) return 'NON_INIZIATO';
    return 'INCOMPLETO';
  }
  statoLabel(s: Stato): string { return { NON_INIZIATO: 'Non iniziato', INCOMPLETO: 'Incompleto', COMPLETATO: 'Completato' }[s]; }

  /** Somma i valori compilati di un dato ruolo (A/B "sommabili"). */
  private sumRole(u: UoRow, ruolo: string): number | null {
    const ps = u.params.filter(p => p.ruolo === ruolo && this.compilato(p));
    return ps.length ? ps.reduce((s, p) => s + Number(p.value), 0) : null;
  }
  private isPerc(t: TipoIndicatore): boolean { return t === 'A/B*100' || t === '(A-B)/B*100' || t === 'SI_NO'; }

  risultato(u: UoRow): string | null {
    const n = this.actualNumerico(u);
    if (n === null) return null;
    if (this.isPerc(u.tipo)) return (Number.isInteger(n) ? String(n) : n.toFixed(2)) + ' %';
    return String(n);
  }

  tipoBadge(t: TipoIndicatore): string {
    switch (t) {
      case 'SI_NO': return 'Sì / No';
      case 'A/B*100': return 'Percentuale';
      case '(A-B)/B*100': return 'Variazione %';
      case 'SUM(A)': return 'Conteggio';
      default: return 'Valore';
    }
  }
  tipoClass(t: TipoIndicatore): string { return t === 'SI_NO' ? 'sino' : (this.isPerc(t) ? 'perc' : 'dir'); }
  tipoSub(t: TipoIndicatore): string {
    switch (t) {
      case 'SI_NO': return 'Esito';
      case 'A/B*100': return 'Numeratore / Denominatore';
      case '(A-B)/B*100': return 'Variazione: (valore anno − base) / base × 100';
      case 'SUM(A)': return 'Somma dei conteggi';
      default: return '';
    }
  }
  ruoloLabel(u: UoRow, p: ParametroRiga): string {
    if (u.tipo === 'A/B*100') return p.ruolo === 'A' ? 'numeratore' : (p.ruolo === 'B' ? 'denominatore' : '');
    if (u.tipo === '(A-B)/B*100') return p.ruolo === 'A' ? 'valore anno' : (p.ruolo === 'B' ? 'base (anno prec.)' : '');
    return '';
  }
  setSino(u: UoRow, val: string): void { u.params[0].value = val; }

  espandiTutti(): void { this.indicatori.forEach(i => i.expanded = true); }
  riduciTutti(): void { this.indicatori.forEach(i => { i.expanded = false; i.uo.forEach(u => u.expanded = false); }); }

  // ---- filtro / contatori (a livello indicatore) ----
  get filtered(): IndRow[] {
    if (this.filtro === 'DA_COMPLETARE') return this.indicatori.filter(i => this.statoInd(i) !== 'COMPLETATO');
    if (this.filtro === 'COMPLETATI') return this.indicatori.filter(i => this.statoInd(i) === 'COMPLETATO');
    return this.indicatori;
  }
  get nTutti(): number { return this.indicatori.length; }
  get nDaCompletare(): number { return this.indicatori.filter(i => this.statoInd(i) !== 'COMPLETATO').length; }
  get nCompletati(): number { return this.indicatori.filter(i => this.statoInd(i) === 'COMPLETATO').length; }

  // ---- salvataggio ----
  /**
   * Valore ACTUAL numerico per la UO secondo la tipologia:
   *  - SI_NO: 100/0;
   *  - A/B*100: (ΣA/ΣB)×100;  - (A-B)/B*100: ((ΣA−ΣB)/ΣB)×100 (variazione);
   *  - SUM(A): Σ di tutti i parametri;  - diretto: il valore singolo.
   * Per i tipi con parametri richiede che siano TUTTI compilati.
   */
  private actualNumerico(u: UoRow): number | null {
    if (u.tipo === 'SI_NO') { const v = u.params[0].value; return v === 'SI' ? 100 : (v === 'NO' ? 0 : null); }
    if (!u.params.length || !u.params.every(p => this.compilato(p))) return null;
    if (u.tipo === 'A/B*100' || u.tipo === '(A-B)/B*100') {
      const a = this.sumRole(u, 'A'); const b = this.sumRole(u, 'B');
      if (a === null || b === null || Number(b) === 0) return null;
      const val = u.tipo === 'A/B*100' ? (a / b * 100) : ((a - b) / b * 100);
      return Math.round(val * 100) / 100;
    }
    if (u.tipo === 'SUM(A)') return u.params.reduce((s, p) => s + Number(p.value), 0);
    return Number(u.params[0].value); // valore diretto
  }

  /** Movimenti da salvare per la UO: PAR_* (parametri, audit) + ACTUAL (risultato). */
  private movimentiDi(u: UoRow): MovimentoConsuntivo[] {
    const base = { workEffortId: u.workEffortId, glAccountId: u.glAccountId };
    const out: MovimentoConsuntivo[] = [];
    u.params.forEach(p => {
      if (p.parId && this.compilato(p)) out.push({ ...base, glFiscalTypeId: p.parId, transValue: Number(p.value) });
    });
    const act = this.actualNumerico(u);
    if (act !== null) out.push({ ...base, glFiscalTypeId: 'ACTUAL', transValue: act });
    return out;
  }

  salvaUo(u: UoRow): void {
    const movimenti = this.movimentiDi(u);
    if (!movimenti.length) {
      this.messages.add({ severity: 'warn', summary: `${u.codice} · ${u.uo}`, detail: 'Nessun valore da salvare' });
      return;
    }
    u.salvataggio = true;
    this.service.salvaValori(movimenti).subscribe({
      next: () => { u.salvataggio = false;
        this.messages.add({ severity: 'success', summary: `${u.codice} · ${u.uo}`, detail: `Salvati ${movimenti.length} movimenti` }); },
      error: (e) => { u.salvataggio = false; console.error(e);
        this.messages.add({ severity: 'error', summary: `${u.codice} · ${u.uo}`, detail: 'Errore nel salvataggio' }); }
    });
  }

  salvaTutti(): void {
    const movimenti: MovimentoConsuntivo[] = [];
    this.indicatori.forEach(i => i.uo.forEach(u => this.movimentiDi(u).forEach(m => movimenti.push(m))));
    if (!movimenti.length) {
      this.messages.add({ severity: 'warn', summary: 'Salva tutti', detail: 'Nessun valore da salvare' });
      return;
    }
    this.service.salvaValori(movimenti).subscribe({
      next: () => this.messages.add({ severity: 'success', summary: 'Salva tutti', detail: `Salvati ${movimenti.length} movimenti` }),
      error: (e) => { console.error(e); this.messages.add({ severity: 'error', summary: 'Salva tutti', detail: 'Errore nel salvataggio' }); }
    });
  }
}
