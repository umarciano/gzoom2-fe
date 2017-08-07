import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators,FormControl,FormGroup,FormBuilder } from '@angular/forms';

import { ConfirmDialogModule, ConfirmationService, SpinnerModule } from 'primeng/primeng';
import { SelectItem } from '../../../commons/selectitem';
import { Message } from '../../../commons/message';
import { I18NService } from '../../../commons/i18n.service';

import { Uom } from './uom';
import { UomRatingScale } from '../scale/uom_rating_scale';
import { UomType } from '../uom-type/uom_type';
import { UomService } from '../../../api/uom.service';

import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/switchMap';

/** Convert from UomType[] to SelectItem[] */
function uomTypes2SelectItems(types: UomType[]): SelectItem[] {
    return types.map((ut:UomType) => {
      return {label: ut.description, value: ut.uomTypeId};
    });
}

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.css']
})

export class UomComponent implements OnInit {
  /** Error message from be*/
  error = '';
  /** Info message*/
  msgs: Message[] = [];

  uoms: Uom[];

  defaultUomType: UomType;
  uomTypeSelectItem: SelectItem[] = [];
  selectedUomTypeId: string;

  displayDialog: boolean;
  uom: Uom = new PrimeUom();
  selectedUom: Uom;
  newUom: boolean;
  _reload: Subject<void>;

  userform: FormGroup;
  form: FormGroup;

  selectedIndex = -1;

  constructor(private readonly uomService: UomService,
              private readonly confirmationService: ConfirmationService,
              private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly i18nService: I18NService,
              private fb: FormBuilder) {
    this._reload = new Subject<void>();
  }

  ngOnInit() {
    // Form Validator
    this.form = this.fb.group({
            'uomTypeId': new FormControl('', Validators.required),
            'uomId': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
            'description': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
            'abbreviation': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(60)])),
            'decimalScale': new FormControl('', Validators.required),
            'maxValue': new FormControl(''),
            'minValue': new FormControl('')
        });

    // Manage Reload
    const reloadedUomTypes = this._reload.switchMap(() => this.uomService.uomTypes());
    const reloadedUoms = this._reload.switchMap(() => this.uomService.uoms());

    const uomTypesObs = this.route.data
      .map((data: { uomTypes: UomType[] }) => data.uomTypes)
      .merge(reloadedUomTypes);

    uomTypesObs.first().subscribe(uomTypes => this.defaultUomType = uomTypes[0]);

    uomTypesObs
      .map(uomTypes2SelectItems)
      .subscribe((data) => {
        this.uomTypeSelectItem = data;
        this.uomTypeSelectItem.push({label: this.i18nService.translate('Select Uom Type'), value:null});
      });

    const uomsObs = this.route.data
      .map((data: { uoms: Uom[] }) => data.uoms)
      .merge(reloadedUoms);

      uomsObs.first().subscribe(uoms => this.onRowSelect(uoms, 0));

      uomsObs.subscribe((data) => {
        this.uoms = data;
      });
  }

  confirm() {
    this.confirmationService.confirm({
      message: this.i18nService.translate('Do you want to delete this record?'),
      header: this.i18nService.translate('Delete Confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.displayDialog = false;
        this._delete();
      },
      reject: () => {
          this.uom = null;
          this.displayDialog = false;
        }
    });
  }

  onRowSelect(uoms: Uom[], ri: number) {
    const uom = uoms && uoms.length ? uoms[0] : null;
    if (uom) {
      this.selectedIndex = ri;
      this.router.navigate([uom.uomId], { relativeTo: this.route });
    } else {
      this.selectedIndex = -1;
    }
  }

  save() {
    // In create and update service uomTypeId = uom.uomTypeId
    this.uom.uomTypeId = this.selectedUomTypeId;
    if (this.newUom) {
      this.uomService
        .createUom(this.uom)
        .then(() => {
          this.uom = null;
          this.displayDialog = false;
          this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Created'), detail:this.i18nService.translate('Record created')}];
          this._reload.next();
        })
        .catch((error) => {
          console.log('error' , error.message);
          this.error = this.i18nService.translate(error.message) || error;
        });
    } else {
      this.uomService
        .updateUom(this.selectedUom.uomId, this.uom)
        .then(data => {
          this.uom = null;
          this.displayDialog = false;
          this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Updated'), detail:this.i18nService.translate('Record updated')}];
          this._reload.next();
        })
        .catch((error) => {
          console.log('error' , error.message);
          this.error = this.i18nService.translate(error.message) || error;
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
    let uom = new PrimeUom();
    for(let prop in uom) {
      uom[prop] = u[prop];
    }
    return uom;
  }

  _delete() {
    this.uomService
    .deleteUom(this.selectedUom.uomId)
    .then(data => {
      this.uom = null;
      this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Confirmed'), detail:this.i18nService.translate('Record deleted')}];
      this._reload.next();
    })
    .catch((error) => {
      console.log('error' , error.message);
      this.error = this.i18nService.translate(error.message) || error;
    });
  }


}

class PrimeUom implements Uom {
  constructor(public uomId?: string, public uomTypeId?: string, public uomType?: UomType, public abbreviation?: string, public description?: string,
              public decimalScale?: number, public minValue?: number, public maxValue?: number) {}
}
