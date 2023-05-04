import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from 'app/api/service/language.service';
import { PeriodTypeService } from 'app/api/service/period-type.service';
import { I18NService } from 'app/i18n/i18n.service';
import { ActionInput, ActionOutput, HeadArray, HeadFilter } from 'app/layout/table-editing-cell/table-editing-cell-configuration';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Observable, Subject, map, mergeMap, mergeWith } from 'rxjs';
import { PeriodType } from '../../../api/model/period-type';
import { Message as MessageError } from 'primeng/api';

@Component({
  selector: 'app-period-type',
  templateUrl: './period-type.component.html',
  styleUrls: ['./period-type.component.css']
})
export class PeriodTypeComponent implements OnInit {

  _reload: Subject<void>;
  dataTable: any;
  gridArray: PeriodType[] = [];
  selectedOn: boolean = true;
  buttonNew: boolean = true;
  buttonDelete: boolean = false;
  buttonSave: boolean = false;
  elementToAdd: PeriodType;
  editingKeyId: string;
  msgs: Message[] = [];
  selectionPeriodTypes: PeriodType[];
  messagesError: MessageError[] = [];

  headArray: HeadArray[] = [
    { head: this.i18nService.translate('Code'), fieldName: 'periodTypeId', actionInput: ActionInput.outputData, actionOutput: ActionOutput.outputLabelData, filter: HeadFilter.textFilter, sortIcon: true, required: true },
    { head: this.i18nService.translate('Description'), fieldName: 'description', actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelData, filter: HeadFilter.textFilter, sortIcon: true, required: true },
  ];

  constructor(private readonly periodTypeService: PeriodTypeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly i18nService: I18NService) { this._reload = new Subject<void>(); }

  ngOnInit(): void {
    const reloadedPeriodTypes = this._reload.pipe(mergeMap(() => this.periodTypeService.periodTypes()));

    const periodTypesObs = this.route.data.pipe(
      map((data: { periodTypes: PeriodType[] }) => data.periodTypes),
      mergeWith(reloadedPeriodTypes)
    );

    periodTypesObs.subscribe((data) => {
      this.gridArray = [];
      data.forEach((element) => {
        this.gridArray.push({
          description: element.description,
          periodTypeId: element.periodTypeId,
          variableGridArray: {
            id: element.periodTypeId,
            inputNew: false,
            inputLabeldata: true,
            outputData: true,
            updated: false
          }
        })
      })
    });

  }

  shareDescriptorTable(data) {
    this.dataTable = data;
  }

  notifyInputChanges(id) {
    this.gridArray.forEach(x => { if (x.variableGridArray.id == id) x.variableGridArray.updated = true });
    this.buttonSave = true;
  }

  openNew() {
    if (this.validGridArray(this.gridArray)) {

      if (this.hasDuplicateIds(this.gridArray)) {
        if (this.gridArray.filter(x => x.variableGridArray.id.includes("new")).length > 0) {
          this.gridArray.filter(x => x.variableGridArray.id.includes("new")).forEach(async (x) => await this.periodTypeService.createPeriodType(x).then(() => {
            this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('New item added') }];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
            x.variableGridArray.id = x.periodTypeId;
          }).catch((error) => {
            console.log('error', error);
            this.messagesError = [{ severity: 'error', summary: 'Error', detail: error.error.message }];
          }));
        }

        this.elementToAdd = {
          description: "",
          periodTypeId: "",
          variableGridArray: {
            inputNew: true,
            id: "new" + Math.random(),
            inputLabeldata: true,
            outputData: false
          }
        };

        this.gridArray = [this.elementToAdd, ...this.gridArray];
        this.editingKeyId = this.elementToAdd.variableGridArray.id;
        this.dataTable.editingRowKeys = { [this.editingKeyId]: true };
      }
      else {
        this.messagesError = [{ severity: 'error', summary: 'Error', detail: this.i18nService.translate('Duplicated unique id') }];
      }
    } else {
      this.messagesError = [{ severity: 'error', summary: 'Error', detail: this.i18nService.translate('All mandatory fields must be filled in') }];
    }
  }

  saveAllElement() {
    if (this.validGridArray(this.gridArray)) {

      if (this.hasDuplicateIds(this.gridArray)) {

        if (this.gridArray.filter(x => x.variableGridArray.id.includes("new")).length > 0) {
          this.gridArray.filter(x => x.variableGridArray.id.includes("new")).forEach(async (x) => await this.periodTypeService.createPeriodType(x).then(() => {
            this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('New item added') }];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
            this._reload.next();
          }).catch((error) => {
            console.log('error', error);
            this.messagesError = [{ severity: 'error', summary: 'Error', detail: error.error.message }];
          }));
        }

        if (this.gridArray.filter(x => x.variableGridArray.updated == true && !x.variableGridArray.id.includes("new")).length > 0) {
          this.gridArray.filter(x => x.variableGridArray.updated == true && !x.variableGridArray.id.includes("new")).forEach(async (x) => await
            this.periodTypeService.updatePeriodTypes(x)
              .then(() => {
                this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Save Confirmation') }];
                this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
                this.buttonSave = false;
                this._reload.next();
              })
              .catch((error) => {
                console.log('error', error);
                this.messagesError = [{ severity: 'error', summary: 'Error', detail: error.error.message }];
              })
          )
        }
      } else {
        this.messagesError = [{ severity: 'error', summary: 'Error', detail: this.i18nService.translate('Duplicated unique id') }];
      }
    } else {
      this.messagesError = [{ severity: 'error', summary: 'Error', detail: this.i18nService.translate('All mandatory fields must be filled in') }];
    }
  }

  shareSelectionItem(data) {
    this.selectionPeriodTypes = data;
    if (this.selectionPeriodTypes.length == 0) {
      this.buttonDelete = false;
    } else {
      this.buttonDelete = true;
    }
  }

  deleteRowSelected() {

    if (this.gridArray.length > 0) {

      this.confirmationService.confirm({
        message: this.i18nService.translate('Are you sure you want to proceed with the deletion?'),
        header: this.i18nService.translate('Attention'),
        icon: 'pi pi-question',

        accept: () => {

          if (this.selectionPeriodTypes.filter(x => x.variableGridArray.id.includes("new")).length > 0) {
            let newArray = this.selectionPeriodTypes.filter(x => x.variableGridArray.id.includes("new"));
            this.selectionPeriodTypes = this.selectionPeriodTypes.filter(x => !newArray.includes(x));
          }

          if (this.selectionPeriodTypes.length > 0) {
            this.periodTypeService.deletePeriodType(this.selectionPeriodTypes.map(x => x.periodTypeId))
              .then(() => {
                this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Delete confirmation') }];
                this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
                this._reload.next();
              })
              .catch((error) => {
                console.log('error', error.message);
                this.messagesError = [{ severity: 'error', summary: 'Error', detail: error.message }];
              });
          }
        }
      })
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: this.i18nService.translate('Please select a line') });
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.buttonSave) {
      return confirm(this.i18nService.translate('There are unsaved items, are you sure want to leave the page?'));
    } else {
      return true;
    }
  }

  validGridArray(array: PeriodType[]): boolean {
    var control = 0;
    array.forEach((element) => {
      if (element.periodTypeId == "" || element.periodTypeId == null || element.description == "" || element.description == null) {
        control = 1;
      }
    })

    if (control == 0) {
      return true;
    } else {
      return false;
    }
  }

  hasDuplicateIds(array: PeriodType[]): boolean {
    var ids = {};
    for (const e of array) {
      if (e.periodTypeId in ids) {
        console.log("test");
        return false;
      }
      ids[e.periodTypeId] = true;
    };
    return true;
  }

}
