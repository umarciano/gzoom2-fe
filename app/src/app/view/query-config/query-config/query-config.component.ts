import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { Observable ,  Subject } from 'rxjs';
import { first, map, merge, mergeMap } from 'rxjs/operators';

import { ConfirmDialogModule, ConfirmationService, SpinnerModule, TooltipModule } from 'primeng/primeng';

import { SelectItem } from '../../../commons/selectitem';
import { Message } from '../../../commons/message';
import { I18NService } from '../../../i18n/i18n.service';

import { QueryConfig } from './query-config';
import { QueryConfigService } from '../../../api/query-config.service';

/** Convert from queryConfig[] to SelectItem[] */
function queryConfig2SelectItems(types: QueryConfig[]): SelectItem[] {
  return types.map((qc: QueryConfig) => {
    return {label: qc.queryName, value: qc.queryId};
  });
}

@Component({
  selector: 'app-query-config',
  templateUrl: './query-config.component.html',
  styleUrls: ['./query-config.component.css']
})
export class QueryConfigComponent implements OnInit {

  _reload: Subject<void>;
  displayDialog: boolean;
  /** Error message from be*/
  error = '';
  form: FormGroup;
  /** Info message in Toast*/
  msgs: Message[] = [];
  /** whether create or update */
  newQueryConfig: boolean = false;
  /** Row index selected for uomRatingScale*/
  selectedIndex = -1;

  selectedQueryConfig: QueryConfig;

  queryConfig: QueryConfig = new QueryConfig();
  queryConfigs: QueryConfig[];
   /** List of QueryConfig in Select */
  queryConfigSelectItem: SelectItem[] = [];
  queryPreview: string;
  parentTypeId: string;
  queryType: string;
  classSelected: string;

  constructor(private readonly confirmationService: ConfirmationService,
    private readonly queryConfigService: QueryConfigService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly i18nService: I18NService,
    private fb: FormBuilder) {
      this._reload = new Subject<void>();
     }

  ngOnInit() {

    this.route.paramMap.subscribe(paramMap => {
      this.parentTypeId = paramMap.get('parentTypeId');
      this.queryType = paramMap.get('queryType');
    });

    console.log("Query parameter: "+  this.parentTypeId + this.queryType);
    const reloadedQuerys = this._reload.pipe(mergeMap(() => this.queryConfigService.queryConfigs(this.parentTypeId, this.queryType)));

    const queryConfigObs = this.route.data.pipe(
      map((data: { queryConfigs: QueryConfig[] }) => data.queryConfigs),
      merge(reloadedQuerys)
    );

    queryConfigObs.subscribe((data) => {
      this.queryConfigs = data;
    });

  }

  onRowSelect(querys: QueryConfig[], ri: number) {
    const query = querys && querys.length ? querys[0] : null;
    if (query) {
      this.selectedIndex = ri;
      this.classSelected = 'rowSelected';
      this.router.navigate([query.queryId], { relativeTo: this.route });
    } else {
      this.selectedIndex = -1;
      this.classSelected = '';
    }
  }

  closeRow() {
    this.selectedIndex = -1;
    this.classSelected = '';
    if (this.parentTypeId && this.queryType) {
    this.router.navigate([`../queryconfig/${this.parentTypeId}/${this.queryType}`], { relativeTo: this.route.parent });
    } else {
    this.router.navigate(['../queryconfig'], { relativeTo: this.route.parent });
    }
  }

  showDialog(ri: number) {
    this.error = '';
    this.displayDialog = true;
    this.queryConfig = this.queryConfigs[ri];
  }

}
