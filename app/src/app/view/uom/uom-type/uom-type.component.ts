import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UomType } from './uom_type';
import { UomService } from '../../../api/uom.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {LazyLoadEvent} from '../../../commons/lazyloadevent';
import {FilterMetadata} from '../../../commons/filtermetadata';
import { ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';
import { Message } from '../../../commons/message';

import 'rxjs/add/operator/map';

@Component({
  selector: 'app-uom-type',
  templateUrl: './uom-type.component.html',
  styleUrls: ['./uom-type.component.scss']
})
export class UomTypeComponent implements OnInit {
  error = '';
  msgs: Message[] = [];

  uomTypes: UomType[];

  displayDialog: boolean;
  uomType: UomType = new PrimeUomType();
  selectedUomType: UomType;
  newUomType: boolean;

  constructor(private readonly uomService: UomService,
              private readonly confirmationService: ConfirmationService,
              private readonly route: ActivatedRoute,
              private readonly router: Router) { }

  ngOnInit() {
    console.log(" - ngOnInit ");
    this.route.data
      .map((data: { uomTypes: UomType[] }) => data.uomTypes)
      .subscribe(d => this.uomTypes = d);
  }

  reload() {
    console.log(" - reload ");
    this.uomService
      .uomType()
      .toPromise()
      .then(uomTypes => { this.uomTypes = uomTypes; })
      .catch(err => {
        console.error('Cannot retrieve uomType', err);
      });
  }
  showDialogToAdd() {
    console.log(" - showDialogToAdd ");
    this.error = '';
    this.newUomType = true;
    this.uomType = new PrimeUomType();
    this.displayDialog = true;
  }

  save(): void {
    console.log(" - this.newUomType " + this.newUomType);
    if (this.newUomType) {
      this.uomService
        .createUomType(this.uomType)
        .then(() => {
          this.uomType = null;
          this.displayDialog = false;
          this.msgs = [{severity:'info', summary:'Created', detail:'Record created'}];
          // TODO gestire reload della lista
          // this.router.navigate(['../type'], { relativeTo: this.route });
          this.reload();
        })
        .catch((error) => {
          console.log('error' , error.message);
          this.error = error.message || error;
        });
    } else {
      this.uomService
        .updateUomType(this.selectedUomType.uomTypeId, this.uomType)
        .then(data => {
          this.uomType = null;
          this.displayDialog = false;
          this.msgs = [{severity:'info', summary:'Updated', detail:'Record updated'}];
          // TODO gestire reload della lista
          // this.router.navigate(['../type', { id: this.selectedUomType.uomTypeId}], { relativeTo: this.route, skipLocationChange: true }); // TODO
          this.reload();
        })
        .catch((error) => {
          console.log('error' , error.message);
          this.error = error.message || error;
        });
    }
  }

  delete() {
    this.uomService
    .deleteUomType(this.selectedUomType.uomTypeId)
    .then(data => {
      this.uomType = null;
      this.msgs = [{severity:'info', summary:'Confirmed', detail:'Record deleted'}];
      // TODO gestire reload della lista
      // this.router.navigate(['../type'], { relativeTo: this.route });
      this.reload();
    })
    .catch((error) => {
      console.log('error' , error.message);
      this.error = error.message || error;
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
    this.confirmationService.confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.displayDialog = false;
          this.delete();
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
