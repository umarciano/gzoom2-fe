import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from '../../commons/service/client.service';
import { IndicatoreConsuntivo } from '../../view/consuntivazione/consuntivazione.model';

/** Un movimento da salvare (indicatore x scheda, un valore). */
export interface MovimentoConsuntivo {
  workEffortId: string;
  glAccountId: string;
  glFiscalTypeId: string;   // 'ACTUAL' oppure 'PAR_*'
  transValue: number;
}

/**
 * Servizio del Portale Referente - Consuntivazione indicatori (CTX_BS).
 * Lettura + salvataggio passano da gzoom2-be (JWT). Il salvataggio e' poi orchestrato
 * dal BE verso il legacy (login by userId via XML-RPC + saveIndicatorConsuntivo) - vedi doc 13.
 */
@Injectable()
export class ConsuntivazioneService {

  constructor(private client: ApiClientService) { }

  /** Albero degli indicatori da consuntivare per l'utente loggato (referente). */
  albero(context: string): Observable<IndicatoreConsuntivo[]> {
    return this.client
      .get(`consuntivazione/albero?context=${context}`)
      .pipe(map(json => json.results as IndicatoreConsuntivo[]));
  }

  /** Salva i movimenti consuntivi (POST verso gzoom2-be, JWT automatico). */
  salvaValori(movimenti: MovimentoConsuntivo[]): Observable<any> {
    return this.client.post('consuntivazione/valori', JSON.stringify(movimenti));
  }
}
