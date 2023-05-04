import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkEffortSequenceService } from 'app/api/service/work-effort-sequence.service';
import { I18NService } from 'app/i18n/i18n.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, Subject, map, mergeMap, mergeWith } from 'rxjs';
import { Message as MessageError } from 'primeng/api';
import { WorkEffortSequence } from 'app/api/model/workEffortSequence';
import { Message } from 'app/commons/model/message';
import { Table } from 'primeng/table';
import { HeadArray, ActionInput, ActionOutput, HeadFilter } from 'app/layout/table-editing-cell/table-editing-cell-configuration';


@Component({
  selector: 'app-objective-codes',
  templateUrl: './objective-codes.component.html',
  styleUrls: ['./objective-codes.component.css']
})
export class ObjectiveCodesComponent implements OnInit {
  _reload: Subject<void>;
  messagesError: MessageError[] = [];
  buttonDelete: boolean;
  buttonNew: boolean = true;
  buttonSave: boolean;
  buttonBack: boolean = true;
  msgs: Message[] = [];
  elementToAdd: WorkEffortSequence;
  dataTable: Table;

  headArray: HeadArray[] = [
    { head: '', fieldName: 'idNumber', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, display: "none" },
    { head: '', fieldName: 'id', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, display: "none" }
  ]

  gridArray: WorkEffortSequence[] = [];
  editingKeyId: string;
  selectionWES: WorkEffortSequence[] = [];

  constructor(
    private route: ActivatedRoute,
    private readonly workEffortSequenceService: WorkEffortSequenceService,
    private readonly i18nService: I18NService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
  ) {
    this._reload = new Subject<void>();
  }

  ngOnInit() {
    const reloadWES = this._reload.pipe(mergeMap(() => this.workEffortSequenceService.getWorkEffortSequence()));
    const w$ = this.route.data.pipe(
      map((data: { objCod: WorkEffortSequence[] }) => data.objCod),
      mergeWith(reloadWES)
    );

    this.headArray.push({ head: this.i18nService.translate('Name'), fieldName: 'seqName', actionInput: ActionInput.outputData, actionOutput: ActionOutput.outputLabelData, filter: HeadFilter.textFilter, required: true });
    this.headArray.push({ head: this.i18nService.translate('Code'), fieldName: 'seqId', actionInput: ActionInput.inputLabelNumber, actionOutput: ActionOutput.outputLabelNumber, filter: HeadFilter.textFilter, required: true, width: "15%" });

    w$.subscribe(y => {
      setTimeout(() => { this.buttonSave = false; }, 0);
      setTimeout(() => { this.buttonDelete = false; }, 0);
      this.gridArray = [];
      y.forEach((e, index) => {
        this.gridArray.push({
          seqId: e.seqId,
          seqName: e.seqName,

          variableGridArray: {
            id: e.seqName,
            updated: false,
            buttonDetails: false,
            inputLabeldata: true,
            inputLabelNumber: true,
            inputNotes: false,
            outputData: true,
            inputNew: false
          }

        })
      })
    })
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.buttonSave) {
      return confirm(this.i18nService.translate('There are unsaved items, are you sure want to leave the page?'));
    } else {
      return true;
    }
  }

  openNew() {

    if (this.gridArray.filter(x => x.variableGridArray.id.includes("new")).length > 0) {
      if (this.validArray(this.gridArray)) {
        this.gridArray.filter(x => x.variableGridArray.id.includes("new")).forEach(async (x) => await this.workEffortSequenceService.createWorkEffortSequence(x).then(() => {

          this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('New item added') + ' [' + x.seqName + ']' }];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });

          x.variableGridArray.id = x.seqName;
          x.variableGridArray.updated = false;
          this.addNew();
        }
        )
          .catch((error) => {
            console.log('error', error);
            this.messagesError = [{ severity: 'error', summary: 'Error', detail: error + ' [' + x.seqName + ']' }];

          }));
      }
      else {
        this.messagesError = [{ severity: 'error', summary: 'Error', detail: this.i18nService.translate('All mandatory fields must be filled in') }];

      }
    }
    else this.addNew();

  }

  addNew() {

    this.elementToAdd = {

      seqName: "",
      seqId: null,

      variableGridArray: {
        id: "new" + Math.random(),
        buttonDetails: false,
        dropdownData: true,
        inputLabeldata: true,
        inputLabelNumber: true,
        inputNotes: false,
        outputData: false,
        inputNew: true,
      }

    }

    this.gridArray = [this.elementToAdd, ...this.gridArray];
    this.editingKeyId = this.elementToAdd.variableGridArray.id;
    this.dataTable.editingRowKeys = { [this.editingKeyId]: true };
  }

  shareDescriptorTable(data: Table) {
    this.dataTable = data;
  }

  notifyInputChanges(id) {
    this.gridArray.forEach(x => { if (x.variableGridArray.id == id) { x.variableGridArray.updated = true; } });

    setTimeout(() => { this.buttonSave = true; }, 0);
  }

  saveAllElement() {

    if (this.validArray(this.gridArray)) {
      if (this.gridArray.filter(x => x.variableGridArray.id.includes("new")).length > 0) {
        this.gridArray.filter(x => x.variableGridArray.id.includes("new")).forEach(async (x) => await this.workEffortSequenceService.createWorkEffortSequence(x).then(() => {

          this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('New item added') + ' [' + x.seqName + ']' }];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
        }
        )
          .catch((error) => {
            console.log('error', error);
            this.messagesError = [{ severity: 'error', summary: 'Error', detail: error + ' [' + x.seqName + ']' }];

          }));

      }

      if (this.gridArray.filter(x => x.variableGridArray.updated == true && !x.variableGridArray.id.includes("new")).length > 0) {
        this.gridArray.filter(x => x.variableGridArray.updated == true && !x.variableGridArray.id.includes("new")).forEach(async (x) => await this.workEffortSequenceService.updateWorkEffortSequence(x)
          .then(() => {
            this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Update Confirmation') + ' [' + x.seqName + ']' }];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });


          })
          .catch((error) => {
            console.log('error', error);
            this.messagesError = [{ severity: 'error', summary: 'Error', detail: error + ' [' + x.seqName + ']' }];

          }));
      }

      setTimeout(() => { this.reload() }, 500);
    } else {
      this.messagesError = [{ severity: 'error', summary: 'Error', detail: this.i18nService.translate('All mandatory fields must be filled in') }];

    }

  }

  shareSelectionItem(data) {
    this.selectionWES = data;

    if (this.selectionWES.length > 0) {
      setTimeout(() => { this.buttonDelete = true; }, 0);
    }
    else setTimeout(() => { this.buttonDelete = false; }, 0);
  }

  deleteRowSelected() {

    this.confirmationService.confirm({
      message: this.i18nService.translate('Are you sure you want to proceed with the deletion?'),
      header: this.i18nService.translate('Attention'),
      icon: 'pi pi-question',

      accept: () => {

        if (this.selectionWES.filter(x => x.variableGridArray.id.includes("new")).length > 0) {
          let newArray = this.selectionWES.filter(x => x.variableGridArray.id.includes("new"));
          this.selectionWES = this.selectionWES.filter(x => !newArray.includes(x));
        }
        if (this.selectionWES.length > 0) {

          this.selectionWES.map(x => x.seqName).forEach(id => {
            this.workEffortSequenceService.deleteWorkEffortSequence(id)
              .then(() => {
                this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Delete confirmation') }];
                this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail + "[" + id + "]" });
              })
              .catch((error) => {
                console.log('error', error.message);
                this.messagesError = [{ severity: 'error', summary: 'Error', detail: error.message + "[" + id + "]" }];
              });

          })
          setTimeout(() => { this.reload() }, 500);

        } else {
          this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Delete confirmation') }];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });

          setTimeout(() => { this.reload() }, 500);
        }


      }
    });
  }

  reload() {
    setTimeout(() => { this.buttonSave = false; }, 0);
    setTimeout(() => { this.buttonDelete = false; }, 0);
    this._reload.next();
  }

  validArray(array: WorkEffortSequence[]): boolean {

    return array.filter(x => x.seqName == "" || x.seqId == null).length == 0;
  }

}
