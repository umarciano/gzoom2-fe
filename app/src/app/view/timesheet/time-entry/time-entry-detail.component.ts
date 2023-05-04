import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, mergeWith } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TimeEntry } from '../../../api/model/time_entry';
import { Timesheet } from '../../../api/model/timesheet';
import { Message } from '../../../commons/model/message';
import { I18NService } from '../../../i18n/i18n.service';
import { TimesheetService } from '../../../api/service/timesheet.service';
import { HeadArray, HeadFilter, ActionInput, ActionOutput } from 'app/layout/table-editing-cell/table-editing-cell-configuration';
import { bodyBarArray } from 'app/layout/information-bar/bodyBarArray';
import { CanComponentDeactivate } from '../../../shared/can-deactivate.guard';
import { WorkEffort } from 'app/view/work-effort/work-effort/work-effort';
import { Message as MessageError } from 'primeng/api';

@Component({
  selector: 'app-time-entry-detail',
  templateUrl: './time-entry-detail.component.html',
  styleUrls: ['./time-entry-detail.component.scss']
})
export class TimeEntryDetailComponent implements OnInit, CanComponentDeactivate, OnChanges {

  timeEntries: TimeEntry[];
  _reload: Subject<void>;
  error = '';
  msgs: Message[] = [];
  paramsTemp: any[];
  selectedTimesheetId: string;
  selectedPartyId: string;
  selectedEffortUomId: string;
  workEffortsName: any[] = [];
  tempWorkEffortName: any[] = [];
  staticWorkEffortName: any[] = [];
  selectedTimesheet: Timesheet = new Timesheet();
  period: string;
  employmentAmount: string;
  subject: string;
  totalPlanHours: number = 0;
  totalFinalHours: number = 0;
  timePercentage: number = 0;
  status: string;
  params: any = { managePlan: "N", showReference: "N", timeentryMapFormat: "DMY", weNoAssigned: "N", weExplAssLevel: "1", hasRateTypeList: "N", rateTtypeList: "STANDARD", hoursPercentage: "H", showComments: "N", glFisclTypeEnumId: "" };
  gridArray: TimeEntry[] = [];
  tempGridArray: any[] = [];
  buttonSave: boolean = false;
  dataTable: any;
  editingKeyId: string;
  newTimeEntry: boolean = false;
  elementToAdd: TimeEntry;
  selectionTimeEntrys: TimeEntry[] = [];
  workEfforts = new Map();
  updatable: boolean;
  buttonDelete: boolean;
  buttonNew: boolean;
  selectedOn: boolean;
  control: boolean;
  lastChoiceDropdown: string;
  messagesError: MessageError[] = [];

  bodyBarArray: bodyBarArray[] = [
    { head: this.i18nService.translate('Period'), label: "" },
    { head: this.i18nService.translate('Subject'), label: "" },
    { head: this.i18nService.translate('Status'), label: "" },
    { head: this.i18nService.translate('employmentAmount'), label: 0 },
    { head: this.i18nService.translate('Abbreviation'), label: 0 },
    { head: 'totalFinalHours', label: 0 }
  ]
    ;
  headArray: HeadArray[] = [
    { head: '', fieldName: 'idNumber', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, display: "none" },
    { head: '', fieldName: 'id', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, display: "none" }
  ];

  constructor(
    private readonly timesheetService: TimesheetService,
    private readonly confirmationService: ConfirmationService,
    private readonly route: ActivatedRoute,
    public readonly i18nService: I18NService,
    private messageService: MessageService,
    private fb: FormBuilder) {

    this._reload = new Subject<void>();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes && changes["totalPlanHours"]) {
      this.bodyBarArray.forEach(element => {
        if (element.head == 'totalPlanHours') { element.label = this.totalPlanHours }
      })
    }
    if (changes && changes["totalFinalHours"]) {
      this.bodyBarArray.forEach(element => {
        if (element.head == 'totalFinalHours') { element.label = this.totalFinalHours }
      })
    }
  }

  ngOnInit() {
    this.collapseSidebar();

    const reloadedWorkEffort = this._reload.pipe(switchMap(() => this.timesheetService.workEfforts(this.selectedTimesheetId)));
    const reloadedTimeEntries = this._reload.pipe(switchMap(() => this.timesheetService.timeEntries(this.selectedTimesheetId)));

    const timeEntryObs = this.route.data.pipe(
      map((data: { timeEntries: TimeEntry[] }) => data.timeEntries),
      mergeWith(reloadedTimeEntries)
    );

    const workEffortsObs = this.route.data.pipe(
      map((data: { WorkEfforts: WorkEffort[] }) => data.WorkEfforts),
      mergeWith(reloadedWorkEffort)
    );

    this.route.paramMap
      .pipe(switchMap((params) => {
        this.selectedTimesheetId = params.get('id');
        return this.timesheetService.timesheetTimeEntry(this.selectedTimesheetId);
      }))
      .subscribe((data) => {
        this.selectedTimesheet = data[0];
        this.selectedPartyId = this.selectedTimesheet.party["partyId"];
        this.selectedEffortUomId = this.selectedTimesheet.effortUomId;

        if (this.selectedTimesheet.updatable == 0) {
          this.updatable = false;
          this.buttonDelete = false;
          this.buttonNew = false;
          this.selectedOn = false;
          this.headArray.push({ head: this.i18nService.translate('workEffortName'), fieldName: 'workEffortName', actionInput: ActionInput.dropdownData, actionOutput: ActionOutput.outputLabelData, filter: HeadFilter.null, width: '30%' });
        } else {
          this.updatable = true;
          this.buttonDelete = false;
          this.buttonNew = true;
          this.selectedOn = true;
          this.headArray.push({ head: this.i18nService.translate('workEffortName'), fieldName: 'workEffortName', actionInput: ActionInput.dropdownData, actionOutput: ActionOutput.outputLabelData, filter: HeadFilter.null, width: '30%' });
        }

        this.bodyBarArray.forEach(element => {
          if (element.head == this.i18nService.translate('Period')) { element.label = this.selectedTimesheet.workEffortTypePeriod["desProc"] }
          if (element.head == this.i18nService.translate('Subject')) { element.label = this.selectedTimesheet.party["partyName"] }
          if (element.head == this.i18nService.translate('Status')) { element.label = this.selectedTimesheet.statusItem["description"] }
          if (element.head == this.i18nService.translate('employmentAmount')) { element.label = this.selectedTimesheet.partyHistoryView["employmentAmount"] }
          if (element.head == this.i18nService.translate('Abbreviation')) { element.label = this.selectedTimesheet.uom["abbreviation"] }
        })

        this.paramsTemp = this.selectedTimesheet.workEffortTypeContent["params"].split(";");



        this.paramsTemp.forEach(element => {
          if (element.split("=")[0] != "") {
            switch (element.split("=")[0]) {
              case 'managePlan':
                this.params.managePlan = element.split("=")[1].split("'")[1];
                break;
              case 'showReference':
                this.params.showReference = element.split("=")[1].split("'")[1];
                break;
              case 'timeentryMapFormat':
                this.params.timeentryMapFormat = element.split("=")[1].split("'")[1];
                break;
              case 'weNoAssigned':
                this.params.weNoAssigned = element.split("=")[1].split("'")[1];
                break;
              case 'weExplAssLevel':
                this.params.weExplAssLevel = element.split("=")[1].split("'")[0];
                break;
              case 'hasRateTypeList':
                this.params.hasRateTypeList = element.split("=")[1].split("'")[1];
                break;
              case 'rateTtypeList':
                this.params.rateTtypeList = element.split("=")[1].split("'")[1];
                break;
              case 'hoursPercentage':
                this.params.hoursPercentage = element.split("=")[1].split("'")[1];
                break;
              case 'showComments':
                this.params.showComments = element.split("=")[1].split("'")[1];
                break;
            }
            this.params.glFiscalTypeEnumId = this.selectedTimesheet.workEffortTypePeriod['glFiscalTypeEnumId'];
          }
        });



        //RICORDARTI DI RIMETTERE GLI == !!!!!!!!!!!!!!!!!

        if (this.params['managePlan'] == 'Y') {
          this.bodyBarArray.push({ head: 'totalPlanHours', label: 0 })
          if (this.params['glFisclTypeEnumId'] == "GLFISCTYPE_TARGET" && this.updatable) {
            this.headArray.push({ head: this.i18nService.translate('planHours'), fieldName: 'planHours', actionInput: ActionInput.inputLabelNumber, actionOutput: ActionOutput.outputLabelNumber, filter: HeadFilter.null, width: '10%', sortIcon: false, content: 'center' });
          } else {
            this.headArray.push({ head: this.i18nService.translate('planHours'), fieldName: 'planHours', actionInput: ActionInput.outputData, actionOutput: ActionOutput.outputLabelNumber, filter: HeadFilter.null, width: '10%', sortIcon: false, content: 'center' });
          }
        }

        // if (this.params['hoursPercentage'] == 'P') {
        // this.bodyBarArray.push({ head: 'totalFinalHours', label: 0 })

        if (this.params['glFiscalTypeEnumId'] == 'GLFISCTYPE_ACTUAL' && this.updatable) {
          this.headArray.push({ head: this.i18nService.translate('actualHours'), fieldName: 'hours', actionInput: ActionInput.inputLabelNumber, actionOutput: ActionOutput.outputLabelNumber, filter: HeadFilter.null, width: '10%', sortIcon: false, content: 'center' });
        } else {
          this.headArray.push({ head: this.i18nService.translate('actualHours'), fieldName: 'hours', actionInput: ActionInput.outputData, actionOutput: ActionOutput.outputLabelNumber, filter: HeadFilter.null, width: '10%', sortIcon: false, content: 'center' });
        }
        // }

        // if (this.params['showComments'] == 'Y') {
        if (this.updatable) {
          this.headArray.push({ head: this.i18nService.translate('comments'), fieldName: 'comments', actionInput: ActionInput.inputNotes, actionOutput: ActionOutput.outputNotes, filter: HeadFilter.null })
        } else {
          this.headArray.push({ head: this.i18nService.translate('comments'), fieldName: 'comments', actionInput: ActionInput.outputData, actionOutput: ActionOutput.outputNotes, filter: HeadFilter.null })
        }

        // };
      });

    this.route.paramMap
      .pipe(switchMap((params) => {
        this.selectedTimesheetId = params.get('id');
        return this.timesheetService.workEfforts(this.selectedTimesheetId);
      })).subscribe((data) => {
        data.forEach((element, index) => {
          this.workEffortsName = [{ label: element.workEffortName, value: element.workEffortName }, ...this.workEffortsName];
          this.workEfforts.set(element.workEffortName, [element.workEffortId, element.workEffortName]);
        });
        this.staticWorkEffortName = this.workEffortsName;
      });

    timeEntryObs.subscribe((data) => {
      if (data) {
        this.gridArray = [];
        this.timeEntries = data;
        this.totalPlanHours = 0;
        this.totalFinalHours = 0;

        this.timeEntries.forEach((element, index) => {

          this.totalPlanHours += element.planHours;
          this.totalFinalHours += element.hours;
          this.gridArray.push({
            idNumber: index,
            workEffortName: element.workEffort["workEffortName"],
            hours: element.hours,
            planHours: element.planHours,
            comments: element.comments,
            timesheetId: element.timesheetId,
            variableGridArray: {
              id: element.timeEntryId,
              buttonDetails: false,
              dropdownData: false,
              inputLabeldata: false,
              inputLabelNumber: true,
              inputNotes: true,
              outputData: true
            }
          })
        })
      }
    });


    this.bodyBarArray.forEach(element => {
      if (element.head == 'totalPlanHours') { element.label = this.totalPlanHours }
      if (element.head == 'totalFinalHours') { element.label = this.totalFinalHours }
    })

    this.tempGridArray = this.gridArray;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.buttonSave) {
      return confirm(this.i18nService.translate('There are unsaved items, are you sure want to leave the page?'));
    } else {
      return true;
    }
  }

  notifyInputChanges() {
    this.buttonSave = true;
  }

  shareDescriptorTable(data) {
    this.dataTable = data;
  }

  shareSelectionItem(data) {
    this.selectionTimeEntrys = data;
    if (this.selectionTimeEntrys.length == 0) {
      this.buttonDelete = false;
    } else {
      this.buttonDelete = true;
    }
  }

  validGridArray(array: TimeEntry[]): boolean {
    var control = 0;
    array.forEach((element) => {
      if ((element.workEffortName == "" || element.workEffortName == null) || (element.hours < 0) || (element.planHours < 0)) {
        control = 1;
      }
    })

    if (control == 0) {
      return true;
    } else {
      return false;
    }
  }

  selectedItemDropdown(item) {
    if (typeof item === "string" && this.control) {

      let tmp = this.gridArray
      tmp.forEach(x => { if (x.variableGridArray.id == item) x.workEffortName = this.lastChoiceDropdown });
      this.gridArray = tmp;

    } else {
      this.lastChoiceDropdown = item;
      this.control = true;
    }
  }

  saveAllElement() {
    if (this.validGridArray(this.gridArray)) {
      this.gridArray.forEach((element) => {
        if (element.hours == null) { element.hours = 0 }
        if (element.planHours == null) { element.planHours = 0 }

        element.variableGridArray.dropdownData = false;
        if (!!this.workEfforts.get(element.workEffortName) && element.workEffortName == this.workEfforts.get(element.workEffortName)[1]) {
          element.workEffortId = this.workEfforts.get(element.workEffortName)[0];
        }
      })
      this.timesheetService.updateTimeEntry(this.gridArray)
        .then(data => {
          this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Save Confirmation') }];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
          this.buttonSave = false;
          this._reload.next();
          this.reloadInfoBar();
        })
        .catch((error) => {
          console.log('error', error);
          this.messagesError = [{ severity: 'error', summary: 'Error', detail: error.error.message }];
        });
    } else {
      this.messagesError = [{ severity: 'error', summary: 'Error', detail: this.i18nService.translate('All mandatory fields must be filled in') }];
    }
  }

  reloadInfoBar() {
    this.bodyBarArray.forEach(element => {
      if (element.head == 'totalPlanHours') {
        element.label = 0;
        this.gridArray.forEach(e => {
          element.label += e.planHours;
        })
      }
      if (element.head == 'totalFinalHours') {
        element.label = 0;
        this.gridArray.forEach(e => {
          element.label += e.hours;
        })
      }
    })
  }

  saveSelfElement(timeEntries: Array<TimeEntry>) {
    timeEntries.forEach((element) => {
      if (element.hours == null) { element.hours = 0 }
      if (element.planHours == null) { element.planHours = 0 }
      element.variableGridArray.dropdownData = false;
      if (!!this.workEfforts.get(element.workEffortName) && element.workEffortName == this.workEfforts.get(element.workEffortName)[1]) {
        element.workEffortId = this.workEfforts.get(element.workEffortName)[0];
      }
    })
    this.timesheetService.updateTimeEntry(timeEntries).then(data => {
      this.reloadInfoBar();
    })
  }

  openNew() {
    if (!this.validGridArray(this.gridArray)) {
      this.messagesError = [{ severity: 'error', summary: 'Error', detail: this.i18nService.translate('All mandatory fields must be filled in') }];
    } else {

      this.gridArray.forEach((element) => { element.variableGridArray.dropdownData = false; })

      this.tempWorkEffortName = [];

      this.workEffortsName = this.staticWorkEffortName;

      this.workEffortsName.forEach((item) => {
        let control = 0;
        this.gridArray.forEach((element) => {
          if (item['label'] == element.workEffortName) {
            control = 1;
          }
        })
        if (control == 0) {
          this.tempWorkEffortName.push({ label: item['label'], value: item['label'] });
        }
      })

      this.workEffortsName = this.tempWorkEffortName;

      if (this.workEffortsName.length > 0) {
        this.newTimeEntry = true;
        this.elementToAdd = {
          idNumber: 0,
          workEffortName: "",
          timesheetId: this.selectedTimesheetId,
          partyId: this.selectedTimesheet.party["partyId"],
          effortUomId: this.selectedEffortUomId,
          rateTypeId: 'STANDARD',
          hours: null,
          planHours: null,
          fromDate: this.selectedTimesheet.fromDate,
          thruDate: this.selectedTimesheet.thruDate,
          comments: "",
          variableGridArray: {
            id: "new" + Math.random(),
            buttonDetails: false,
            dropdownData: true,
            inputLabeldata: false,
            inputLabelNumber: true,
            inputNotes: true,
            outputData: true
          }
        };

        this.gridArray = [this.elementToAdd, ...this.gridArray];
        this.editingKeyId = this.elementToAdd.variableGridArray.id;
        this.dataTable.editingRowKeys = { [this.editingKeyId]: true };

      } else {
        this.messagesError = [{ severity: 'error', summary: 'Error', detail: this.i18nService.translate('There are no goals to show') }];
      }
    }
  }

  deleteRowSelected() {

    if (this.selectionTimeEntrys.length > 0) {

      let itemToSave = [];
      this.gridArray.forEach((element) => {
        if (element.variableGridArray.id.substring(0, 3) == "new" && !this.selectionTimeEntrys.includes(element)) {
          itemToSave.push(element);
        }
      })

      if (itemToSave.length > 0) {
        this.saveSelfElement(itemToSave);
      }

      this.confirmationService.confirm({
        message: this.i18nService.translate('Are you sure you want to proceed with the deletion?'),
        header: this.i18nService.translate('Attention'),
        icon: 'pi pi-question',
        accept: () => {
          let arrayIdTimesheed = [];
          this.selectionTimeEntrys.forEach((element) => { arrayIdTimesheed.push(element.variableGridArray.id); this.totalFinalHours = this.totalFinalHours - element.hours });
          this.bodyBarArray.forEach(element => {
            if (element.head == 'totalPlanHours') { element.label = this.totalPlanHours }
            if (element.head == 'totalFinalHours') { element.label = this.totalFinalHours }
          })

          this.selectionTimeEntrys = [];
          console.log(arrayIdTimesheed);

          this.timesheetService.deleteTimeEntry(arrayIdTimesheed)
            .then(data => {
              this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Delete confirmation') }];
              this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
              this._reload.next();
            })
            .catch((error) => {
              console.log('error', error.message);
              this.messagesError = [{ severity: 'error', summary: 'Error', detail: error.message }];
            });
        }
      });
    } else {
      this.messagesError = [{ severity: 'error', summary: 'Error', detail: this.i18nService.translate('Please select a line') }];
    }
  }

  collapseSidebar() {
    const dom: any = document.querySelector('body');
    const menu: any = document.querySelector('#sidebar');
    dom.classList.add('push-right');
    menu.classList.add('collapse');
  }
}

class PrimeTimeEntry implements TimeEntry {
  constructor(public dirty: boolean, public timeEntryId?: string, public timesheetId?: string, public workEffortId?: string,
    public description?: string, public percentage?: number) { }
}
