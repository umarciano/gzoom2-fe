import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

import { I18NService } from '../../../commons/i18n.service';
import { Message } from '../../../commons/message';
import { UomType } from './uom_type';
import { UomService } from '../../../api/uom.service';

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
  form: FormGroup;
  /** Info message in Toast*/
  msgs: Message[] = [];
  /** whether create or update */
  newUomType: boolean;
  /** UomType to save*/
  uomType: UomType = new PrimeUomType();
  /** List of Uom */
  uomTypes: UomType[];
  /** Selected uomType in Dialog*/
  selectedUomType: UomType;

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
            'uomTypeId': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
            'description': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)]))
        });

    const reloadedUomTypes = this._reload.switchMap(() => this.uomService.uomTypes());

    this.route.data
      .map((data: { uomTypes: UomType[] }) => data.uomTypes)
      .merge(reloadedUomTypes)
      .subscribe(data => this.uomTypes = data);
  }

  save(): void {
    if (this.newUomType) {
      this.uomService
        .createUomType(this.uomType)
        .then(() => {
          this.uomType = null;
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
        .updateUomType(this.selectedUomType.uomTypeId, this.uomType)
        .then(data => {
          this.uomType = null;
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

  showDialogToAdd() {
    this.error = '';
    this.newUomType = true;
    this.uomType = new PrimeUomType();
    this.displayDialog = true;
  }

  _delete() {
    this.uomService
    .deleteUomType(this.selectedUomType.uomTypeId)
    .then(data => {
      this.uomType = null;
      this.msgs = [{severity:this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail:this.i18nService.translate('Record deleted')}];
      this._reload.next();
    })
    .catch((error) => {
      console.log('error' , error.message);
      this.error = this.i18nService.translate(error.message) || error;
    });
  }

  selectUomType(data: UomType) {
    this.error = '';
    this.selectedUomType = data;
    this.newUomType = false;
    this.uomType = this.cloneUomType(data);
    this.displayDialog = true;
  }

  cloneUomType(u: UomType): UomType {
    let uomType = new PrimeUomType();
    for(let prop in uomType) {
      uomType[prop] = u[prop];
    }
    return uomType;
  }


  confirm() {
    this.confirmationService.confirm({ // TODO translate
        message: this.i18nService.translate('Do you want to delete this record?'),
        header: this.i18nService.translate('Delete Confirmation'),
        icon: 'fa fa-trash',
        accept: () => {
          this.displayDialog = false;
          this._delete();
        },
        reject: () => {
          this.uomType = null;
          this.displayDialog = false;
        }
    });
  }
}

class PrimeUomType implements UomType {
  constructor(public uomTypeId?: string, public description?: string) {}
}
