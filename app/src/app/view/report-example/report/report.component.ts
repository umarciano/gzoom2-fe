import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';


import { Subject } from 'rxjs';
import { map, merge, switchMap } from 'rxjs/operators';
import * as moment from 'moment';

import { SelectItem } from '../../../commons/selectitem';
import { I18NService } from '../../../commons/i18n.service';
import { Message } from '../../../commons/message';

import { Report } from '../report';
import { ReportParam } from '../report';
import { ReportType } from '../report';
import { WorkEffortType } from '../report';
import { ReportService } from '../../../api/report.service';
import { Party } from '../../../view/party/party/party';
import { PartyService } from '../../../api/party.service';
import { StatusItem } from '../../../view/status-item/status-item/status-item';
import { StatusItemService } from '../../../api/status-item.service';
import { RoleType } from '../../../view/role-type/role-type/role-type';
import { RoleTypeService } from '../../../api/role-type.service';
import { WorkEffort } from '../../../view/work-effort/work-effort/work-effort';
import { WorkEffortService } from '../../../api/work-effort.service';


import { ReportDownloadComponent } from '../../../layout/report-download/report-download.component';

import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';

/** Convert from WorkEffort[] to SelectItem[] */
  function workEfforts2SelectItems(types: WorkEffort[]): SelectItem[] {
  if (types == null){
    return [];
  } 
  return types.map((wt: WorkEffort) => {
    return {label: ( wt.sourceReferenceId != null ? wt.sourceReferenceId + " - " + wt.workEffortName: wt.workEffortName), value: wt.workEffortId};
  });
}

/** Convert from Party[] to SelectItem[] */
function party2SelectItems(party: Party[]): SelectItem[] {
  if (party == null){
    return [];
  }
  return party.map((p:Party) => {
    return {label: p.partyName, value: p.partyId};
  });
}

/** Convert from Party[] to SelectItem[] */
function orgUnit2SelectItems(party: Party[]): SelectItem[] {
  if (party == null){
    return [];
  }
  return party.map((p:Party) => {
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

  form: FormGroup;

  paramsValue: any = {};
  paramsSelectItem: any = {};

  hiddenMail: boolean;

  msgs: Message[] = [];

  constructor(private readonly route: ActivatedRoute,
  private readonly router: Router,
  private readonly i18nService: I18NService,
  private readonly reportService: ReportService,
  private readonly partyService: PartyService,
  private readonly statusItemService: StatusItemService,
  private readonly roleTypeService: RoleTypeService,
  private readonly workEffortService: WorkEffortService,
  private readonly reportDownloadComponent: ReportDownloadComponent,
  private fb: FormBuilder, 
  http: HttpClient,) {
    this._reload = new Subject<ReloadParams>(); 
  }

  ngOnInit() {

    // this.route.paramMap('');
    console.log('ngOnInit Report component ');
    //let reloadedReport = this._reload;    
    

    var parentTypeId = this.route.snapshot.parent.params.parentTypeId;
    var reportContentId = this.route.snapshot.params.reportContentId;
   
    const reloadedOrgUnit = this._reload.pipe(switchMap(() => this.partyService.orgUnits(parentTypeId)));
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

    const reloadedParty = this._reload.pipe(switchMap(params => (params.roleTypeId ? this.partyService.roleTypePartys(params.roleTypeId) : reloadedParty)));
    const reloadedPartyObs = this.route.data.pipe(
      map((data: { partys: Party[] }) => data.partys),
      merge(reloadedParty),
      map(party2SelectItems)
    ).subscribe((data) => {
      this.partyIdSelectItem = data;
      this.partyIdSelectItem.push({label: this.i18nService.translate('Select party'), value:null});
      this.paramsSelectItem['partyIdSelectItem'] = this.partyIdSelectItem;

    });
   
    const reloadedWorkEffort = this._reload.pipe(switchMap(params => (params.workEffortTypeId ? this.workEffortService.workEfforts(parentTypeId, params.workEffortTypeId, this.selectedReport.useFilter) : reloadedWorkEffort)));
    const workEffortObs = this.route.data.pipe(
       map((data: { workEfforts: WorkEffort[] }) => data.workEfforts),   
       merge(reloadedWorkEffort),        
       map(workEfforts2SelectItems)
    ).subscribe((data) => {
      this.workEffortIdSelectItem = data;      
      this.workEffortIdSelectItem.push({label: this.i18nService.translate('Select WorkEffort'), value:null});
      this.paramsSelectItem['workEffortIdSelectItem'] = this.workEffortIdSelectItem;
    });
    
    const reloadedWorkEffortChild = this._reload.pipe(switchMap(params => (params.workEffortId ? this.workEffortService.workEffortParents(params.workEffortId) : reloadedWorkEffortChild)));
    const workEffortChildObs = this.route.data.pipe(
       map((data: { workEfforts: WorkEffort[] }) => data.workEfforts),   
       merge(reloadedWorkEffortChild),        
       map(workEfforts2SelectItems)
    ).subscribe((data) => {
      this.workEffortIdChildSelectItem = data;      
      this.workEffortIdChildSelectItem.push({label: this.i18nService.translate('Select WorkEffortChild'), value:null});
      this.paramsSelectItem['workEffortIdChildSelectItem'] = this.workEffortIdChildSelectItem;
    });
    

    const reportObs = this.route.data.pipe(
      map((data: { report: Report }) => data.report)       
    );
    reportObs
    .subscribe((data) => {
      console.log('ngOnInit subscribe report ' + data);
      this.onRowSelect(data);
    });
    
  }
  //********* END ngOnInit */

  

  onChangeAll(value, paramName) {
    console.log('onChangeAll paramName= ' + paramName + ' value=', value);
    if (paramName == 'roleTypeId') {
      this._reload.next({roleTypeId: value});
    } else if (paramName == 'workEffortId') {
      this._reload.next({workEffortId: value});
    }
    
  }


  onRowSelect(data) {
    console.log('report ', data);
    this.selectedReport = data;

    this.hiddenMail = (this.selectedReport.reportContentId.indexOf('REMINDER') < 0 ); 

    //TODO param
    this.params = data.params;
    console.log('onRowSelect params ',  this.params);

    var paramForm = {};    
    this.params.forEach((element) => {
      var controller = new FormControl('');
      if (element.mandatory)
        controller = new FormControl('', Validators.required);
      paramForm[element.paramName] = controller;

      //setto i defaultValue    TODO capire come gestire i boolean?????  
      this.paramsValue[element.paramName] = element.paramDefault;      
    });

    //aggiungo 

    paramForm["outputFormat"] = new FormControl('', Validators.required);
    paramForm["workEffortTypeId"] = new FormControl('', Validators.required);    
   
   
    this.form = this.fb.group(paramForm);

     
    this.outputFormats = data.outputFormats;
    this.outputFormatSelectItem = outputFormat2SelectItems(this.workEffortTypes);
    console.log('onRowSelect outputFormats ', this.outputFormats);
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
    console.log('setDataReport');
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
    this.reportService
      .add(this.selectedReport)
      .then((activityId) => {
        this.reportDownloadComponent.openDownload(activityId);
        this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Print'), detail:this.i18nService.translate('Esecuzione stampa '+ this.selectedReport.reportName)}];
      })           
      .catch((error) => {
        console.log('error' , error.message);
        this.error = this.i18nService.translate(error.message) || error;
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
        console.log('error' , error.message);
        this.error = this.i18nService.translate(error.message) || error;
       });
    
  }

}



export interface ReloadParams {
  workEffortTypeId?: string;
  useFilter?: string;
  roleTypeId?: string;
  workEffortId?: string;
}
