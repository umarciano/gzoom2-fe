import { Component, OnInit} from '@angular/core';
import { WorkEffortAssocType } from 'app/api/model/workEffortAssocType';
import { WorkEffortAssocTypeService } from 'app/api/service/work-effort-assoc-type.service';
import { I18NService } from 'app/i18n/i18n.service';
import { map, mergeMap, mergeWith } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { HeadArray, ActionInput, ActionOutput, HeadFilter } from 'app/layout/table-editing-cell/table-editing-cell-configuration';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Message } from 'app/commons/model/message';
import { Table } from 'primeng/table';
import { CanComponentDeactivate } from 'app/shared/can-deactivate.guard';
import { Message as MessageError } from 'primeng/api';


@Component({
  selector: 'app-typology-relationships-objectives',
  templateUrl: './typology-relationships-objectives.component.html',
  styleUrls: ['./typology-relationships-objectives.component.css']
})
export class TypologyRelationshipsObjectivesComponent implements OnInit, CanComponentDeactivate {
  _reload: Subject<void>;
  buttonDelete: boolean;
  buttonNew: boolean = true;
  buttonSave: boolean;
  buttonBack: boolean = true;
  msgs: Message[] = [];
  elementToAdd: WorkEffortAssocType;
  dataTable: Table;
  control: boolean;

  dropdownItemWEAT: MenuItem[] = [];
  lastChoiceDropdown: MenuItem;

  headArray: HeadArray[] = [
    { head: '', fieldName: 'idNumber', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, display: "none" },
    { head: '', fieldName: 'id', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, display: "none" }
  ]

  gridArray: WorkEffortAssocType[] = [];
  tmpGridArray: WorkEffortAssocType[] = [];

  editingKeyId: string;
  selectionWEAT: WorkEffortAssocType[] = [];

  messagesError: MessageError[] = [];


  constructor(
    private route: ActivatedRoute,
    private readonly  workEffortAssocTypeService: WorkEffortAssocTypeService,
    private readonly i18nService: I18NService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
  ) {
    this._reload = new Subject<void>();
    this.buttonDelete = false;
    this.buttonSave = false;
   }

  ngOnInit() {
    
    const reloadWEAT = this._reload.pipe(mergeMap(() => this.workEffortAssocTypeService.getWorkEffortAssocType()));
    const w$ = this.route.data.pipe(
      map((data: { weats: WorkEffortAssocType[] }) => data.weats),
      mergeWith(reloadWEAT)
    )

    this.headArray.push({ head: this.i18nService.translate('Code'), fieldName: 'workEffortAssocTypeId', actionInput: ActionInput.outputData, actionOutput: ActionOutput.outputLabelData, filter: HeadFilter.textFilter, width: '15%', required: true});
    this.headArray.push({ head: this.i18nService.translate('Description'), fieldName: 'description', actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelData, filter: HeadFilter.textFilter, required: true});
    this.headArray.push({ head: this.i18nService.translate('Classification'), fieldName: 'parentDescription', actionInput: ActionInput.dropdownData, actionOutput: ActionOutput.outputLabelData, filter: HeadFilter.textFilter});

    w$
    .subscribe(y => {
      setTimeout(() => {this.buttonSave = false;}, 0);
      setTimeout(() => {this.buttonDelete = false;},0);
      this.gridArray = [];
      y.forEach((e, index) => {
        this.gridArray.push({
          workEffortAssocTypeId: e.workEffortAssocTypeId,
          description: e.description,
          parentTypeId: e.parentTypeId,
          parentDescription: e.parentWorkEffortAssocType.description,

          variableGridArray: {
            id: e.workEffortAssocTypeId,
            updated: false,
            buttonDetails: false,
            dropdownData: true,
            inputLabeldata: true,
            inputLabelNumber: false,
            inputNotes: false,
            outputData: true,
            inputNew: false
          }

        });

      this.dropdownItemWEAT.push({ label: e.description, id: e.workEffortAssocTypeId });
      });

      this.dropdownItemWEAT.push({ label: "NONE", id: "none" });
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
      if (this.validArray(this.gridArray)){
      this.gridArray.filter(x => x.variableGridArray.id.includes("new")).forEach(async (x) => await this.workEffortAssocTypeService.createWorkEffortAssocType(x).then(() =>{
          
        this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('New item added') + ' [' + x.workEffortAssocTypeId  + ']' }];
        this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });

        x.variableGridArray.id = x.workEffortAssocTypeId;
        x.variableGridArray.updated = false;
        this.addNew();
      }
      )
      .catch((error) => {
        console.log('error', error);
        this.messagesError = [{ severity: 'error', summary: 'Error', detail: error +  ' [' + x.workEffortAssocTypeId  + ']' }];
        
      }));
    }
    else {
      this.messagesError = [{ severity: 'error', summary: 'Error', detail: this.i18nService.translate('All mandatory fields must be filled in')  }];

    }
    }
    else this.addNew();

  }

  addNew() {

    this.elementToAdd = {
      workEffortAssocTypeId: "",
      description: "",
      parentDescription: "",
      variableGridArray: {
        id: "new" + Math.random(),
        buttonDetails: false,
        dropdownData: true,
        inputLabeldata: true,
        inputLabelNumber: false,
        inputNotes: false,
        outputData: false,
        inputNew: true,
      }
    }

    this.gridArray = [this.elementToAdd, ...this.gridArray];
    this.editingKeyId = this.elementToAdd.variableGridArray.id;
    this.dataTable.editingRowKeys = { [this.editingKeyId]: true }; 
  }

  selectedItemDropdown(item) {

    if (typeof item === "string" && this.control) {

      let tmp = this.gridArray
      tmp.forEach(x =>{ if (x.variableGridArray.id == item) x.parentTypeId = this.lastChoiceDropdown.id });
      tmp.forEach(x =>{ if (x.variableGridArray.id == item) x.parentDescription = this.lastChoiceDropdown.label });

      if(this.lastChoiceDropdown.id == "none") {
        tmp.forEach(x =>{ if (x.variableGridArray.id == item) x.parentTypeId = undefined });
      }
      this.gridArray =  tmp;

      this.control = false;
    }
    else {
      this.lastChoiceDropdown = item;
      this.control = true;
    }
    
  }

  shareDescriptorTable(data: Table) {
    this.dataTable = data;
  }

  notifyInputChanges(id) {
    this.gridArray.forEach(x => {if (x.variableGridArray.id == id){ x.variableGridArray.updated = true; } });

    setTimeout(() => {this.buttonSave = true;},0);
  }

  shareSelectionItem(data) {
    this.selectionWEAT = data;

    if (this.selectionWEAT.length > 0){
      setTimeout(() => {this.buttonDelete = true;},0);
    }
    else setTimeout(() => {this.buttonDelete = false;},0);
  }

  saveAllElement() {
    
    if (this.validArray(this.gridArray)){
      if (this.gridArray.filter(x => x.variableGridArray.id.includes("new")).length > 0) {
        this.gridArray.filter(x => x.variableGridArray.id.includes("new")).forEach(async (x) => await this.workEffortAssocTypeService.createWorkEffortAssocType(x).then(() =>{
          
          this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('New item added') + ' [' + x.workEffortAssocTypeId  + ']' }];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
        }
        )
        .catch((error) => {
          console.log('error', error);
          this.messagesError = [{ severity: 'error', summary: 'Error', detail: error +  ' [' + x.workEffortAssocTypeId  + ']' }];

        }));
        
      }

      if (this.gridArray.filter(x => x.variableGridArray.updated == true && !x.variableGridArray.id.includes("new")).length > 0) {
        this.gridArray.filter(x => x.variableGridArray.updated == true && !x.variableGridArray.id.includes("new")).forEach(async (x) => await this.workEffortAssocTypeService.updateWorkEffortAssocType(x)
        .then(() => {
        this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Update Confirmation') + ' [' + x.workEffortAssocTypeId  + ']'}];
        this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
          

      })
      .catch((error) => {
        console.log('error', error);
        this.messagesError = [{ severity: 'error', summary: 'Error', detail: error +  ' [' + x.workEffortAssocTypeId  + ']' }];

      }));
    }
    
    setTimeout(() =>{this.reload()}, 500);
  } else {
    this.messagesError = [{ severity: 'error', summary: 'Error',  detail: this.i18nService.translate('All mandatory fields must be filled in')  }];

  }
  
  }

  validArray(array: WorkEffortAssocType[]): boolean {
    
    return array.filter(x => x.workEffortAssocTypeId == "" || x.description == "").length == 0;
  }

  reload() {
    this.dropdownItemWEAT=[];
    setTimeout(() => {this.buttonSave = false;},0);
    setTimeout(() => {this.buttonDelete = false;},0);
    this._reload.next();
  }

  deleteRowSelected() {

    this.confirmationService.confirm({
      message: this.i18nService.translate('Are you sure you want to proceed with the deletion?'),
      header: this.i18nService.translate('Attention'),
      icon: 'pi pi-question',

      accept: () => {

        if (this.selectionWEAT.filter(x => x.variableGridArray.id.includes("new")).length > 0) {
          let newArray = this.selectionWEAT.filter(x => x.variableGridArray.id.includes("new"));
          this.selectionWEAT = this.selectionWEAT.filter(x => !newArray.includes(x));
        }
        if (this.selectionWEAT.length > 0){
          this.workEffortAssocTypeService.deleteWorkEffortAssocType(this.selectionWEAT.map(x => x.workEffortAssocTypeId))
          .then(() => {
            this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Delete confirmation') }];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
            setTimeout(() =>{this.reload()}, 500);
              
          })
          .catch((error) => {
            console.log('error', error.message);
            this.messagesError=[{ severity: 'error', summary: 'Error', detail: error.message }];
            setTimeout(() =>{this.reload()}, 500);
          });
        } else {
          this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Delete confirmation') }];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });

          setTimeout(() =>{this.reload()}, 500);
        }

            
      }
    });
  }
}
