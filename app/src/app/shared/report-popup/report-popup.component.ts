import { Component, OnInit, ViewChild} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { I18NService } from '../../i18n/i18n.service';
import { AuthService } from '../../commons/service/auth.service';
import { lastValueFrom, Subject } from 'rxjs';
import { map, mergeWith, switchMap } from 'rxjs/operators';
import { ReportPopupService } from './report-popup.service';
import { Params, Report, ReportParam, ReportType } from '../../view/report-print/report';
import { ApiClientService } from 'app/commons/service/client.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { DownloadActivityService } from '../report-download/download-activity.service';
import { SelectItem } from 'app/commons/model/selectitem';
import { UserPreferenceService } from 'app/api/service/user-preference.service';
import * as moment from 'moment';
import { ReloadParams } from 'app/view/report-print/report/report.component';

import { CustomTimePeriodService } from 'app/commons/service/custom-time-period.service';
import { CustomTimePeriod } from 'app/api/model/customTimePeriod';
import { ReportService } from 'app/api/service/report.service';


@Component({
  selector: 'app-report-popup',
  templateUrl: './report-popup.component.html'/*,
styleUrls: ['./report-popup.component.css']*/
})
export class ReportpopupComponent implements OnInit {
  _reload: Subject<ReloadParams>;
  displayDialog: boolean;
  pollingData: any;
  isPolling: boolean;
  token: string;
  error: string;
  /** List of Report */
  reports: Report[];
  params: ReportParam[];

  paramsValue: any = {};
  paramsSelectItem: any = {};
  paramsOptions: any = {};
  paramsLabel: any = {};

  form: FormGroup;
  runElement = [];
  activities: Subject<string> = new Subject<string>();

  /** Selected report*/
  selectedReport: Report;
  contentIdContentName: String;
  workEffortId: string;
  outputFormat: ReportType;
  outputFormats: ReportType[];

  languages: string[] = [];
  languagesSelectItem: SelectItem[] = [];
  customTimePeriodSelectItem: SelectItem[] = [];
  languageSelected: string;
  langType: string;

  defaultOrganizationUnitId = 'Company';

  @ViewChild('reportpopup') reportpopup: NgbDropdown;
  monitoringDate: Date;

  constructor(private readonly route: ActivatedRoute,
    private readonly reportPopupService: ReportPopupService,
    private readonly reportService: ReportService,
    private readonly authService: AuthService,
    private fb: FormBuilder,
    private readonly router: Router,
    private readonly client: ApiClientService,
    private readonly  userPreferenceService: UserPreferenceService,
    public readonly i18nService: I18NService,
    private readonly customTimePeriodService: CustomTimePeriodService,
    private readonly downloadActivityService: DownloadActivityService) {
      this._reload = new Subject<ReloadParams>();
      this.token = authService.token();
    }

  ngOnInit() {
    this.reportPopupService.popupObservable.subscribe(res => {
      this.open(res);
    });

    this.userPreferenceService.getUserPreference('ORGANIZATION_PARTY').subscribe(
      data => {
        if (data.userPrefValue && data.userPrefValue !== 'DEFAULT') {
          this.defaultOrganizationUnitId = data.userPrefValue;
        }
      }
    );

    this.langType = this.i18nService.getLanguageType();

    this.client.get('/profile/i18n/languages').pipe(map(
      json => json.results as string[]
     )).subscribe(data => {
      this.languages = data;
      this.languageSelected = data[0];

      this.languagesSelectItem =data.map(
        (p:string) => {
          return {label: this.i18nService.translate(p), value: p};
        });
      console.log("languages available report "+data);
     });

    // Form Validator
    this.form = this.fb.group({
      'reportContentId': new FormControl('')
    });

    console.log('print form before load', this.form);

  }

  open(res: ReportParam) {
    this.displayDialog = true;
    this.reports = null;
    this.selectedReport = null;
    this.params = [];
    this.paramsValue = [];
    this.paramsLabel = [];
    this.paramsOptions = [];

    console.log('open param:', res['workEffortTypeId'], JSON.stringify(res));
    this.workEffortId = res['workEffortId'];
    let monitoringDate = res['monitoringDate'];
    if(monitoringDate) {
      this.monitoringDate = moment(monitoringDate, 'DD/MM/YYYY').toDate();
      
    }

    if (res && res['workEffortTypeId']) {

      const reportService$ = this.reportService.reportsByWorkEffortTypeId(res['workEffortTypeId'])
      return lastValueFrom(reportService$).then(reports => {
        this.reports = reports;
        if (this.reports.length > 0) {
          this.selectedReport = this.reports[0];
          this.onRowSelect(this.selectedReport);
        }
        console.log(`reports`, this.reports); }
      ).catch(err => this.error = err)

      // this.reportService.reportsByWorkEffortTypeId(res['workEffortTypeId'])
      // .toPromise()
      // .then(reports => {
      //   this.reports = reports;
      //   if (this.reports.length > 0) {
      //     this.selectedReport = this.reports[0];
      //     this.onRowSelect(this.selectedReport);
      //   }
      //   console.log(`reports`, this.reports); }
      // ).catch(err => this.error = err)
    }
  }

  print() {
    console.log('print report ');
    this.setDataReport();    
    this.reportService
      .add(this.selectedReport)
      .then((activityId: string) => {
        console.log('activityId ' + activityId);
        this.downloadActivityService.openDownload(activityId);
        this.displayDialog = false;
      })
      .catch((error) => {
        console.log('error.message' , error);
        this.error = this.i18nService.translate(error) || error;
      });
  }

  setDataReport() {
    console.log('setDataReport' + this.selectedReport );
    console.log('dopo selectedReport' + this.selectedReport);
    this.selectedReport.outputFormat = this.outputFormat.mimeTypeId;
    this.selectedReport.workEffortTypeId = this.selectedReport.workEffortTypeId;
    this.selectedReport.birtLocale = this.languageSelected;
    this.selectedReport.defaultOrganizationUnitId = this.defaultOrganizationUnitId;

    // CONVERTO I DATI
    // this.selectedReport.paramsValue = this.paramsValue;
    this.selectedReport.paramsValue  = Object.assign({}, this.paramsValue);
    this.params.forEach((element) => {

      if (element.paramType === 'DATE') {     
        this.paramsValue[element.paramName] = this.monitoringDate;           
        this.selectedReport.paramsValue[element.paramName] = this.reportService.getDate(this.paramsValue[element.paramName]);
      }
    });

    this.selectedReport.paramsValue['workEffortId'] = this.workEffortId;
    this.selectedReport.paramsValue['workEffortIdChild'] = this.workEffortId;
  }

  onRowSelect(data) {
    console.log('report ', data);
    this.selectedReport = data; // data.value;
    this.contentIdContentName = data.reportContentId + '_' + data.contentName + '_' + data.workEffortTypeId;
    if (this.selectedReport) {
      const reportService$ = this.reportService.report(data.parentTypeId, data.reportContentId, data.contentName, data.workEffortTypeId, false)
      return lastValueFrom(reportService$).then(report => {
        this.selectedReport = report;
        this.params = report.params;
        this.outputFormats = report.outputFormats;
        this.outputFormat = report.outputFormats[0];

        this.loadParams();
        this.loadFilterData();
        //console.log('report selected', JSON.stringify(report));
      })
      .catch(err => {
        console.error('Cannot retrieve report', err);
      });




      // this.reportService
      // .report(data.parentTypeId, data.reportContentId, data.contentName, data.workEffortTypeId, false)
      // .toPromise()
      // .then(report => {
      //   this.selectedReport = report;
      //   this.params = report.params;
      //   this.outputFormats = report.outputFormats;
      //   this.outputFormat = report.outputFormats[0];

      //   this.loadParams();
      //   this.loadFilterData();
      //   //console.log('report selected', JSON.stringify(report));
      // })
      // .catch(err => {
      //   console.error('Cannot retrieve report', err);
      // });
    }
  }

  loadParams() {
    let paramForm = {};
    this.params.forEach((element) => {
      // gestione required
      let controller = new FormControl('');
      // Lista di elementi per il caricamento di altre drop List
      if (element.paramName === 'monitoringDate') {
        if (element.mandatory) {
          controller = new FormControl('', Validators.required);
        }
        paramForm[element.paramName] = controller;
        this.paramsValue[element.paramName] = this.monitoringDate;
        
        this.paramsOptions[element.paramName] = element.options;
        this.paramsLabel[element.paramName] = element.label;
      }

      if(element.paramName === 'customTimePeriod') {
        if (element.mandatory)
          controller = new FormControl('', Validators.required);
        paramForm[element.paramName] = controller;
        this.paramsValue[element.paramName] = element.paramDefault;
        this.paramsOptions[element.paramName] = element.options;
        this.paramsLabel[element.paramName] = element.label;
      }

    });
    paramForm['reportContentId'] = new FormControl('');
    this.form = this.fb.group(paramForm);
    console.log('print form after load', this.form);
  }

  loadFilterData() {
    const reloadedCustomTimePeriods =this.customTimePeriodService.customTimePeriods(this.paramsOptions['customTimePeriod']);
    const reloadedCustomTimePeriodsObs = this.route.data.pipe(
      map((data: {customTimePeriod: CustomTimePeriod[]}) => data.customTimePeriod),
      mergeWith(reloadedCustomTimePeriods),
      map(ct => this.customTimePeriodsValues2SelectItems(ct))
    ).subscribe((data) => {
      this.customTimePeriodSelectItem = data;
      this.customTimePeriodSelectItem.push({label: this.i18nService.translate('Select customTimePeriod'), value:null});
      this.paramsSelectItem['customTimePeriodSelectItem'] = this.customTimePeriodSelectItem;
    });

  }

  secondaryLang(): boolean {
    if(this.languages.length > 1 && this.languages[1].indexOf(this.i18nService.getLang()) >= 0) {
      return true;
    }

    return false;
  }

  onChangeAll(value, paramName) {
    console.log('onChangeAll paramName= ' + paramName + ' value=', value);
    if (paramName == 'roleTypeId') {
      this._reload.next({roleTypeId: value});
    } else if (paramName == 'workEffortId') {
      this._reload.next({workEffortId: value});
    } else if (paramName == 'workEffortTypeId20D6') {
      this._reload.next({workEffortTypeId20D6: value});
    } else if (paramName == 'workEffortTypeId20R20P20D') {
      this._reload.next({workEffortTypeId20R20P20D: value});
    } else if (paramName == 'workEffortTypeIdParametric') {
      this._reload.next({workEffortTypeIdParametric: value});
    } else if (paramName == 'workEffortTypeIdParametric2') {
      this._reload.next({workEffortTypeIdParametric2: value});
    } else if (paramName == 'workEffortTypeIdParametric3') {
      this._reload.next({workEffortTypeIdParametric3: value});
    }
  }

  customTimePeriodsValues2SelectItems(customTimePeriod: CustomTimePeriod[]): SelectItem[] {
    if(customTimePeriod == null) {
      return [];
    }
    return customTimePeriod.map((p: CustomTimePeriod) => {
      let label = p.periodName;
      if (this.languages.length > 1 && this.languages[1].indexOf(this.i18nService.getLang()) >= 0) {
        label = p.periodNameLang;
      }
      return {label: label, value: this.reportService.getDate(p.thruDate)};
    });
  }
}
