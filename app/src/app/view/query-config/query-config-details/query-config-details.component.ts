import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { Subject } from 'rxjs';
import { map, mergeWith, switchMap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';

import { Message } from '../../../commons/model/message';
import { I18NService } from '../../../i18n/i18n.service';

import { QueryConfig } from '../query-config/query-config';
import { QueryConfigService } from '../../../api/service/query-config.service';
import { AuthService, UserProfile } from 'app/commons/service/auth.service';

@Component({
  selector: 'app-query-config-details',
  templateUrl: './query-config-details.component.html',
  styleUrls: ['./query-config-details.component.css'],
  providers: [MessageService]
})
export class QueryConfigDetailsComponent implements OnInit {

  _reload: Subject<void>;
  displayDialog: boolean;
  /** Error message from be*/
  error = '';
  form: FormGroup;
  /** Info message in Toast*/
  msgs: Message;
  paramForm = {};
  queryConfig: QueryConfig = new QueryConfig();
  selectedQueryConfig: string;
  queryPreview: string;
  user: UserProfile;
  success = false;
  showSpinner = false;
  showValueProgressBar: boolean = true;

  constructor(private readonly confirmationService: ConfirmationService,
    private readonly queryConfigService: QueryConfigService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly i18nService: I18NService,
    private readonly authSrv: AuthService,
    private readonly messageService: MessageService,
    private fb: FormBuilder) {
    this._reload = new Subject<void>();
    this.form = this.fb.group(this.paramForm);
    this.user = authSrv.userProfile();
  }

  ngOnInit() {


    this.queryConfig = null;
    this.route.paramMap.subscribe(paramMap => {
      this.selectedQueryConfig = paramMap.get('id');
      this.error = '';
      this.success = false;
      this._reload.next();
    });

    this.form = this.fb.group({});

    const reloadedQueryConfig = this._reload.pipe(switchMap(() => this.queryConfigService.getQueryConfig(this.selectedQueryConfig)));

    const reloadedQueryConfigObs = this.queryConfigService.getQueryConfig(this.selectedQueryConfig)
      .pipe(map(data => data), mergeWith(reloadedQueryConfig))
      .subscribe(data => {
        this.queryConfig = data;
        this.createValidator(this.queryConfig);

      });
  }

  esporta(query: QueryConfig) {
    if (!this.showValueProgressBar) {


      query = Object.assign(query, this.form.value);
      this.showSpinner = true;
      if (query.queryType === 'E') {
        this.queryConfigService.executeQuery(query).then(() => {
          console.log('query eseguita');
          this.messageService.add({ key: 'toastGeneral', severity: 'success', summary: this.i18nService.translate('Query Eseguita'), detail: this.i18nService.translate('Query Eseguita con successo ') });
          this.msgs = {
            severity: this.i18nService.translate('success'),
            summary: this.i18nService.translate('Esecuzione Query ' + query.queryCode),
            detail: this.i18nService.translate('Query Eseguita con successo ')
          };
          this.showSpinner = false;
          this.messageService.add(this.msgs);
        }
        ).catch(err => { this.error = err; this.showSpinner = false; });
      } else if (query.queryType === 'A') {
        this.queryConfigService.updateQuery(query).then(() => {
          console.log('query eseguita');
          this.msgs = {
            severity: this.i18nService.translate('success'),
            summary: this.i18nService.translate('Esecuzione Query ' + query.queryCode),
            detail: this.i18nService.translate('Query Eseguita con successo ')
          };
          this.success = true;
          this.showSpinner = false;
          this.messageService.add(this.msgs);
        }
        ).catch(err => { this.error = err; this.showSpinner = false; });
      }
    }
    this.createValidator(this.queryConfig);
  }

  createValidator(query: QueryConfig) {

    //Reset Validator
    this.paramForm = {};
    this.form = this.fb.group(this.paramForm);

    // Form Validator
    if (query) {
      if (query.cond0Name) {
        this.paramForm['cond0Info'] = new FormControl(query.cond0Info, Validators.compose([Validators.required, Validators.maxLength(2000)]));
      }
      if (query.cond1Name) {
        this.paramForm['cond1Info'] = new FormControl(query.cond1Info, Validators.compose([Validators.required, Validators.maxLength(2000)]));
      }
      if (query.cond2Name) {
        this.paramForm['cond2Info'] = new FormControl(query.cond2Info, Validators.compose([Validators.required, Validators.maxLength(2000)]));
      }
      if (query.cond3Name) {
        this.paramForm['cond3Info'] = new FormControl(query.cond3Info, Validators.compose([Validators.required, Validators.maxLength(2000)]));
      }
      if (query.cond4Name) {
        this.paramForm['cond4Info'] = new FormControl(query.cond4Info, Validators.compose([Validators.required, Validators.maxLength(2000)]));
      }
      if (query.cond5Name) {
        this.paramForm['cond5Info'] = new FormControl(query.cond5Info, Validators.compose([Validators.required, Validators.maxLength(2000)]));
      }
      if (query.cond6Name) {
        this.paramForm['cond6Info'] = new FormControl(query.cond6Info, Validators.compose([Validators.required, Validators.maxLength(2000)]));
      }
      if (query.cond7Name) {
        this.paramForm['cond7Info'] = new FormControl(query.cond7Info, Validators.compose([Validators.required, Validators.maxLength(2000)]));
      }
    }

    this.form = this.fb.group(this.paramForm);
    setTimeout(() => {this.showValueProgressBar = false;}, 1000);
    
  }

  showPreview(query: QueryConfig) {
    query = Object.assign(query, this.form.value);
    this.error = '';
    this.displayDialog = true;
    this.queryPreview = query.queryInfo;
    if (query.cond0Info) {
      this.queryPreview = this.queryPreview.replace(/#COND0#/gi, query.cond0Info);
    }
    if (query.cond1Info) {
      this.queryPreview = this.queryPreview.replace(/#COND1#/gi, query.cond1Info);
    }
    if (query.cond2Info) {
      this.queryPreview = this.queryPreview.replace(/#COND2#/gi, query.cond2Info);
    }
    if (query.cond3Info) {
      this.queryPreview = this.queryPreview.replace(/#COND3#/gi, query.cond3Info);
    }
    if (query.cond4Info) {
      this.queryPreview = this.queryPreview.replace(/#COND4#/gi, query.cond4Info);
    }
    if (query.cond5Info) {
      this.queryPreview = this.queryPreview.replace(/#COND5#/gi, query.cond5Info);
    }
    if (query.cond6Info) {
      this.queryPreview = this.queryPreview.replace(/#COND6#/gi, query.cond6Info);
    }
    if (query.cond7Info) {
      this.queryPreview = this.queryPreview.replace(/#COND7#/gi, query.cond7Info);
    }
    this.queryPreview = this.queryPreview.replace(/#USERID#/gi, this.user.username);

  }
}
