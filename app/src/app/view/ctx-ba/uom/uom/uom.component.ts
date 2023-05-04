import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { first, map, mergeMap, mergeWith } from 'rxjs/operators';
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { SelectItem } from '../../../../commons/model/selectitem';
import { Message } from '../../../../commons/model/message';
import { I18NService } from '../../../../i18n/i18n.service';
import { Uom } from './uom';
import { UomType } from '../uom-type/uom_type';
import { UomService } from '../../../../api/service/uom.service';
import { LanguageService } from '../../../../api/service/language.service';
import { HeadArray, HeadFilter, ActionInput, ActionOutput } from 'app/layout/table/table-configuration';

/** Convert from UomType[] to SelectItem[] */
function uomTypes2SelectItems(types: UomType[]): SelectItem[] {
  return types.map((ut: UomType) => {
    return { label: ut.description, value: ut.uomTypeId };
  });
}

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.css'],
  providers: [MessageService]
})

export class UomComponent implements OnInit {
  _reload: Subject<void>;
  defaultUomType: UomType;
  displayDialog: boolean;
  detailsDialog: boolean;
  error = '';
  form: { [name: string]: FormGroup | FormControl | FormArray };
  msgs: Message[] = [];
  newUom: boolean = false;
  isEdit: boolean = false;
  isDeleted: boolean = false;
  selectedIndex = -1;
  selectedUom: Uom;
  selectedUomTypeId: string;
  uom: Uom = new PrimeUom();
  uoms: Uom[];
  uomTypeSelectItem: SelectItem[] = [];
  newUomToAdd: Uom;
  uomTypeIds: any[] = [];
  uomTypeIdsDescription: any[] = [];
  itemsButtonSlideMenu: MenuItem[];
  gridArray: any[] = [];
  tempGridArray: any[] = [];
  first = 0;
  rows = 10;
  idTable: string;
  uomRatingScales: any[] = [];
  uomToDelete: Uom;
  errorString = ""
  editingKeyId: string;
  elementToAdd: any;
  IsInvalidUpdate: boolean = false;
  dataTable: any;
  langType: string;
  languages: string[] = [];
  flag: boolean = false;

  /* ####### config for table component ########## */

  headArray: HeadArray[] = [
    { head: '', fieldName: 'idNumber', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, display: "none", filter: "null" },
    { head: this.i18nService.translate('Uom Type Id'), fieldName: 'uomType', actionInput: ActionInput.dropdownData, actionOutput: ActionOutput.outputLabelData, display: "table-cell", filter: HeadFilter.dropdownFilter, sortIcon:true },
    { head: this.i18nService.translate('Uom Id'), fieldName: 'uomId', actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelData, display: "table-cell", filter: HeadFilter.textFilter, sortIcon:true },
    { head: this.i18nService.translate('Description'), fieldName: 'description', actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelData, display: "table-cell", filter: HeadFilter.textFilter, flag: true, sortIcon:true },
    { head: this.i18nService.translate('Description'), fieldName: 'descriptionLang', actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelData, display: "table-cell", filter: HeadFilter.textFilter, flag: true, sortIcon:true },
    { head: this.i18nService.translate('Abbreviation'), fieldName: 'abbreviation', actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelData, display: "table-cell", filter: HeadFilter.textFilter, flag: true, sortIcon:true },
    { head: this.i18nService.translate('Abbreviation'), fieldName: 'abbreviationLang', actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelData, display: "table-cell", filter: HeadFilter.textFilter, flag: true, sortIcon:true },
    { head: this.i18nService.translate('Decimal Scale'), fieldName: 'decimalScale', actionInput: ActionInput.inputLabelNumber, actionOutput: ActionOutput.outputLabelNumber, display: "table-cell", filter: HeadFilter.popUpFilter, width: '1.5em' },
    { head: this.i18nService.translate('Minimum Value'), fieldName: 'minValue', actionInput: ActionInput.inputLabelNumber, actionOutput: ActionOutput.outputLabelNumber, display: "table-cell", filter: HeadFilter.popUpFilter, width: '1.5em' },
    { head: this.i18nService.translate('Maximum Value'), fieldName: 'maxValue', actionInput: ActionInput.inputLabelNumber, actionOutput: ActionOutput.outputLabelNumber, display: "table-cell", filter: HeadFilter.popUpFilter, width: '1.5em' },
    { head: '', fieldName: 'null', actionInput: ActionInput.actionEditing, actionOutput: ActionOutput.null, display: "table-cell", filter: "globalFilter" },
    { head: '', fieldName: 'null', actionInput: ActionInput.actionDetails, actionOutput: ActionOutput.null, display: "table-cell", filter: "null" }];

  filterArray = ['uomType', 'uomId', 'description', 'descriptionLang', 'abbreviation', 'abbreviationLang', 'decimalScale', 'minValue', 'maxValue'];

  constructor(private readonly uomService: UomService,
    private readonly confirmationService: ConfirmationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly i18nService: I18NService,
    private messageService: MessageService,
    private languageService: LanguageService) {
    this._reload = new Subject<void>();
  }

  ngOnInit() {

    this.collapseSidebar();

    // Form Validator
    if (this.langType == 'BILING' || this.langType == 'REPORT') {
      this.form = {
        'idNumber': new FormControl(''),
        'id': new FormControl(''),
        'uomTypeId': new FormControl(''),
        'uomType': new FormControl(''),
        'uomId': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
        'description': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
        'descriptionLang': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
        'abbreviation': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(60)])),
        'abbreviationLang': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(60)])),
        'decimalScale': new FormControl('', Validators.required),
        'maxValue': new FormControl(''),
        'minValue': new FormControl('')
      };
    } else {
      this.form = {
        'idNumber': new FormControl(''),
        'id': new FormControl(''),
        'uomTypeId': new FormControl('', Validators.required),
        'uomType': new FormControl('', Validators.required),
        'uomId': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
        'description': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
        'descriptionLang': new FormControl(''),
        'abbreviation': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(60)])),
        'abbreviationLang': new FormControl(''),
        'decimalScale': new FormControl('', Validators.required),
        'maxValue': new FormControl(''),
        'minValue': new FormControl(''),
        'buttonDetails': new FormControl(''),
      };
    }

    // Language control
    this.langType = this.i18nService.getLanguageType();
    this.languageService.language().subscribe(data => {
      this.languages = data;
            
      if (this.languages.length > 1 && this.langType != 'NONE') {
        this.flag = true;
        this.headArray[3].pathIconFlag = this.languages[0];
        this.headArray[5].pathIconFlag = this.languages[0];
        this.headArray[4].pathIconFlag = this.languages[1];
        this.headArray[6].pathIconFlag = this.languages[1];
      };
    });


    // Manage Reload
    const reloadedUomTypes = this._reload.pipe(mergeMap(() => this.uomService.uomTypes()));
    const reloadedUoms = this._reload.pipe(mergeMap(() => this.uomService.uoms()));

    const uomTypesObs = this.route.data.pipe(
      map((data: { uomTypes: UomType[] }) => data.uomTypes),
      mergeWith(reloadedUomTypes)
    );

    uomTypesObs.pipe(first()).subscribe(uomTypes => this.defaultUomType = uomTypes[0]);

    uomTypesObs.pipe(
      map(uomTypes2SelectItems)
    ).subscribe((data) => {
      this.uomTypeSelectItem = data;
      this.uomTypeSelectItem.push({ label: this.i18nService.translate('Select Uom Type'), value: null });
    });

    const uomsObs = this.route.data.pipe(
      map((data: { uoms: Uom[] }) => data.uoms),
      mergeWith(reloadedUoms)
    );

    uomsObs.pipe(first()).subscribe(uoms => this.onRowSelect(uoms, 0));

    uomsObs.subscribe((data) => {
      this.uoms = data;
      this.gridArray = [];
      data.forEach((element, index) => {
        this.gridArray.push({
          id: element.uomId,
          idNumber: index,
          uomTypeId: element.uomTypeId,
          uomType: element.uomType['description'],
          uomId: element.uomId,
          description: element.description,
          descriptionLang: element.descriptionLang,
          abbreviation: element.abbreviation,
          abbreviationLang: element.abbreviationLang,
          decimalScale: element.decimalScale,
          maxValue: element.maxValue,
          minValue: element.minValue,
          buttonDetails: element.uomTypeId == 'RATING_SCALE'
        })
      })
    });

    uomTypesObs.subscribe((data) => {
      data.forEach((element, index) => {
        this.uomTypeIds.pop();
      });

      data.forEach((element, index) => {
        this.uomTypeIds = [{ label: element.description, value: element.description }, ...this.uomTypeIds];
        this.uomTypeIdsDescription = [{ label: element.description, value: element.uomTypeId }, ...this.uomTypeIdsDescription];
      });
    });

    this.itemsButtonSlideMenu = [
      {
        label: 'Rating Scales',
        icon: 'pi pi-search',
        command: () => this.onRowDetail()
      }
    ];


    if (this.langType == 'NONE') {
      this.headArray[3].display = 'none';
      this.headArray[5].display = 'none';
    }
  }

  onRowSelect(uoms: Uom[], ri: number) {
    const uom = uoms && uoms.length ? uoms[0] : null;
    if (uom) {
      this.selectedIndex = ri;
    } else {
      this.selectedIndex = -1;
    }
  }

  save() {
    if (this.newUom) {
      console.log(this.uom);

      this.uomService
        .createUom(this.uom)
        .then(() => {
          this.uom = null;
          this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Created'), detail: this.i18nService.translate('Record created') }];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
          this._reload.next();
        })
        .catch((error) => {
          console.log('error', error);
          this.error = this.i18nService.translate(error.error.message);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
          this._reload.next();
        });
    } else {
      this.uomService
        .updateUom(this.selectedUom.uomId, this.uom)
        .then(data => {
          this.uom = null;
          this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Updated'), detail: this.i18nService.translate('Record updated') }];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
          this._reload.next();
        })
        .catch((error) => {
          console.log('error', error);
          this.error = this.i18nService.translate(error.error.message);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
          this.IsInvalidUpdate = true;
          this._reload.next();
        });
    }
  }

  selectUom(data: Uom) {
    this.error = '';
    this.selectedUom = data;
    this.newUom = false;
    this.uom = this._cloneUom(data);
    this.selectedUomTypeId = data.uomType.uomTypeId;
    this.displayDialog = true;
  }

  showDialogToAdd() {
    this.error = '';
    this.selectedUomTypeId = this.defaultUomType.uomTypeId;
    this.newUom = true;
    this.uom = new PrimeUom();
    this.displayDialog = true;
  }

  _cloneUom(u: Uom): Uom {
    const uom = new PrimeUom();
    for (const prop in uom) {
      uom[prop] = u[prop];
    }
    return uom;
  }

  shareDescriptorTable(data) {
    this.dataTable = data;
  }

  onRowEditInit(idTable: string) {
    this.isEdit = true;
    this.idTable = idTable;
    this.tempGridArray = [];
    this.tempGridArray = this.gridArray;
  }

  openNew() {

    this.uom = {};
    this.newUom = true;
    this.newUomToAdd = {
      uomTypeId: "",
      uomId: "",
      uomType: this.defaultUomType,
      abbreviation: "",
      abbreviationLang: "",
      description: "",
      descriptionLang: "",
      decimalScale: 0,
      minValue: 0,
      maxValue: 0
    };
    this.editingKeyId = 'new' + Math.random();
    this.elementToAdd = { id: this.editingKeyId, value: { ...this.newUomToAdd }, buttonDetails: false };
    this.gridArray = [this.elementToAdd, ...this.gridArray]
    this.uoms = [this.newUomToAdd, ...this.uoms];
    this.selectedUomTypeId = this.newUomToAdd.uomTypeId;
  }

  isInvalidForm(updateUom: Uom): boolean {

    if ((this.langType == 'BILING' || this.langType == 'REPORT') && this.form['uomType'].valid && this.form['uomId'].valid && this.form['description'].valid && this.form['descriptionLang'].valid && this.form['abbreviation'].valid && this.form['abbreviationLang'].valid && this.form['decimalScale'].valid) {
      return true;
    } else if (this.form['uomType'].valid && this.form['uomId'].valid && this.form['description'].valid && this.form['abbreviation'].valid && this.form['decimalScale'].valid) {
      return true;
    }
    return false;
  }

  onRowEditSave(updateUom: Uom) {
    if (this.isEdit) {
      this.uom = updateUom;
      this.selectedUom = updateUom;
      this.uomTypeIdsDescription.forEach((element) => {
        if (this.uom.uomType == element.label) { this.uom.uomTypeId = element.value };
      })

      if (this.isInvalidForm(updateUom)) {
        this.save()
      }
      else {
        this.editingKeyId = updateUom.uomId;
        this.dataTable.editingRowKeys = { [this.editingKeyId]: false };
        this.msgs = [{ severity: this.i18nService.translate('error'), summary: this.i18nService.translate('Error'), detail: this.i18nService.translate('Insert Fail') }];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.msgs[0].detail });
      }
      this.isEdit = false;
    }
    else if (this.newUom) {
      this.uom = updateUom;
      this.selectedUom = updateUom;
      this.uomTypeIdsDescription.forEach((element) => {
        if (this.uom.uomType == element.label) { this.uom.uomTypeId = element.value; };
      })
      if (this.isInvalidForm(updateUom)) {
        this.save();
        this.refreshGridArray(updateUom);
      }
      else {
        this.gridArray.splice(0, 1);
        this.msgs = [{ severity: this.i18nService.translate('error'), summary: this.i18nService.translate('Error'), detail: this.i18nService.translate('Insert Fail') }];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.msgs[0].detail });
      }
      this.newUom = false;
    }
    this.form.reset;

  }

  onRowEditCancel(id: number) {
    if (this.newUom) {
      this.gridArray.splice(id, 1);
      this.newUom = false;
      this.isEdit = false;
      this.isDeleted = true;
      this.refreshGridArray(null);
    }
    this.newUom = false;
    this.isEdit = false;
  }

  deleteUomRow(array: any[]) {
    this.uomToDelete = array['form'];
    this.confirmationService.confirm({
      message: this.i18nService.translate('Are you sure you want to delete') + " " + this.uomToDelete.abbreviation + '?',
      header: this.i18nService.translate('Delete Confirmation'),
      icon: 'pi pi-question',
      accept: () => {
        this.uoms = this.uoms.filter(val => val.uomId !== this.uomToDelete.uomId);
        this.selectedUom = this.uomToDelete;
        this.uomService
          .deleteUom(this.selectedUom.uomId)
          .then(data => {
            this.uom = null;
            this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Record deleted') }];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
            this._reload.next();
          })
          .catch((error) => {
            console.log('error', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
          });
        this.gridArray.splice(array['index'], 1);
        this.isDeleted = true;
        this.refreshGridArray(null);
      }
    });
  }

  onRowDetail() {
    this.uoms.forEach((element, index) => {
      if (element.uomId == this.idTable) {
        this.selectedUom = this.uoms[index];
      }
    })
    this.router.navigate([`${this.selectedUom.uomId}`], { relativeTo: this.route });
  }

  updateRiRow(temp) {
    this.idTable = temp['id'];
  }

  updateGridArrayFilterDropdown(dataArray: any[]) {
    this.gridArray = dataArray;
  }

  refreshGridArray(uom: Uom) {
    if (this.newUom) {
      this.gridArray[0].id = uom.uomId;
      this.gridArray[0].uomTypeId = uom.uomTypeId;
      this.gridArray[0].uomId = uom.uomId;
      this.gridArray[0].description = uom.description;
      this.gridArray[0].descriptionLang = uom.descriptionLang;
      this.gridArray[0].abbreviationLang = uom.abbreviationLang;
      this.gridArray[0].abbreviation = uom.abbreviation;
      this.gridArray[0].decimalScale = uom.decimalScale;
      this.gridArray[0].minValue = uom.minValue;
      this.gridArray[0].maxValue = uom.maxValue;
      this.gridArray.forEach((element, index) => {
        element.idNumber = index;
      })
      this.newUom = false;
    } else if (this.isDeleted) {
      this.ngOnInit()
      this.isDeleted = false;
    } else if (this.IsInvalidUpdate) {
      this.ngOnInit()
      this.IsInvalidUpdate = false;
    }
  };


  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.uoms ? this.first === (this.uoms.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.uoms ? this.first === 0 : true;
  }

  onReject() {
    this.messageService.clear('c');
  }

  collapseSidebar() {
    const dom: any = document.querySelector('body');
    const menu: any = document.querySelector('#sidebar');
    dom.classList.add('push-right');
    menu.classList.add('collapse');
  }

}

class PrimeUom implements Uom {
  constructor(public uomId?: string, public uomTypeId?: string, public uomType?: UomType, public abbreviation?: string, public description?: string, public descriptionLang?: string, public abbreviationLang?: string,
    public decimalScale?: number, public minValue?: number, public maxValue?: number) { }
}
