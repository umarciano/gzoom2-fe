import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { Observable ,  Subject, pipe } from 'rxjs';
import { first, map, merge, mergeMap, switchMap, tap } from 'rxjs/operators';

import { ConfirmDialogModule, ConfirmationService, SpinnerModule, TooltipModule } from 'primeng/primeng';
import {TableModule} from 'primeng/table';


import { SelectItem } from '../../../commons/selectitem';
import { Message } from '../../../commons/message';
import { I18NService } from '../../../i18n/i18n.service';

import { QueryConfig } from '../query-config/query-config';
import { QueryConfigService } from '../../../api/query-config.service';
import { AuthService, UserProfile } from 'app/commons/auth.service';

@Component({
  selector: 'app-query-config-details',
  templateUrl: './query-config-details.component.html',
  styleUrls: ['./query-config-details.component.css']
})
export class QueryConfigDetailsComponent implements OnInit {

  _reload: Subject<void>;
  displayDialog: boolean;
  /** Error message from be*/
  error = '';
  form: FormGroup;
  /** Info message in Toast*/
  msgs: Message[] = [];
  paramForm = {};
  queryConfig: QueryConfig = new QueryConfig();
  selectedQueryConfig: string;
  queryPreview: string;
  user: UserProfile;

  constructor(private readonly confirmationService: ConfirmationService,
    private readonly queryConfigService: QueryConfigService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly i18nService: I18NService,
    private readonly authSrv: AuthService,
    private fb: FormBuilder) {
      this._reload = new Subject<void>();
      this.form = this.fb.group(this.paramForm);
      this.user = authSrv.userProfile();
     }

  ngOnInit() {


    this.route.paramMap.subscribe(paramMap => {
      this.selectedQueryConfig = paramMap.get('id');
      this.error = '';
      this._reload.next();
    });

  const reloadedQueryConfig = this._reload.pipe(switchMap(() => this.queryConfigService.getQueryConfig(this.selectedQueryConfig)));

  const reloadedQueryConfigObs = this.queryConfigService.getQueryConfig(this.selectedQueryConfig)
  .pipe(map(data => data), merge(reloadedQueryConfig))
  .subscribe(data => {
      this.queryConfig = data;
      this.createValidator(this.queryConfig);
    });

  }

  esporta(query: QueryConfig) {
    if (query.queryType === 'E') {
      this.queryConfigService.executeQuery(query).then(() => {
        console.log('query eseguita');
        this.msgs = [{severity:this.i18nService.translate('info'),
        summary:this.i18nService.translate('Query Eseguita'),
        detail:this.i18nService.translate('Query Eseguita con successo ')}];
      }
      ).catch(err => {this.error = err});
    } else {
      this.queryConfigService.updateQuery(query).then(() => {
        console.log('query eseguita');
        this.msgs = [{severity:this.i18nService.translate('info'),
        summary:this.i18nService.translate('Query Eseguita'),
        detail:this.i18nService.translate('Query Eseguita con successo ')}];
      }
      ).catch(err => {this.error = err});
    }
  }

  createValidator(query: QueryConfig) {
    // Form Validator
    if (query) {
      if (query.cond0Name) {
        this.paramForm['cond0Info'] = new FormControl('', Validators.compose([Validators.required, Validators.maxLength(2000)]));
      }
      if (query.cond1Name) {
        this.paramForm['cond1Info'] = new FormControl('', Validators.compose([Validators.required, Validators.maxLength(2000)]));
      }
      if (query.cond2Name) {
        this.paramForm['cond2Info'] = new FormControl('', Validators.compose([Validators.required, Validators.maxLength(2000)]));
      }
      if (query.cond3Name) {
        this.paramForm['cond3Info'] = new FormControl('', Validators.compose([Validators.required, Validators.maxLength(2000)]));
      }
      if (query.cond4Name) {
        this.paramForm['cond4Info'] = new FormControl('', Validators.compose([Validators.required, Validators.maxLength(2000)]));
      }
      if (query.cond5Name) {
        this.paramForm['cond5Info'] = new FormControl('', Validators.compose([Validators.required, Validators.maxLength(2000)]));
      }
      if (query.cond6Name) {
        this.paramForm['cond6Info'] = new FormControl('', Validators.compose([Validators.required, Validators.maxLength(2000)]));
      }
      if (query.cond7Name) {
        this.paramForm['cond7Info'] = new FormControl('', Validators.compose([Validators.required, Validators.maxLength(2000)]));
      }
      if (query.cond8Name) {
        this.paramForm['cond8Info'] = new FormControl('', Validators.compose([Validators.required, Validators.maxLength(2000)]));
      }
    }

    this.form = this.fb.group(this.paramForm);
  }

  showPreview(query: QueryConfig) {
    this.error = '';
    this.displayDialog = true;
    this.queryPreview = query.queryInfo;
    if (query.cond0Info) {
      this.queryPreview = this.queryPreview.replace( /#COND0#/gi, query.cond0Info);
    }
    if (query.cond1Info) {
      this.queryPreview = this.queryPreview.replace( /#COND1#/gi, query.cond1Info);
    }
    if (query.cond2Info) {
      this.queryPreview = this.queryPreview.replace( /#COND2#/gi, query.cond2Info);
    }
    if (query.cond3Info) {
      this.queryPreview = this.queryPreview.replace( /#COND3#/gi, query.cond3Info);
    }
    if (query.cond4Info) {
      this.queryPreview = this.queryPreview.replace( /#COND4#/gi, query.cond4Info);
    }
    if (query.cond5Info) {
      this.queryPreview = this.queryPreview.replace( /#COND5#/gi, query.cond5Info);
    }
    if (query.cond6Info) {
      this.queryPreview = this.queryPreview.replace( /#COND6#/gi, query.cond6Info);
    }
    if (query.cond7Info) {
      this.queryPreview = this.queryPreview.replace( /#COND7#/gi, query.cond7Info);
    }
    if (query.cond8Info) {
      this.queryPreview = this.queryPreview.replace( /#COND8#/gi, query.cond8Info);
    }
    this.queryPreview = this.queryPreview.replace(/#USERID#/gi, this.user.username);

  }
}
