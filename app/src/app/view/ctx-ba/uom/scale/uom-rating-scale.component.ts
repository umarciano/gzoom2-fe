import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params, NavigationEnd } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { first, map, mergeMap, mergeWith, switchMap } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { I18NService } from '../../../../i18n/i18n.service';
import { Message } from '../../../../commons/model/message';
import { Uom } from '../uom/uom';
import { UomRatingScale } from './uom_rating_scale';
import { UomService } from '../../../../api/service/uom.service';
import { LanguageService } from 'app/api/service/language.service';
import { HeadArray, HeadFilter, ActionInput, ActionOutput } from 'app/layout/table/table-configuration';



const RATING_SCALE = 'RATING_SCALE';

@Component({
  selector: 'app-uom-rating-scale-component',
  templateUrl: './uom-rating-scale.component.html',
  styleUrls: ['./uom-rating-scale.component.css'],
  providers: [MessageService]
})

export class UomRatingScaleComponent implements OnInit {


  @Input() gridArray: any[] = [];
  @Input() selectedUom: Uom;

  /** Error message from be*/
  error = '';
  /** Info message*/
  msgs: Message[] = [];
  uom: Uom;
  isRatingScale: boolean;
  uomRatingScales: UomRatingScale[];
  selectedUomId: string;
  selecteduomRatingValue: string;
  displayDialog: boolean;
  uomRatingScale: UomRatingScale = new PrimeUomRatingScale();
  selectedUomRatingScale: UomRatingScale;
  newUomRatingScale: boolean = false;
  newUomRatingScaleDetailToAdd: UomRatingScale;
  displayRangeScale: boolean;
  _reload: Subject<void>;
  form: { [name: string]: FormGroup | FormControl | FormArray };
  isEdit: boolean;
  riRowTable: number;
  tempGridArray: any[] = [];
  uomToDelete: UomRatingScale;
  dataTable: any;
  editingKeyId: string;
  isDeleted: boolean = false;
  elementToAdd: any;
  selectedIndex: number;

  langType: string;
  languages: string[] = [];
  flag: boolean = false;


  /* ####### config for table component ########## */

  headArray: HeadArray[] = [
    { head: '', fieldName: 'idNumber', actionInput: ActionInput.null, actionOutput: ActionOutput.null, display: "none", filter: HeadFilter.null },
    { head: this.i18nService.translate('Uom Id'), fieldName: 'uomId', actionInput: ActionInput.null, actionOutput: ActionOutput.null, display: "none", filter: HeadFilter.null },
    { head: this.i18nService.translate('Uom Rating Value'), fieldName: 'uomRatingValue', actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelNumber, display: "table-cell", filter: HeadFilter.textFilter, width:'10rem', sortIcon:true },
    { head: this.i18nService.translate('Description'), fieldName: 'description', actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelData, display: "table-cell", filter: HeadFilter.textFilter, flag: true, sortIcon:true },
    { head: this.i18nService.translate('Description'), fieldName: 'descriptionLang', actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelData, display: "table-cell", filter: HeadFilter.textFilter,flag: true, sortIcon:true },
    { head: '', fieldName: 'null', actionInput: ActionInput.actionEditing, actionOutput: ActionOutput.null, display: "table-cell", filter: 'null' }];



  constructor(private readonly uomService: UomService,
    private readonly confirmationService: ConfirmationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly i18nService: I18NService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private languageService: LanguageService) {
    this._reload = new Subject<void>();
  }

  ngOnInit() {
    // Form Validator

    if(this.langType == 'BILING' || this.langType == 'REPORT'){
      this.form = {
        'idNumber': new FormControl(''),
        'id': new FormControl(''),
        'uomId': new FormControl(''),
        'descriptionLang': new FormControl('',Validators.compose([Validators.required, Validators.maxLength(255)])),
        'description': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
        'uomRatingValue': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(18)]))
      };
    }else{
      this.form = {
        'idNumber': new FormControl(''),
        'id': new FormControl(''),
        'uomId': new FormControl(''),
        'descriptionLang': new FormControl(''),
        'description': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
        'uomRatingValue': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(18)]))
      };
    }
    
    // Language control
    this.langType = this.i18nService.getLanguageType(); 
    this.languageService.language().subscribe(data => {
      this.languages = data;
      if(this.languages.length > 1 && this.langType !='NONE'){
        this.flag = true;
        this.headArray[3].pathIconFlag = this.languages[0];
        this.headArray[4].pathIconFlag = this.languages[1];
      };
    });


    this.route.paramMap.subscribe(paramMap => {
      this.selectedUomId = paramMap.get('uomId');

    });

    console.log('ngOnInit UomRatingScale ' + this.selectedUomId);

    const reloadedUoms = this._reload.pipe(mergeMap(() => this.uomService.uomRatingScales(this.selectedUomId)));

    const uomsRatingValueObs = this.route.data.pipe(
      map((data: { uomRatingScales: UomRatingScale[] }) => data.uomRatingScales),
      mergeWith(reloadedUoms)
    );

    uomsRatingValueObs.pipe(first()).subscribe(uomRatingScales => this.onRowSelect(uomRatingScales, 0));

    uomsRatingValueObs.subscribe((data) => {
      this.uomRatingScales = data;
      this.gridArray = [];
      data.forEach((element, index) => {
        this.gridArray.push({
          id: element.uomRatingValue,
          idNumber: index,
          uomId: element.uomId,
          descriptionLang: element.descriptionLang,
          description: element.description,
          uomRatingValue: element.uomRatingValue
        })
      })
    });

    this.langType = this.i18nService.getLanguageType();
    if(this.langType == 'NONE'){
      this.headArray[2].display = 'none';
    }

  }

  

  onRowSelect(uomRatingScales: UomRatingScale[], ri: number) {
    const uomRatingScale = uomRatingScales && uomRatingScales.length ? uomRatingScales[0] : null;
    if (uomRatingScale) {
      this.selectedIndex = ri;
      // this.router.navigate([uom.uomId], { relativeTo: this.route });
    } else {
      this.selectedIndex = -1;
    }
  }

  shareDescriptorTable(data) {
    this.dataTable = data;
  }

  save() {
    if (this.newUomRatingScale) {
      this.uomService
        .createUomRatingScale(this.selectedUomRatingScale)
        .then(() => {
          this.selectedUomRatingScale = null;
          this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Created'), detail: this.i18nService.translate('Record created') }];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
          this._reload.next();
        })
        .catch((error) => {
          console.log('error', error.message);
          this.error = this.i18nService.translate(error.message);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
          this._reload.next();
        });
    } else {
      this.uomService
        .updateUomRatingScale(this.selectedUomRatingScale)
        .then(data => {
          this.uomRatingScale = null;
          this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Updated'), detail: this.i18nService.translate('Record updated') }];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
          this._reload.next();
        })
        .catch((error) => {
          console.log('error', error.message);
          this.error = this.i18nService.translate(error.message);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
          this._reload.next();
        });
    }
  }

  delete() {
    this.uomService
      .deleteUomRatingScale(this.selectedUomRatingScale.uom.uomId, this.selectedUomRatingScale.uomRatingValue)
      .then(data => {
        this.uomRatingScale = null;
        this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Record deleted') }];
        this._reload.next();
      })
      .catch((error) => {
        console.log('error', error.message);
        this.error = this.i18nService.translate(error.message) || error;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
      });
  }

  selectUomRatingScale(data: UomRatingScale) {
    this.error = '';
    this.selectedUomRatingScale = data;
    this.newUomRatingScale = false;
    this.uomRatingScale = this.cloneUom(data);
    this.displayDialog = true;
  }

  cloneUom(u: UomRatingScale): UomRatingScale {
    let uomRatingScale = new PrimeUomRatingScale();
    for (let prop in uomRatingScale) {
      uomRatingScale[prop] = u[prop];
    }
    return uomRatingScale;
  }

  confirm() {
    this.confirmationService.confirm({
      message: this.i18nService.translate('Do you want to delete this record?'),
      header: this.i18nService.translate('Delete Confirmation'),
      icon: 'fa fa-trash-alt',
      accept: () => {
        this.delete();
        this.displayDialog = false;
      },
      reject: () => {
        this.uomRatingScale = null;
        this.displayDialog = false;
      }
    });
  }

  onRowDetailEditInit(riRow: number) {
    this.isEdit = true;
    this.riRowTable = riRow;
  }

  deleteDetailUomRow(array: any[]) {
    this.uomToDelete = array['form'];
    this.selectedUomRatingScale = this.uomToDelete;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + this.uomToDelete.description + '?',
      header: 'Confirm',
      icon: 'pi pi-times-circle',
      accept: () => {
        this.gridArray = this.gridArray.filter(val => val.description !== this.uomToDelete.description);
        this.uomService.deleteUomRatingScale(this.selectedUomId, this.selectedUomRatingScale.uomRatingValue)
          .then(data => {
            this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Record deleted') }];
            this.messageService.add({severity:'success', summary: 'Success', detail: this.msgs[0].detail});
            this._reload.next();
          })
          .catch((error) => {
            console.log('error', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: this.i18nService.translate('Error Record deleted') });
          });
      }
    });
  };

  onRowDetailEditCancel() {
    if (this.newUomRatingScale) {
      this.gridArray.splice(0, 1);
    }
    this.newUomRatingScale = false;
  }

  isInvalidForm(updateUom: UomRatingScale): boolean {
    if((this.langType == 'BILING' || this.langType == 'REPORT') && this.form['description'].valid && this.form['uomRatingValue'].valid && this.form['descriptionLang'].valid){
      return true;
    }else if(this.form['description'].valid && this.form['uomRatingValue'].valid){
      return true;
    }
    return false;
  }

  onRowDetailEditSave(updateUom: UomRatingScale) {
    if (this.isEdit) {
      this.selectedUomRatingScale = updateUom;
      if (this.isInvalidForm(updateUom)) {
        this.save();
      }
      else {
        this.editingKeyId = updateUom.uomRatingValue.toString();
        this.dataTable.editingRowKeys = { [this.editingKeyId]: false };
        this.msgs = [{ severity: this.i18nService.translate('error'), summary: this.i18nService.translate('Error'), detail: this.i18nService.translate('Insert Fail') }];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.msgs[0].detail });
      }
      this.isEdit = false;
    }
    else if (this.newUomRatingScale) {

      if (this.isInvalidForm(updateUom)) {
        this.selectedUomRatingScale.uomId = this.selectedUomId;
        this.selectedUomRatingScale.descriptionLang = updateUom.descriptionLang;
        this.selectedUomRatingScale.description = updateUom.description;
        this.selectedUomRatingScale.uomRatingValue = updateUom.uomRatingValue;
        this.save();
        this.refreshGridArray(updateUom);
      }
      else {
        this.gridArray.splice(0, 1);
        this.msgs = [{ severity: this.i18nService.translate('error'), summary: this.i18nService.translate('Error'), detail: this.i18nService.translate('Insert Fail') }];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.msgs[0].detail });
      }
      this.newUomRatingScale = false;
    }
  }

  openNewDetail() {
    this.newUomRatingScale = true;
    this.newUomRatingScaleDetailToAdd = {
      uomId: this.selectedUomId,
      descriptionLang: '',
      description: '',
      uomRatingValue: null,
    };

    this.editingKeyId = 'new' + Math.random();
    this.elementToAdd = { id: this.editingKeyId, value: { ...this.newUomRatingScaleDetailToAdd }, buttonDetails: false };
    this.gridArray = [this.elementToAdd, ...this.gridArray]
    this.selectedUomRatingScale = this.newUomRatingScaleDetailToAdd;
  }

  refreshGridArray(uomRatingScale: UomRatingScale) {
    if (this.newUomRatingScale) {
      this.gridArray[0].id = uomRatingScale.uomRatingValue;
      this.gridArray[0].uomId = uomRatingScale.uomId;
      this.gridArray[0].descriptionLang = uomRatingScale.descriptionLang;
      this.gridArray[0].description = uomRatingScale.description;
      this.gridArray[0].uomRatingValue = uomRatingScale.uomRatingValue;
      this.ngOnInit();
      this.newUomRatingScale = false;
    }
    this.newUomRatingScale = false;
  };

  isAllDeleted() {
    return (this.uomRatingScales.length === 0 ? true : false);
  }



}

class PrimeUomRatingScale implements UomRatingScale {
  constructor(public uomId?: string, public uom?: Uom, public uomRatingValue?: number, public description?: string, public descriptionLang?: string) { }
}
