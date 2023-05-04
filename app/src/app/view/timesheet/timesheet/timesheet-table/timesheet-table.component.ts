import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TimesheetService } from 'app/api/service/timesheet.service';
import { I18NService } from 'app/i18n/i18n.service';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Timesheet } from '../../../../api/model/timesheet';
import { Subject } from 'rxjs';
import { UserPreferenceService } from 'app/api/service/user-preference.service';
import { HeadArray, HeadFilter, ActionInput, ActionOutput } from 'app/layout/table-editing-cell/table-editing-cell-configuration';
import { Message as MessageError } from 'primeng/api';

@Component({
  selector: 'app-timesheet-table',
  templateUrl: './timesheet-table.component.html',
  styleUrls: ['./timesheet-table.component.css']
})
export class TimesheetTableComponent implements OnInit, OnChanges {

  timesheets: Timesheet[];
  organizationSelected = 'Company';
  @Input() isAdmin: string;
  @Input() context: string;
  @Input() params: any;
  _reload: Subject<void>;
  gridArray: Timesheet[] = [];
  form: { [name: string]: FormGroup | FormControl | FormArray };
  dataTable: any;
  selectionTimesheets: any[] = [];
  msgs: Message[] = [];
  error = '';
  loading: boolean = true;
  typeDropdownFilterArray = new Map();
  buttonDelete: boolean = false;
  iconCustom: string;
  messagesError: MessageError[] = [];

  headArray: HeadArray[] = [
    { head: '', fieldName: 'idNumber', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, display: "none" },
    { head: this.i18nService.translate('timesheetId'), fieldName: 'timesheetId', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, display: "none" },
    { head: this.i18nService.translate('Period'), fieldName: 'workEffortTypePeriod', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, filter: HeadFilter.dropdownFilter, sortIcon: true },
    { head: this.i18nService.translate('PartyName'), fieldName: 'partyName', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, filter: HeadFilter.textFilter, sortIcon: true },
    { head: this.i18nService.translate('PartyStructure'), fieldName: 'partyStructure', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, filter: HeadFilter.textFilter, sortIcon: true },
    { head: this.i18nService.translate('contractHours'), fieldName: 'contractHours', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelNumber, width: '10em', filter: HeadFilter.popUpFilter, content: 'center' },
    { head: this.i18nService.translate('actualHours'), fieldName: 'actualHours', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelNumber, width: '10em', filter: HeadFilter.popUpFilter, content: 'center' },
    { head: this.i18nService.translate('Status'), fieldName: 'description', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, filter: HeadFilter.dropdownFilter },
    { head: this.i18nService.translate('updatable'), fieldName: 'updatable', actionInput: ActionInput.null, actionOutput: ActionOutput.icon, filter: HeadFilter.dropdownFilterCustom, content: 'center' },
    { head: this.i18nService.translate(''), fieldName: 'buttonDetails', actionInput: ActionInput.null, actionOutput: ActionOutput.actionDetails, content: 'center', width: '5%' }
  ];

  constructor(private readonly timesheetService: TimesheetService,
    private readonly confirmationService: ConfirmationService,
    private readonly userPreferenceService: UserPreferenceService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly i18nService: I18NService,
    private messageService: MessageService) {
    this._reload = new Subject<void>();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes["context"]) {
      this.loading = true;
      this.gridArray = [];
      this.timesheetService.timesheets(this.context).subscribe(
        data => {
          this.timesheets = data;
          data.forEach((element, index) => {
            this.gridArray.push({
              idNumber: index,
              workEffortTypePeriod: element.workEffortTypePeriod["desProc"],
              partyName: element.party["partyName"] + " (" + element.partyParentRole["parentRoleCode"] + ")",
              partyStructure: " (" + element.partyParentRoleStructure["parentRoleCode"] + ") " + element.partyStructure["partyName"],
              contractHours: element.contractHours,
              actualHours: element.actualHours,
              description: element.statusItem["description"],
              timesheetId: element.timesheetId,
              updatable: element.updatable == 1 ? '1' : '0',
              variableGridArray: {
                buttonDetails: true,
                id: element.timesheetId,
                outputData: true,
                icon: element.updatable == 1 ? { icon: 'pi pi-pencil', value: '1' } : { icon: 'pi pi-times', value: '0' }
              }

            })
          })
          this.loading = false;
        }
      );
    }
  }

  ngOnInit(): void {

    this.userPreferenceService.getUserPreference('ORGANIZATION_PARTY').subscribe(
      data => {
        this.organizationSelected = data.userPrefValue;
      }
    );

    this.route.paramMap.subscribe(paramMap => {
      this.context = paramMap.get('context')
    });
    this.typeDropdownFilterArray.set("updatable", [{ label: "SI", value: '1' }, { label: "NO", value: '0' }, { label: "TUTTI", value: '0' && '1' }]);

  }

  shareDescriptorTable(data) {
    this.dataTable = data;
  }

  shareSelectionItem(data) {
    this.selectionTimesheets = data;
    if (this.selectionTimesheets.length == 0) {
      this.buttonDelete = false;
    } else {
      if (this.isAdmin) {
        this.buttonDelete = true;
      }
    }
  }

  deleteRowSelected() {
    if (this.selectionTimesheets.length > 0) {
      this.confirmationService.confirm({
        message: this.i18nService.translate('Are you sure you want to proceed with the deletion?'),
        header: this.i18nService.translate('Attention'),
        icon: 'pi pi-question',
        accept: () => {
          let arrayIdTimesheed = [];
          this.selectionTimesheets.forEach((element) => { arrayIdTimesheed.push(element.id) });
          this.timesheetService.deleteTimesheet(arrayIdTimesheed)
            .then(data => {
              this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Delete confirmation') }];
              this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
              this._reload.next();
            })
            .catch((error) => {
              console.log('error', error);
              this.messagesError = [{ severity: 'error', summary: 'Error', detail: error.message }];
              this.selectionTimesheets = [];
            });
        }
      });
    }
  }

  goToTimeEntry(data) {
    this.router.navigate([`${data.variableGridArray.id}`], { relativeTo: this.route });
  }

}
