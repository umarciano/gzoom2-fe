import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { Observable ,  Subject } from 'rxjs';
import { first, map, merge, mergeMap } from 'rxjs/operators';

import { ConfirmDialogModule, ConfirmationService, SpinnerModule, TooltipModule } from 'primeng/primeng';

import { SelectItem } from '../../../commons/selectitem';
import { Message } from '../../../commons/message';
import { I18NService } from '../../../commons/i18n.service';
import { Uom } from './uom';
import { UomRatingScale } from '../scale/uom_rating_scale';
import { UomType } from '../uom-type/uom_type';
import { UomService } from '../../../api/uom.service';


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
  _reload: Subject<void>;
  /** Default uomTypeId in Select*/
  defaultUomType: UomType;
  displayDialog: boolean;
  /** Error message from be*/
  error = '';
  form: FormGroup;
  /** Info message in Toast*/
  msgs: Message[] = [];
  /** whether create or update */
  newUom: boolean = false;
  /** Row index selected for uomRatingScale*/
  selectedIndex = -1;
  /** Selected uom in Dialog*/
  selectedUom: Uom;
  /** Selected uomTypeId in Select*/
  selectedUomTypeId: string;
  /** Uom to save*/
  uom: Uom = new PrimeUom();
  /** List of Uom */
  uoms: Uom[];
  /** List of UomType in Select */
  uomTypeSelectItem: SelectItem[] = [];

  constructor(private readonly uomService: UomService,
              private readonly confirmationService: ConfirmationService,
              private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly i18nService: I18NService,
              private fb: FormBuilder) {
    // remember that a subject is also an observable seen from the consumer side
    // instanzio un subject che e' un observable che posso controllare            
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
    const reloadedUomTypes = this._reload.pipe(mergeMap(() => this.uomService.uomTypes()));
    const reloadedUoms = this._reload.pipe(mergeMap(() => this.uomService.uoms()));

    // mergeMap e' il flatMap di un array
    // invece switchMap, a differenza di mergeMap chiude anche la sottoscrizione al primo observable di partenza
    // quindi dopo il primo valore chiude e non avrai piu la sottoscrizione a quell'observable
    
    // Qui ho 2 observe e li unisco

    const uomTypesObs = this.route.data.pipe(
      map((data: { uomTypes: UomType[] }) => data.uomTypes),
      merge(reloadedUomTypes)
    );

    uomTypesObs.pipe(first()).subscribe(uomTypes => this.defaultUomType = uomTypes[0]);

    uomTypesObs.pipe(
      map(uomTypes2SelectItems)
    ).subscribe((data) => {
      this.uomTypeSelectItem = data;
      this.uomTypeSelectItem.push({label: this.i18nService.translate('Select Uom Type'), value:null});
    });

    const uomsObs = this.route.data.pipe(
      map((data: { uoms: Uom[] }) => data.uoms),
      merge(reloadedUoms)
    );
      
    uomsObs.pipe(first()).subscribe(uoms => this.onRowSelect(uoms, 0));

    uomsObs.subscribe((data) => {
      this.uoms = data;
    });
  }

  confirm() {
    this.confirmationService.confirm({
      message: this.i18nService.translate('Do you want to delete this record?'),
      header: this.i18nService.translate('Delete Confirmation'),
      icon: 'fa fa-question-circle',
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
    const uom = new PrimeUom();
    for (const prop in uom) {
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
