import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, mergeWith, switchMap } from 'rxjs/operators';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { I18NService } from '../../../../i18n/i18n.service';
import { Message } from '../../../../commons/model/message';
import { UomType } from './uom_type';
import { UomService } from '../../../../api/service/uom.service';
import { HeadArray,HeadFilter, ActionInput, ActionOutput } from 'app/layout/table/table-configuration';

@Component({
  selector: 'app-uom-type',
  templateUrl: './uom-type.component.html',
  styleUrls: ['./uom-type.component.scss']
})

export class UomTypeComponent implements OnInit {
  _reload: Subject<void>;
  displayDialog: boolean;
  /** Error message from be*/
  error = '';
  form: { [name: string]: FormGroup | FormControl | FormArray };
  /** Info message in Toast*/
  msgs: Message[] = [];
  /** whether create or update */
  newUomType: boolean;
  /** whether create or update */
  newUomTypeToAdd: UomType;
  updateUomType: UomType;
  /** temporal id for create Uom type */
  editingKeyId: string;
  /** Selected uomType in Dialog*/
  selectedUomType: UomType;
  /** Grid with row of the table*/
  gridArray: UomType[] = [];
  /** Descriptor of the table*/
  dataTable: any;
  /** Header of the table*/
  headArray: HeadArray[] = [
    { head: '', fieldName: 'id', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, display: "none", filter: HeadFilter.null },
    { head: this.i18nService.translate('Uom Type Id'), fieldName: 'uomTypeId', actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelData, display: "table-cell", filter: HeadFilter.dropdownFilter, width: "30rem" },
    { head: this.i18nService.translate('description'), fieldName: 'description', actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelData, display: "table-cell", filter: HeadFilter.textFilter, flag: true },
    { head: '', fieldName: 'null', actionInput: ActionInput.actionEditing, actionOutput: ActionOutput.null, display: "table-cell", filter: HeadFilter.null },
    { head: '', fieldName: 'null', actionInput: ActionInput.actionDetails, actionOutput: ActionOutput.null, display: "table-cell", filter: HeadFilter.null }];

  constructor(private readonly uomService: UomService,
    private readonly confirmationService: ConfirmationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private messageService: MessageService,
    private readonly i18nService: I18NService,
    private fb: FormBuilder) {
    this._reload = new Subject<void>();
  }

  ngOnInit() {
    // Form Validator
    this.form = {
      'id': new FormControl(''),
      'uomTypeId': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
      'description': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
      'buttonDetails': new FormControl('')
    };

    const reloadedUomTypes = this._reload.pipe(switchMap(() => this.uomService.uomTypes()));

    this.route.data.pipe(
      map((data: { uomTypes: UomType[] }) => data.uomTypes),
      mergeWith(reloadedUomTypes)
    ).subscribe(data => {
      this.gridArray = [];
      data.forEach((element, index) => {
        this.gridArray.push({
          id: element.uomTypeId,
          uomTypeId: element.uomTypeId,
          description: element.description,
          buttonDetails: false
        })
      })
    });
  }

  shareDescriptorTable(data) {
    this.dataTable = data;
  }

  deleteRow(item, riRow) {
    this.confirmationService.confirm({
      message: this.i18nService.translate('Are you sure you want to delete') + " " + item.index + '?',
      header: this.i18nService.translate('Delete Confirmation'),
      icon: 'pi pi-question',
      accept: () => {
        this.uomService
          .deleteUomType(item.index)
          .then(data => {
            this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Record deleted') }];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
            this._reload.next();
          })
          .catch((error) => {
            console.log('error', error.message);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
            this._reload.next();
          });
      }
    });
  }

  onRowEditSave(item: UomType) {    
    if(this.newUomType){
      this.newUomTypeToAdd.description = item.description;
      this.newUomTypeToAdd.id = item.uomTypeId;
      this.newUomTypeToAdd.uomTypeId = item.uomTypeId;
      this.save();
    }else{
      this.updateUomType = {... item};     
      this.save(); 
    }
  }

  onRowEditCancel(id, riRow) {
    this.newUomType = false;
    this._reload.next()
  }

  openNew() {
    this.newUomType = true;
    this.editingKeyId = 'new' + Math.random();
    this.newUomTypeToAdd = {
      id: this.editingKeyId,
      uomTypeId: "",
      description: "",
      buttonDetails: false
    };
    this.gridArray = [this.newUomTypeToAdd, ...this.gridArray];
  }

  save(): void {
    if (this.newUomType) {
      this.uomService
        .createUomType(this.newUomTypeToAdd)
        .then(() => {
          this.newUomTypeToAdd = null;
          this.messageService.add({ severity: 'success', summary: 'success', detail: this.i18nService.translate('Record created') });
          this._reload.next();
        })
        .catch((error) => {
          this.newUomTypeToAdd = null;
          console.log('error', error.message);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
          this._reload.next();
        });
        this.newUomType = false;
    } else {
      this.uomService
        .updateUomType(this.updateUomType.id, this.updateUomType)
        .then(data => {
          this.updateUomType = null;
          this.messageService.add({ severity: 'success', summary: 'success', detail: this.i18nService.translate('Record updated') });
          this._reload.next();
        })
        .catch((error) => {
          this.editingKeyId = this.updateUomType.id;
          this.updateUomType = null;
          console.log('error', error.message);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
          this.dataTable.editingRowKeys = { [this.editingKeyId]: false };
          this._reload.next();
        });
    }
  }
}

class PrimeUomType implements UomType {
  constructor(public uomTypeId?: string, public description?: string) { }
}
