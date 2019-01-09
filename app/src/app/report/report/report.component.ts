import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { first, map, merge, switchMap } from 'rxjs/operators';
import * as moment from 'moment';

import { SelectItem } from '../../commons/selectitem';
import { I18NService } from '../../commons/i18n.service';
import { Message } from '../../commons/message';

import { Report } from '../../report/report';
import { ReportParam } from '../../report/report';
import { ReportType } from '../../report/report';
import { WorkEffort } from '../../report/report';
import { WorkEffortType } from '../../report/report';
import { ReportService } from '../../api/report.service';
import { Party } from '../../view/party/party/party';
import { PartyService } from '../../api/party.service';

import { StatusItem } from '../../view/status-item/status-item/status-item';
import { StatusItemService } from '../../api/status-item.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';


/** Convert from Party[] to SelectItem[] */
function party2SelectItems(party: Party[]): SelectItem[] {
  return party.map((p:Party) => {
    return {label: p.partyName, value: p.partyId};
  });
}

/** Convert from StatusItem[] to SelectItem[] */
function statusItem2SelectItems(party: StatusItem[]): SelectItem[] {
  return party.map((p:StatusItem) => {
    return {label: p.description, value: p.description};
  });
}


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})

export class ReportComponent implements OnInit {
  _reload: Subject<void>;

  /** Error message from be*/
  error = '';
  /** Selected report*/
  selectedReport: Report;

  reportContentId: string;

  outputFormat: ReportType;
  outputFormats: ReportType[];
  workEffortType: WorkEffortType;
  workEffortTypes: WorkEffortType[];
  params: ReportParam[];  
  
  workEffortSelectItem: SelectItem[] = [];
  workEffort: WorkEffort;
  workEffortId: String;

  orgUnitIdSelectItem: SelectItem[] = [];
  currentStatusNameSelectItem: SelectItem[] = [];

  form: FormGroup;

  paramsValue: any = {};
  paramsSelectItem: any = {};

  constructor(private readonly route: ActivatedRoute,
  private readonly router: Router,
  private readonly i18nService: I18NService,
  private readonly reportService: ReportService,
  private readonly partyService: PartyService,
  private readonly statusItemService: StatusItemService,
  private fb: FormBuilder, 
  http: HttpClient,) {
    this._reload = new Subject<void>();    
  }

  ngOnInit() {

   // this.route.paramMap('');
    console.log('ngOnInit Report component ');
    //let reloadedReport = this._reload;    
    const reportObs = this.route.data.pipe(
       map((data: { report: Report }) => data.report)       
    );
    reportObs
    .subscribe((data) => {
      console.log('ngOnInit subscribe report ' + data);
      this.onRowSelect(data);
    });

    const reloadedOrgUnit = this._reload.switchMap(() => this.partyService.orgUnits());
    const reloadedOrgUnitObs = this.route.data.pipe(
      map((data: { orgUnits: Party[] }) => data.orgUnits),
      merge(reloadedOrgUnit),
      map(party2SelectItems)
    ).subscribe((data) => {
      this.orgUnitIdSelectItem = data;
      this.orgUnitIdSelectItem.push({label: this.i18nService.translate('Select Unit Organization'), value:null});
      this.paramsSelectItem['orgUnitIdSelectItem'] = this.orgUnitIdSelectItem;
    });

  //TODO  'CTX_PR' -> BHO
    const reloadedStatus = this._reload.switchMap(() => this.statusItemService.statusItems('CTX_PR'));
    const reloadedStatusObs = this.route.data.pipe(
      map((data: { statusItems: Party[] }) => data.statusItems),
      merge(reloadedStatus),
      map(statusItem2SelectItems)
    ).subscribe((data) => {
      this.currentStatusNameSelectItem = data;
      this.currentStatusNameSelectItem.push({label: this.i18nService.translate('Select Status Item'), value:null});
      this.paramsSelectItem['currentStatusNameSelectItem'] = this.currentStatusNameSelectItem;
    });
  }

  onRowSelect(data) {
    console.log('report ', data);

    this.selectedReport = data;

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


    this.form = this.fb.group(paramForm);

     
    this.outputFormats = data.outputFormats;
    console.log('onRowSelect outputFormats ', this.outputFormats);
    this.outputFormat = data.outputFormats[0];
    console.log('onRowSelect outputFormat ',  this.outputFormat);

    let parentTypeId = this.selectedReport.parentTypeId;
    console.log('onRowSelect reportContentId ' + this.selectedReport.reportContentId);
    console.log('onRowSelect parentTypetId ' + parentTypeId);

    this.workEffortTypes = data.workEffortTypes;
    console.log('onRowSelect workEffortTypes ', this.workEffortTypes);
   
    this.workEffortType = data.workEffortTypes[0];
    console.log('onRowSelect workEffortTypeId ', this.workEffortType);
    this.routerWorkEffortType();
  }

  print() {  
        
    console.log('print report ');

    this.selectedReport.outputFormat = this.outputFormat.mimeTypeId;
    this.selectedReport.workEffortTypeId = this.workEffortType.workEffortTypeId;
    this.selectedReport.paramsValue = this.paramsValue;

    this.reportService
      .add(this.selectedReport)
      .then(contentId => {        
        console.log(" contentId " + contentId);
        var newWindow = window.open('/c/report-example-1/report-download/' + contentId);
      })
      .catch((error) => {
        console.log('error' , error.message);
        this.error = this.i18nService.translate(error.message) || error;
      });
  }

  onRowSelectWorkEffortType(data) {
    console.log('onRowSelectWorkEffortType workEffortTypeId ', data);
    this.workEffortType = data;
    this.routerWorkEffortType();
  }
  routerWorkEffortType() {
    if (this.workEffortType) {
      this.router.navigate([this.workEffortType.workEffortTypeId], { relativeTo: this.route });
    }
  }


}
