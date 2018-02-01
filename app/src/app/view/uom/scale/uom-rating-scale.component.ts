import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { map, merge, switchMap } from 'rxjs/operators';

import { ConfirmDialogModule, ConfirmationService, TooltipModule } from 'primeng/primeng';

import { I18NService } from '../../../commons/i18n.service';
import { Message } from '../../../commons/message';
import { SelectItem } from '../../../commons/selectitem';
import { Uom } from '../uom/uom';
import { UomRatingScale } from './uom_rating_scale';
import { UomService } from '../../../api/uom.service';


const RATING_SCALE = 'RATING_SCALE';

@Component({
  selector: 'app-scale',
  templateUrl: './uom-rating-scale.component.html',
  styleUrls: ['./uom-rating-scale.component.css']
})

export class UomRatingScaleComponent implements OnInit {
  /** Error message from be*/
  error = '';
  /** Info message*/
  msgs: Message[] = [];

  uom: Uom;
  isRatingScale: boolean;
  uomRatingScales: UomRatingScale[];

  selectedUomId: string;

  displayDialog: boolean;
  uomRatingScale: UomRatingScale = new PrimeUomRatingScale();
  selectedUomRatingScale: UomRatingScale;
  newUomRatingScale: boolean;

  displayRangeScale: boolean;

  _reload: Subject<void>;

  form: FormGroup;

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
            'uomId': new FormControl(''),
            'description': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])),
            'uomRatingValue': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(18)]))
        });

    console.log('ngOnInit UomRatingScale ' + this.selectedUomId);
    let reloadedUomRatingScales = this._reload
      .switchMap(() => this.uomService.uomRatingScales(this.selectedUomId));;

    this.route.paramMap
      .switchMap((params) => {
        this.selectedUomId = params.get('id');
        return this.uomService.uom(this.selectedUomId);
      })
      .subscribe((data) => {
        this.uom = data;
        this.isRatingScale = (RATING_SCALE == data.uomType.uomTypeId);
        this._reload.next();
      });

    this.route.data.pipe(
      map((data: { uomRatingScales: UomRatingScale[] }) => data.uomRatingScales),
      merge(reloadedUomRatingScales)
    ).subscribe((data) => {
      if (data && data.length > 0) {
        this.uomRatingScales = data;
        this.displayRangeScale = true;
      } else {
        this.uomRatingScales = [];
        this.displayRangeScale = false;
      }
    });
  }

  showDialogToAdd() {
    // conviene in create e update
    // this.uomRatingScale.uomId = this.selectedUomId;
    this.error = '';
    this.newUomRatingScale = true;
    this.uomRatingScale = new PrimeUomRatingScale();
    this.uomRatingScale.uom = this.uom;
    this.displayDialog = true;
  }

  save() {
    // conviene in create e update
    this.uomRatingScale.uomId = this.selectedUomId;
    if (this.newUomRatingScale) {
      this.uomService
        .createUomRatingScale(this.uomRatingScale)
        .then(() => {
          this.uomRatingScale = null;
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
        .updateUomRatingScale(this.selectedUomRatingScale.uom.uomId, this.selectedUomRatingScale.uomRatingValue, this.uomRatingScale)
        .then(data => {
          this.uomRatingScale = null;
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

  delete() {
    this.uomService
    .deleteUomRatingScale(this.selectedUomRatingScale.uom.uomId, this.selectedUomRatingScale.uomRatingValue)
    .then(data => {
      this.uomRatingScale = null;
      this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Confirmed'), detail:this.i18nService.translate('Record deleted')}];
      this._reload.next();
    })
    .catch((error) => {
      console.log('error' , error.message);
      this.error = this.i18nService.translate(error.message) || error;
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
    for(let prop in uomRatingScale) {
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
        // return;
      },
      reject: () => {
          this.uomRatingScale = null;
          this.displayDialog = false;
          // return;
        }
    });
  }
}

class PrimeUomRatingScale implements UomRatingScale {
  constructor(public uomId?: string, public uom?: Uom, public uomRatingValue?: number, public description?: string) {}
}
