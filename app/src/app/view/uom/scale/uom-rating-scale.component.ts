import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Uom } from '../uom/uom';
import { UomRatingScale } from './uom_rating_scale';
import { UomService } from '../../../api/uom.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { SelectItem } from '../../../commons/selectitem';
import { Message } from '../../../commons/message';
import { isDefined as _isDefined } from '../../../commons/commons';
import { isBlank } from '../../../commons/commons';

const RATING_SCALE = 'RATING_SCALE';

@Component({
  selector: 'app-scale',
  templateUrl: './uom-rating-scale.component.html',
  styleUrls: ['./uom-rating-scale.component.css']
})

export class UomRatingScaleComponent implements OnInit {


  error = '';
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


  constructor(private readonly uomService: UomService,
              private readonly confirmationService: ConfirmationService,
              private readonly route: ActivatedRoute,
              private readonly router: Router) {
    this._reload = new Subject<void>();
  }


  ngOnInit() {
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

    this.route.data
      .map((data: { uomRatingScales: UomRatingScale[] }) => data.uomRatingScales)
      .merge(reloadedUomRatingScales)
      .subscribe((data) => {
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
    console.log(" - selectedUomId " + this.selectedUomId);
    // conviene in create e update
    this.uomRatingScale.uomId = this.selectedUomId;
    if (this.newUomRatingScale) {
      this.uomService
        .createUomRatingScale(this.uomRatingScale)
        .then(() => {
          this.uomRatingScale = null;
          this.displayDialog = false;
          this.msgs = [{severity:'info', summary:'Created', detail:'Record created'}];
          this._reload.next();
        })
        .catch((error) => {
          console.log('error' , error.message);
          this.error = error.message || error;
        });
    } else {
      this.uomService
        .updateUomRatingScale(this.selectedUomRatingScale.uom.uomId, this.selectedUomRatingScale.uomRatingValue, this.uomRatingScale)
        .then(data => {
          this.uomRatingScale = null;
          this.displayDialog = false;
          this.msgs = [{severity:'info', summary:'Updated', detail:'Record updated'}];
          this._reload.next();
        })
        .catch((error) => {
          console.log('error' , error.message);
          this.error = error.message || error;
        });
    }
  }

  delete() {
    this.uomService
    .deleteUomRatingScale(this.selectedUomRatingScale.uom.uomId, this.selectedUomRatingScale.uomRatingValue)
    .then(data => {
      this.uomRatingScale = null;
      this.msgs = [{severity:'info', summary:'Confirmed', detail:'Record deleted'}];
      this._reload.next();
    })
    .catch((error) => {
      console.log('error' , error.message);
      this.error = error.message || error;
    });
  }

  selectUomRatingScale(data: UomRatingScale) {
    console.log(" - this.uom " + this.uom);
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
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
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

  // TODO come si usa?
  isDefined(val: any) {
    return _isDefined(val);
  }

}

class PrimeUomRatingScale implements UomRatingScale {
  constructor(public uomId?: string, public uom?: Uom, public uomRatingValue?: number, public description?: string) {}
}
