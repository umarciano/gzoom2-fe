import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder, SelectMultipleControlValueAccessor } from '@angular/forms';


import { Subject } from 'rxjs';
import { map, merge, switchMap } from 'rxjs/operators';
import * as moment from 'moment';

import { SelectItem } from '../../../commons/selectitem';
import { I18NService } from '../../../i18n/i18n.service';
import { Message } from '../../../commons/message';

import { Report, Params } from '../report';
import { ReportParam } from '../report';
import { ReportType } from '../report';
import { WorkEffortType } from '../report';
import { ReportService } from '../../../api/report.service';
import { Party } from '../../../view/party/party/party';
import { PartyService } from '../../../api/party.service';
import { UomService } from '../../../api/uom.service';
import { StatusItem } from '../../../view/status-item/status-item/status-item';
import { StatusItemService } from '../../../api/status-item.service';
import { RoleType } from '../../../view/role-type/role-type/role-type';
import { RoleTypeService } from '../../../api/role-type.service';
import { WorkEffort } from '../../../view/work-effort/work-effort/work-effort';
import { WorkEffortService } from '../../../api/work-effort.service';
import { UomRangeValues } from '../../../view/uom/range-values/uom-range-values';


import { ReportDownloadComponent } from '../../../shared/report-download/report-download.component';

import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import { EnumerationService } from 'app/commons/enumeration.service';
import { Enumeration } from 'app/commons/enumeration';
import { WorkEffortTypeService } from 'app/api/work-effort-type.service';
import { WorkEffortRevisionService } from 'app/api/work-effort-revision.service';
import { DownloadActivityService } from 'app/shared/report-download/download-activity.service';
import { WorkEffortRevision } from 'app/commons/workEffortRevision';
import { ApiClientService } from 'app/api/client.service';

/** Convert from WorkEffort[] to SelectItem[] */
  function workEfforts2SelectItems(types: WorkEffort[]): SelectItem[] {
  if (types == null) {
    return [];
  }
  return types.map((wt: WorkEffort) => {
    return {label: ( wt.sourceReferenceId != null ? wt.sourceReferenceId + " - " + wt.workEffortName: wt.workEffortName), value: wt.workEffortId};
  });
}

/** Convert from workEffortRevision[] to SelectItems[] */
function workEffortRevision2SelectItems(types: WorkEffortRevision[]): SelectItem[] {
  if (types == null) {
    return [];
  }
  return types.map((wt: WorkEffortRevision) => {
    return {label: ( wt.description), value: wt.workEffortRevisionId};
    });
}

/** Convert from WorkEffortId20R20P20D[] to SelectItem[] */
function workEffortId20R20P20D2SelectItems(types: WorkEffort[]): SelectItem[] {
  if (types == null) {
    return [];
  }
  return types.map((wt: WorkEffort) => {
    return {label: ( wt.sourceReferenceId != null ? wt.sourceReferenceId + " - " + wt.workEffortName: wt.workEffortName), value: wt.workEffortId};
  });
}

/** Convert from workEffortId20D6[] to SelectItem[] */
function workEffortId20D62SelectItems(types: WorkEffortType[]): SelectItem[] {
  if (types == null) {
    return [];
  }
  return types.map((wt: WorkEffort) => {
    return {label: ( wt.sourceReferenceId != null ? wt.sourceReferenceId + " - " + wt.workEffortName: wt.workEffortName), value: wt.workEffortId};
  });
}

/** Convert from WorkEffortType[] to SelectItem[] */
function workEffortTypes20R20P20D2SelectItems(types: WorkEffortType[]): SelectItem[] {
  if (types == null) {
    return [];
  }
  return types.map((wt: WorkEffortType) => {
    return {label: ( wt.description), value: wt.workEffortTypeId};
  });
}

/** convert workEffortTypeIdParametric to SelectItem[] */
function workEffortTypeIdParametricSelectItems(types: WorkEffortType[]): SelectItem[] {
  if (types == null) {
    return [];
  }
  return types.map((wt: WorkEffortType) => {
    return {label: ( wt.description), value: wt.workEffortTypeId};
  });
}

/** convert workEffortTypeIdParametric2 to SelectItem[] */
function workEffortTypeIdParametric2SelectItems(types: WorkEffortType[]): SelectItem[] {
  if (types == null) {
    return [];
  }
  return types.map((wt: WorkEffortType) => {
    return {label: ( wt.description), value: wt.workEffortTypeId};
  });
}

/** convert workEffortTypeIdParametric3 to SelectItem[] */
function workEffortTypeIdParametric3SelectItems(types: WorkEffortType[]): SelectItem[] {
  if (types == null) {
    return [];
  }
  return types.map((wt: WorkEffortType) => {
    return {label: ( wt.description), value: wt.workEffortTypeId};
  });
}

/** Convert from workEffortIdParametric[] to SelectItem[] */
function workEffortIdParametricSelectItems(types: WorkEffort[]): SelectItem[] {
  if (types == null) {
    return [];
  }
  return types.map((wt: WorkEffort) => {
    return {label: ( wt.sourceReferenceId != null ? wt.sourceReferenceId + " - " + wt.workEffortName: wt.workEffortName), value: wt.workEffortId};
  });
}

/** Convert from workEffortIdParametric2[] to SelectItem[] */
function workEffortIdParametric2SelectItems(types: WorkEffort[]): SelectItem[] {
  if (types == null) {
    return [];
  }
  return types.map((wt: WorkEffort) => {
    return {label: ( wt.sourceReferenceId != null ? wt.sourceReferenceId + " - " + wt.workEffortName: wt.workEffortName), value: wt.workEffortId};
  });
}

/** Convert from workEffortIdParametric3[] to SelectItem[] */
function workEffortIdParametric3SelectItems(types: WorkEffort[]): SelectItem[] {
  if (types == null) {
    return [];
  }
  return types.map((wt: WorkEffort) => {
    return {label: ( wt.sourceReferenceId != null ? wt.sourceReferenceId + " - " + wt.workEffortName: wt.workEffortName), value: wt.workEffortId};
  });
}

/** Convert from workEffortTypeId20D6[] to SelectItem[] */
function workEffortTypeId20D62SelectItems(types: WorkEffortType[]): SelectItem[] {
  if (types == null) {
    return [];
  }
  return types.map((wt: WorkEffortType) => {
    return {label: (wt.description), value: wt.workEffortTypeId};
  });
}




/** Convert from UomRangeValues[] to SelectItem[] */
function uomRangeValues2SelectItems(uomRangeValues: UomRangeValues[]): SelectItem[] {
  if (uomRangeValues == null){
    return [];
  }
  return uomRangeValues.map((p:UomRangeValues) => {
    return {label: p.comments, value: p.uomRangeValuesId};
  });
}
/** Convert from Enumeration[] to SelectItem[] */
function enumeration2SelectItems(enumeration: Enumeration[]): SelectItem[] {
  if(enumeration == null){
    return [];
  }
  return enumeration.map((p:Enumeration) => {
    return {label: p.description, value: p.enumCode};
  });
}

/** Convert from Party[] to SelectItem[] */
//function

/** Convert from Party[] to SelectItem[] */
function orgUnit2SelectItems(party: Party[]): SelectItem[] {
  if (party == null) {
    return [];
  }
  return party.map((p: Party) => {
    return {label: p.partyParentRole.parentRoleCode + " - " + p.partyName, value: p.partyId};
  });
}

/** Convert from StatusItem[] to SelectItem[] */
function statusItem2SelectItems(status: StatusItem[]): SelectItem[] {
  if (status == null){
    return [];
  }
  return status.map((p:StatusItem) => {
    return {label: p.description, value: p.description};
  });
}

/** Convert from RoleType[] to SelectItem[] */
function roleType2SelectItems(party: RoleType[]): SelectItem[] {
  if (party == null){
    return [];
  }
  return party.map((p:RoleType) => {
    return {label: p.description, value: p.roleTypeId};
  });
}

/** Convert from WorkEffortType[] to SelectItem[] */
function workEffortType2SelectItems(workEffortType: WorkEffortType[]): SelectItem[] {
  if (workEffortType == null){
    return [];
  }
  return workEffortType.map((p:WorkEffortType) => {
    return {label: p.workEffortTypeName, value: p.workEffortTypeId};
  });
}

/** COnvert from languages[] to SelectItem[] */
function languages2SelectItems(lang: string[]): SelectItem[] {
  if(lang == null) {
    return [];
  }
  return lang.map(p => {
    return {label: this.i18nService.translate(p), value:p};
  });
}

/** Convert from WorkEffortType[] to SelectItem[] */
function outputFormat2SelectItems(outputFormat: ReportType[]): SelectItem[] {
  if (outputFormat == null){
    return [];
  }
  return outputFormat.map((p:ReportType) => {
    return {label: p.description, value: p.mimeTypeId};
  });
}


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})

export class ReportComponent implements OnInit {
  _reload: Subject<ReloadParams>;

  /** Error message from be*/
  error = '';
  /** Selected report*/
  selectedReport: Report;

  reportContentId: string;

  outputFormat: ReportType;
  outputFormats: ReportType[];
  outputFormatSelectItem: SelectItem[] = [];
  workEffortType: WorkEffortType;
  workEffortTypes: WorkEffortType[];
  workEffortRevision: WorkEffortRevision[];
  workEffortTypeSelectItem: SelectItem[] = [];
  params: ReportParam[];

  workEffort: WorkEffort;
  workEfforts: WorkEffort[] = [];
  workEffortId: String;

  workEffortIdSelectItem: SelectItem[] = [];
  orgUnitIdSelectItem: SelectItem[] = [];
  currentStatusNameSelectItem: SelectItem[] = [];
  roleTypeIdSelectItem: SelectItem[] = [];
  partyIdSelectItem: SelectItem[] = [];
  workEffortIdChildSelectItem: SelectItem[] = [];
  uomRangeValuesIdSelectItem: SelectItem[] = [];
  form: FormGroup;

  personIdSelectItem: SelectItem[] = [];
  workEffortTypeIdParametricSelectItem: SelectItem[] = [];
  workEffortIdParametricSelectItem: SelectItem[] = [];
  workEffortTypeIdParametric2SelectItem: SelectItem[] = [];
  workEffortIdParametric2SelectItem: SelectItem[] = [];
  workEffortTypeIdParametric3SelectItem: SelectItem[] = [];
  workEffortIdParametric3SelectItem: SelectItem[] = [];
  workEffortTypeId20R20P20DSelectItem: SelectItem[] = [];
  workEffortTypeId20D6SelectItem: SelectItem[] = [];
  workEffortId20R20P20DSelectItem: SelectItem[] = [];
  workEffortId20D6SelectItem: SelectItem[] = [];
  politicianRoleTypeIdSelectItem: SelectItem[] = [];
  assessorsSelectItem: SelectItem[] = [];
  scorePreviewSelectItem: SelectItem[] = [];
  workEffortRevisionSelectItem: SelectItem[] = [];

  paramsValue: any = {};
  paramsSelectItem: any = {};
  paramsOptions: any = {};

  hiddenMail: boolean;

  msgs: Message[] = [];
  languages: String[] = [];
  languagesSelectItem: SelectItem[] = [];
  languageSelected: string;
  langType: string;

  constructor(private readonly route: ActivatedRoute,
  private readonly router: Router,
  public readonly i18nService: I18NService,
  private readonly reportService: ReportService,
  private readonly partyService: PartyService,
  private readonly uomService: UomService,
  private readonly statusItemService: StatusItemService,
  private readonly roleTypeService: RoleTypeService,
  private readonly workEffortService: WorkEffortService,
  private readonly workEffortTypeService: WorkEffortTypeService,
  private readonly workEffortRevisionService: WorkEffortRevisionService,
  private readonly reportDownloadComponent: ReportDownloadComponent,
  private readonly enumerationService: EnumerationService,
  private readonly downloadActivityService: DownloadActivityService,
  private readonly client: ApiClientService,
  private fb: FormBuilder,
  http: HttpClient) {
    this._reload = new Subject<ReloadParams>();
  }

  filterDisplay(param: ReportParam) {
    return param.display;
  }

  ngOnInit() {

    // this.route.paramMap('');
    console.log('ngOnInit Report component ');
    //let reloadedReport = this._reload;


   this.client.get("/profile/i18n/languages").pipe(map(
    json => json.results as String[]
   )).subscribe(data=>{
    this.languages = data;
    this.languagesSelectItem = data.map(
      (p:string) => {
        return {label: this.i18nService.translate(p), value: p};
      });
    console.log("languages available report "+data);
   });


   this.client.get("/profile/i18n/language-type").subscribe( data => {
    this.langType = data as string;
    console.log("lang type "+this.langType);
   });


    let parentTypeId = this.route.snapshot.parent.params.parentTypeId;
    let reportContentId = this.route.snapshot.params.reportContentId;

    const reloadedOrgUnit = this._reload.pipe(switchMap(() => this.partyService.orgUnits(parentTypeId, this.paramsOptions['orgUnitId'])));
    const reloadedOrgUnitObs = this.route.data.pipe(
      map((data: { orgUnits: Party[] }) => data.orgUnits),
      merge(reloadedOrgUnit),
      map(orgUnit2SelectItems)
    ).subscribe((data) => {
      this.orgUnitIdSelectItem = data;
      this.orgUnitIdSelectItem.push({label: this.i18nService.translate('Select orgUnitId'), value:null});
      this.paramsSelectItem['orgUnitIdSelectItem'] = this.orgUnitIdSelectItem;

    });


    const reloadedStatus = this._reload.pipe(switchMap(() => this.statusItemService.statusItems(parentTypeId)));
    const reloadedStatusObs = this.route.data.pipe(
      map((data: { statusItems: StatusItem[] }) => data.statusItems),
      merge(reloadedStatus),
      map(statusItem2SelectItems)
    ).subscribe((data) => {
      this.currentStatusNameSelectItem = data;
      this.currentStatusNameSelectItem.push({label: this.i18nService.translate('Select statusItem'), value:null});
      this.paramsSelectItem['currentStatusNameSelectItem'] = this.currentStatusNameSelectItem;

    });


    const reloadedRoleType = this._reload.pipe(switchMap(() => this.roleTypeService.roleTypes()));
    const reloadedRoleTypeObs = this.route.data.pipe(
      map((data: { roleTypes: RoleType[] }) => data.roleTypes),
      merge(reloadedRoleType),
      map(roleType2SelectItems)
    ).subscribe((data) => {
      this.roleTypeIdSelectItem = data;
      this.roleTypeIdSelectItem.push({label: this.i18nService.translate('Select roleType'), value:null});
      this.paramsSelectItem['roleTypeIdSelectItem'] = this.roleTypeIdSelectItem;

    });

    const reloadedParty = this._reload.pipe(switchMap(params => (params.roleTypeId ? this.partyService.roleTypePartys(params.roleTypeId, this.paramsOptions['partyId']) : reloadedParty)));
    const reloadedPartyObs = this.route.data.pipe(
      map((data: { partys: Party[] }) => data.partys),
      merge(reloadedParty),
      map(ps => this.party2SelectItems(ps))
    ).subscribe((data) => {
      this.partyIdSelectItem = data;
      this.partyIdSelectItem.push({label: this.i18nService.translate('Select party'), value:null});
      this.paramsSelectItem['partyIdSelectItem'] = this.partyIdSelectItem;

    });

    const reloadedWorkEffort = this._reload.pipe(
      switchMap(params =>
      (params.workEffortTypeId ? this.workEffortService.workEfforts(parentTypeId, params.workEffortTypeId, this.selectedReport.useFilter)
       : reloadedWorkEffort)));
    const workEffortObs = this.route.data.pipe(
       map((data: { workEfforts: WorkEffort[] }) => data.workEfforts),
       merge(reloadedWorkEffort),
       map(workEfforts2SelectItems)
    ).subscribe((data) => {
      this.workEffortIdSelectItem = data;
      this.workEffortIdSelectItem.push({label: this.i18nService.translate('Select WorkEffort'), value:null});
      this.paramsSelectItem['workEffortIdSelectItem'] = this.workEffortIdSelectItem;
    });

    const reloadedPerson = this._reload.pipe(switchMap(() => this.partyService.roleTypePartys('EMPLOYEE', this.paramsOptions['personId'])));
    const reloadedPersonObs = this.route.data.pipe(
      map((data: { partys: Party[] }) => data.partys),
      merge(reloadedPerson),
      map(ps => this.party2SelectItems(ps))
    ).subscribe((data) => {
      let emptyPersonIdSelectItem = [];
      emptyPersonIdSelectItem.push({label: this.i18nService.translate('Select party'), value: null});
      this.personIdSelectItem = emptyPersonIdSelectItem.concat(data);
      this.paramsSelectItem['personIdSelectItem'] = this.personIdSelectItem;
    });

    const reloadedPoliticianTypeId = this._reload.pipe(switchMap(() => this.partyService.roleTypePartysBetween('WEM_P1,WEM_P99')));
    const reloadPoliticianTypeIdObs = this.route.data.pipe(
      map((data: { partys: Party[] }) => data.partys),
      merge(reloadedPoliticianTypeId),
      map(ps => this.party2SelectItems(ps))
    ).subscribe((data) => {
      this.politicianRoleTypeIdSelectItem = data;
      this.politicianRoleTypeIdSelectItem.unshift({label: this.i18nService.translate('Select party'), value: null});
      this.paramsSelectItem['politicianRoleTypeIdSelectItem'] = this.politicianRoleTypeIdSelectItem;
    });

    const reloadedAssessors = this._reload.pipe(switchMap(() => this.enumerationService.enumerations('ASSESSORS')));
    const reloadedAssessorsObs = this.route.data.pipe(
      map((data: {enumerations: Enumeration[]}) => data.enumerations),
      merge(reloadedAssessors),
      map(enumeration2SelectItems)
    ).subscribe((data) => {
      this.assessorsSelectItem = data;
      this.assessorsSelectItem.unshift({label: this.i18nService.translate('Select statusItem'), value: null});
      this.paramsSelectItem['assessorsSelectItem'] = this.assessorsSelectItem;
    });

    const reloadedScorePreview = this._reload.pipe(switchMap(() => this.enumerationService.enumerations('SCOREPREVIEW')));
    const reloadedScorePreviewObs = this.route.data.pipe(
      map((data: {enumerations: Enumeration[]}) => data.enumerations),
      merge(reloadedScorePreview),
      map(enumeration2SelectItems)
    ).subscribe((data) => {
      this.scorePreviewSelectItem = data;
      this.scorePreviewSelectItem.unshift({label: this.i18nService.translate('Select statusItem'), value: null});
      this.paramsSelectItem['scorePreviewSelectItem'] = this.scorePreviewSelectItem;
    });

    const reloadedWorkEffortTypeIdParametric = this._reload.pipe(
      switchMap(() => this.workEffortTypeService.workEffortTypesParametric(this.workEffortType.workEffortTypeId))); //'20P92STM'
    const workEffortTypeIdParametricObs = this.route.data.pipe(
       map((data: { workEffortTypes: WorkEffortType[] }) => data.workEffortTypes),
       merge(reloadedWorkEffortTypeIdParametric),
       map(workEffortTypeIdParametricSelectItems)
    ).subscribe((data) => {
      this.workEffortTypeIdParametricSelectItem = data;
      this.workEffortTypeIdParametricSelectItem.unshift({label: this.i18nService.translate('Select WorkEffortType'), value:null});
      this.paramsSelectItem['workEffortTypeIdParametricSelectItem'] = this.workEffortTypeIdParametricSelectItem;
    });

    const reloadedWorkEffortIdParametric = this._reload.pipe(
      switchMap(params => (params.workEffortTypeIdParametric?
       this.workEffortService.workEfforts(parentTypeId, params.workEffortTypeIdParametric, this.selectedReport.useFilter)
       : reloadedWorkEffortIdParametric)));
    const reloadedWorkEffortIdParametricObs = this.route.data.pipe(
       map((data: { workEfforts: WorkEffort[] }) => data.workEfforts),
       merge(reloadedWorkEffortIdParametric),
       map(workEffortIdParametricSelectItems)
    ).subscribe((data) => {
      this.workEffortIdParametricSelectItem = data;
     // this.workEffortIdParametricSelectItem.unshift({label: this.i18nService.translate('Select WorkEffort'), value:null});
      this.paramsSelectItem['workEffortIdParametricSelectItem'] = this.workEffortIdParametricSelectItem;
    });

    const reloadedWorkEffortTypeIdParametric2 = this._reload.pipe(
      switchMap(() => this.workEffortTypeService.workEffortTypesParametric(this.workEffortType.workEffortTypeId)));
    const workEffortTypeIdParametricObs2 = this.route.data.pipe(
       map((data: { workEffortTypes: WorkEffortType[] }) => data.workEffortTypes),
       merge(reloadedWorkEffortTypeIdParametric2),
       map(workEffortTypeIdParametric2SelectItems)
    ).subscribe((data) => {
      this.workEffortTypeIdParametric2SelectItem = data;
      this.workEffortTypeIdParametric2SelectItem.unshift({label: this.i18nService.translate('Select WorkEffortType'), value:null});
      this.paramsSelectItem['workEffortTypeIdParametric2SelectItem'] = this.workEffortTypeIdParametric2SelectItem;
    });

    const reloadedWorkEffortIdParametric2 = this._reload.pipe(
      switchMap(params => (params.workEffortTypeIdParametric2?
       this.workEffortService.workEfforts(parentTypeId, params.workEffortTypeIdParametric2, this.selectedReport.useFilter)
       : reloadedWorkEffortIdParametric2)));
    const reloadedWorkEffortIdParametricObs2 = this.route.data.pipe(
       map((data: { workEfforts: WorkEffort[] }) => data.workEfforts),
       merge(reloadedWorkEffortIdParametric2),
       map(workEffortIdParametric2SelectItems)
    ).subscribe((data) => {
      this.workEffortIdParametric2SelectItem = data;
     // this.workEffortIdParametric2SelectItem.unshift({label: this.i18nService.translate('Select WorkEffort'), value:null});
      this.paramsSelectItem['workEffortIdParametric2SelectItem'] = this.workEffortIdParametric2SelectItem;
    });

    const reloadedWorkEffortTypeIdParametric3 = this._reload.pipe(
      switchMap(() => this.workEffortTypeService.workEffortTypesParametric(this.workEffortType.workEffortTypeId)));
    const workEffortTypeIdParametricObs3 = this.route.data.pipe(
       map((data: { workEffortTypes: WorkEffortType[] }) => data.workEffortTypes),
       merge(reloadedWorkEffortTypeIdParametric3),
       map(workEffortTypeIdParametric3SelectItems)
    ).subscribe((data) => {
      this.workEffortTypeIdParametric3SelectItem = data;
      this.workEffortTypeIdParametric3SelectItem.unshift({label: this.i18nService.translate('Select WorkEffortType'), value:null});
      this.paramsSelectItem['workEffortTypeIdParametric3SelectItem'] = this.workEffortTypeIdParametric3SelectItem;
    });

    const reloadedWorkEffortIdParametric3 = this._reload.pipe(
      switchMap(params => (params.workEffortTypeIdParametric3?
       this.workEffortService.workEfforts(parentTypeId, params.workEffortTypeIdParametric3, this.selectedReport.useFilter)
       : reloadedWorkEffortIdParametric3)));
    const reloadedWorkEffortIdParametricObs3 = this.route.data.pipe(
       map((data: { workEfforts: WorkEffort[] }) => data.workEfforts),
       merge(reloadedWorkEffortIdParametric3),
       map(workEffortIdParametric3SelectItems)
    ).subscribe((data) => {
      this.workEffortIdParametric3SelectItem = data;
     // this.workEffortIdParametric3SelectItem.unshift({label: this.i18nService.translate('Select WorkEffort'), value:null});
      this.paramsSelectItem['workEffortIdParametric3SelectItem'] = this.workEffortIdParametric3SelectItem;
    });

    const reloadedWorkEffortTypeId20R20P20D = this._reload.pipe(switchMap(() => this.workEffortTypeService.workEffortTypesParametric(this.workEffortType.workEffortTypeId))); //'20P92STM'
    const workEffortTypeId20R20P20DObs = this.route.data.pipe(
       map((data: { workEffortTypes: WorkEffortType[] }) => data.workEffortTypes),
       merge(reloadedWorkEffortTypeId20R20P20D),
       map(workEffortTypes20R20P20D2SelectItems)
    ).subscribe((data) => {
      this.workEffortTypeId20R20P20DSelectItem = data;
      this.workEffortTypeId20R20P20DSelectItem.unshift({label: this.i18nService.translate('Select WorkEffortType'), value:null});
      this.paramsSelectItem['workEffortTypeId20R20P20DSelectItem'] = this.workEffortTypeId20R20P20DSelectItem;
    });

    const reloadedWorkEffortId20R20P20D = this._reload.pipe(
      switchMap(params => (params.workEffortTypeId20R20P20D?
       this.workEffortService.workEfforts(parentTypeId, params.workEffortTypeId20R20P20D, this.selectedReport.useFilter)
       : reloadedWorkEffortId20R20P20D)));
    const reloadedWorkEffortId20R20P20DObs = this.route.data.pipe(
       map((data: { workEfforts: WorkEffort[] }) => data.workEfforts),
       merge(reloadedWorkEffortId20R20P20D),
       map(workEffortId20R20P20D2SelectItems)
    ).subscribe((data) => {
      this.workEffortId20R20P20DSelectItem = data;
      this.workEffortId20R20P20DSelectItem.unshift({label: this.i18nService.translate('Select WorkEffort'), value:null});
      this.paramsSelectItem['workEffortId20R20P20DSelectItem'] = this.workEffortId20R20P20DSelectItem;
    });

    const reloadedWorkEffortTypeId20D6 = this._reload.pipe(switchMap(() => this.workEffortTypeService.workEffortTypes('20D66%25,20D68%25,20D64%25,20D62%25,20D22%25,20D24%25')));
    const workEffortTypeId20D6Obs = this.route.data.pipe(
       map((data: { workEffortTypes: WorkEffortType[] }) => data.workEffortTypes),
       merge(reloadedWorkEffortTypeId20D6),
       map(workEffortTypeId20D62SelectItems)
    ).subscribe((data) => {
      this.workEffortTypeId20D6SelectItem = data;
      this.workEffortTypeId20D6SelectItem.unshift({label: this.i18nService.translate('Select WorkEffortType'), value:null});
      this.paramsSelectItem['workEffortTypeId20D6SelectItem'] = this.workEffortTypeId20D6SelectItem;
    });

    const reloadedWorkEffortId20D6 = this._reload.pipe(
      switchMap(params =>(params.workEffortTypeId20D6? this.workEffortService.workEfforts(parentTypeId, params.workEffortTypeId20D6, this.selectedReport.useFilter)
       : reloadedWorkEffortId20D6)));
    const reloadedWorkEffortId20D6Obs = this.route.data.pipe(
       map((data: { workEfforts: WorkEffort[] }) => data.workEfforts),
       merge(reloadedWorkEffortId20D6),
       map(workEffortId20D62SelectItems)
    ).subscribe((data) => {
      this.workEffortId20D6SelectItem = data;
      this.workEffortId20D6SelectItem.unshift({label: this.i18nService.translate('Select WorkEffort'), value: null});
      this.paramsSelectItem['workEffortId20D6SelectItem'] = this.workEffortId20D6SelectItem;
    });

    const reloadedWorkEffortChild = this._reload.pipe(switchMap(params => (params.workEffortId ? this.workEffortService.workEffortParents(params.workEffortId) : reloadedWorkEffortChild)));
    const workEffortChildObs = this.route.data.pipe(
       map((data: { workEfforts: WorkEffort[] }) => data.workEfforts),
       merge(reloadedWorkEffortChild),
       map(workEfforts2SelectItems)
    ).subscribe((data) => {
      this.workEffortIdChildSelectItem = data;
      this.workEffortIdChildSelectItem.unshift({label: this.i18nService.translate('Select WorkEffortChild'), value:null});
      this.paramsSelectItem['workEffortIdChildSelectItem'] = this.workEffortIdChildSelectItem;
    });

    const reloadWorkEffortRevision = this._reload.pipe(
      switchMap(() => this.workEffortRevisionService.workEffortRevisions(parentTypeId)));
    const workEffortRevisionObs = this.route.data.pipe(
      map((data: {workEffortRevision: WorkEffortRevision[]}) => data.workEffortRevision),
      merge(reloadWorkEffortRevision),
      map(workEffortRevision2SelectItems)
    ).subscribe((data) => {
      this.workEffortRevisionSelectItem = data;
      this.workEffortRevisionSelectItem.unshift({label: this.i18nService.translate('Select revision'), value: null});
      this.paramsSelectItem['workEffortRevisionSelectItem'] = this.workEffortRevisionSelectItem;
    });

    //TODO SBAGLIATO
    //const reloadedUomRangeValues = this._reload.pipe(switchMap(params => (params.uomRangeId ? this.uomService.uomRangeValues(params.uomRangeId) : reloadedUomRangeValues)));
    const reloadedUomRangeValues = this._reload.pipe(switchMap(() => this.uomService.uomRangeValues('CORRIS')));
    const reloadedUomRangeValuesObs = this.route.data.pipe(
      map((data: { uomRangeValues: UomRangeValues[] }) => data.uomRangeValues),
      merge(reloadedUomRangeValues),
      map(uomRangeValues2SelectItems)
    ).subscribe((data) => {
      this.uomRangeValuesIdSelectItem = data;
      this.uomRangeValuesIdSelectItem.push({label: this.i18nService.translate('Select uomRangeValuesId'), value:null});
      this.paramsSelectItem['uomRangeValuesIdSelectItem'] = this.uomRangeValuesIdSelectItem;

    });


    const reportObs = this.route.data.pipe(
      map((data: { report: Report }) => data.report)
    );
    reportObs
    .subscribe((data) => {
      console.log('ngOnInit subscribe report ' + data);
      this.onRowSelect(data);
    });

    //STATIC VALUE
    const orientation = [
      { value: "LANDSCAPE", label: 'Orizontale' },
      { value: "PORTRAIT", label: 'Verticale' }
    ]
    this.paramsSelectItem['orientationSelectItem'] = orientation;

  }
  //********* END ngOnInit */

  party2SelectItems(party: Party[]): SelectItem[] {
    if (party == null) {
      return [];
    }
    return party.map((p: Party) => {
      return {label: this.i18nService.getLanguageType()==="BILING"?"FUNZIA":p.partyName, value: p.partyId};
    });
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


  onRowSelect(data) {
    console.log('report ', data);
    this.selectedReport = data;
    this.paramsValue = {};

    this.hiddenMail = (this.selectedReport.reportContentId.indexOf('REMINDER') < 0 );

    //TODO param
    this.params = data.params;
    console.log('onRowSelect params ',  this.params);
    var paramForm = {};
    this.params.forEach((element) => {
      //gestione required
      var controller = new FormControl('');
      if (element.mandatory)
        controller = new FormControl('', Validators.required);
      paramForm[element.paramName] = controller;
      this.paramsValue[element.paramName] = element.paramDefault;
      this.paramsOptions[element.paramName] = element.options;
      //Lista di elementi per il caricamento di altre drop List
      if (element.paramName == 'uomRangeId') {
        //carico al lista TODO
        //this._reload.next({uomRangeId: element.paramDefault});
      }

    });

    //aggiungo
    paramForm["outputFormat"] = new FormControl('', Validators.required);
    paramForm["workEffortTypeId"] = new FormControl('', Validators.required);
    paramForm["languageSelected"] = new FormControl('');
    this.form = this.fb.group(paramForm);


    this.outputFormats = data.outputFormats;
    this.outputFormatSelectItem = outputFormat2SelectItems(this.workEffortTypes);
    this.outputFormat = data.outputFormats[0];
    console.log('onRowSelect outputFormat ',  this.outputFormat);

    let parentTypeId = this.selectedReport.parentTypeId;
    console.log('onRowSelect reportContentId ' + this.selectedReport.reportContentId);
    console.log('onRowSelect parentTypetId ' + parentTypeId);

    this.workEffortTypes = data.workEffortTypes;
    this.workEffortTypeSelectItem = workEffortType2SelectItems(this.workEffortTypes);
    console.log('onRowSelect workEffortTypes ', this.workEffortTypes);

    //this.workEffortType = data.workEffortTypes[0];
    //console.log('onRowSelect workEffortTypeId ', this.workEffortType);
    this.onRowSelectWorkEffortType(data.workEffortTypes[0]);

  }

  onRowSelectWorkEffortType(data) {
    console.log('onRowSelectWorkEffortType workEffortTypeId ', data.workEffortTypeId);
    this.workEffortType = data;
    //this.filterWorkEffort(this.workEffortType.workEffortTypeId);
    this._reload.next({workEffortTypeId: this.workEffortType.workEffortTypeId});
  }

 /* filterWorkEffort(workEffortTypeId) {
    console.log('filterWorkEffort-->'+workEffortTypeId);
    this._reload.next({workEffortTypeId});
 }*/

  setDataReport() {
    console.log('setDataReport' + this.selectedReport );
    console.log('dopo selectedReport' + this.selectedReport);
    this.selectedReport.outputFormat = this.outputFormat.mimeTypeId;
    this.selectedReport.workEffortTypeId = this.workEffortType.workEffortTypeId;

    //CONVERTO I DATI
    //this.selectedReport.paramsValue = this.paramsValue;
    this.selectedReport.paramsValue  = Object.assign({}, this.paramsValue);
    this.params.forEach((element) => {
      if (element.paramType == 'DATE') {
        this.selectedReport.paramsValue[element.paramName] = this.reportService.getDate(this.paramsValue[element.paramName]);
      }
    });


  }

  print() {
    console.log('print report ');
    this.setDataReport();
    // this.downloadActivityService.openDownload(null);
    this.reportService
      .add(this.selectedReport)
      .then((activityId: string) => {
        console.log('activityId ' + activityId);
        this.downloadActivityService.openDownload(activityId);
        // this.reportDownloadComponent.openDownload(activityId);
        //this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Print'), detail:this.i18nService.translate('Esecuzione stampa '+ this.selectedReport.reportName)}];
      })
      .catch((error) => {
        console.log('error.message' , error);
        this.error = this.i18nService.translate(error) || error;
      });
  }

  mail() {
    console.log('send mail ');
    this.setDataReport();
    this.reportService
      .mail(this.selectedReport)
      .then(() => {
        this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Send Email'), detail:this.i18nService.translate('Invio mail in esequzione ')}];
      })
      .catch((error) => {
        console.log('error' , error);
        this.error = this.i18nService.translate(error) || error;
       });

  }

}



export interface ReloadParams {
  workEffortTypeId?: string;
  useFilter?: string;
  roleTypeId?: string;
  workEffortId?: string;
  uomRangeId?: string;
  workEffortTypeId20R20P20D?: string;
  workEffortTypeId20D6?: string;
  workEffortTypeIdParametric?: string;
  workEffortTypeIdParametric2?: string;
  workEffortTypeIdParametric3?: string;
}
