import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Uom } from './uom';
import { UomRatingScale } from '../scale/uom_rating_scale';
import { UomType } from '../uom-type/uom_type';
import { UomService } from '../../../api/uom.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { SelectItem } from '../../../commons/selectitem';
import { Message } from '../../../commons/message';
import { isDefined as _isDefined } from '../../../commons/commons';

import 'rxjs/add/operator/map';

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.css']
})

export class UomComponent implements OnInit {
  error = '';
  msgs: Message[] = [];

  uoms: Uom[];
  uomTypes: UomType[];

  uomTypeSelectItem: SelectItem[] = [];
  selectedUomTypeId: string;
  selectedRowUom: any;

  displayDialog: boolean;
  uom: Uom = new PrimeUom();
  selectedUom: Uom;
  newUom: boolean;

  constructor(private readonly uomService: UomService,
              private readonly confirmationService: ConfirmationService,
              private readonly route: ActivatedRoute,
              private readonly router: Router) { }

  ngOnInit() {
    this.route.data
      .map((data: { uomTypes: UomType[] }) => data.uomTypes)
      .subscribe((data) => {
        this.uomTypes = data;
      });

    //..get values from database into SelectItem array
    this.uomTypes.forEach((item: UomType) => {
      this.uomTypeSelectItem.push({label: item.description, value: item.uomTypeId});
    });

    this.route.data
      .map((data: { uoms: Uom[] }) => data.uoms)
      .subscribe((data) => {
        this.uoms = data;
      });
  }

  reload() {
    console.log('reload');
    this.uomService
      .uomTypes() // subscribe invece di toPromise....
      .toPromise()
      .then(uomTypes => { this.uomTypes = uomTypes; })
      .catch(err => {
        console.error('Cannot retrieve uomType', err);
    });

    /* TODO come fa a funzionare?
	this.uomTypes.forEach((item: UomType) => {
      this.uomTypeSelectItem.push({label: item.description, value: item.uomTypeId});
    });*/

    this.uomService
      .uoms()
      .toPromise()
      .then(uoms => { this.uoms = uoms; })
      .catch(err => {
        console.error('Cannot retrieve uom', err);
    });
  }

  showDialogToAdd() {
    console.log(" - showDialogToAdd ");
    this.error = '';
    this.selectedUomTypeId = this.uomTypes[0].uomTypeId;
    this.newUom = true;
    this.uom = new PrimeUom();
    this.displayDialog = true;
  }

  save() {
    console.log("this.selectedUomTypeId ", this.selectedUomTypeId);
    // conviene in create e update
    this.uom.uomTypeId = this.selectedUomTypeId; // TODO si fa cosi?
    console.log("this.uom ", this.uom);
    if (this.newUom) {
      this.uomService
        .createUom(this.uom)
        .then(() => {
          this.uom = null;
          this.displayDialog = false;
          this.msgs = [{severity:'info', summary:'Created', detail:'Record created'}];
          this.reload();
        })
        .catch((error) => {
          console.log('error' , error.message);
          this.error = error.message || error;
        });
    } else {
      this.uomService
        .updateUom(this.selectedUom.uomId, this.uom)
        .then(data => {
          this.uom = null;
          this.displayDialog = false;
          this.msgs = [{severity:'info', summary:'Updated', detail:'Record updated'}];
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
    .deleteUom(this.selectedUom.uomId)
    .then(data => {
      this.uom = null;
      this.msgs = [{severity:'info', summary:'Confirmed', detail:'Record deleted'}];
      this.reload();
    })
    .catch((error) => {
      console.log('error' , error.message);
      this.error = error.message || error;
    });
  }

  selectUom(data: Uom) {
    console.log("data " + data);
    this.error = '';
    this.selectedUom = data;
    this.newUom = false;
    this.uom = this.cloneUom(data);
    this.selectedUomTypeId = data.uomType.uomTypeId;
    this.displayDialog = true;
  }

  cloneUom(u: Uom): Uom {
    let uom = new PrimeUom();
    for(let prop in uom) {
      uom[prop] = u[prop];
    }
    return uom;
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
          this.uom = null;
          this.displayDialog = false;
        }
    });
  }

  onRowSelect(event) {
    this.router.navigate([event.data.uomId], { relativeTo: this.route });

    this.msgs = [];
    this.msgs.push({severity: 'info', summary: 'Uom Selected', detail: event.data.uomId + ' - ' + event.data.description});
  }

  // TODO quando viene invocata?
  onRowUnselect(event) {
    console.log(" - onRowUnselect ");
    this.msgs = [];
    this.msgs.push({severity: 'info', summary: 'Uom Unselected', detail: event.data.uomId + ' - ' + event.data.description});
  }


  // TODO come si usa?
  isDefined(val: any){
    return _isDefined(val);
  }
}

class PrimeUom implements Uom {
  constructor(public uomId?: string, public uomTypeId?: string, public uomType?: UomType, public abbreviation?: string, public description?: string,
              public decimalScale?: number, public minValue?: number, public maxValue?: number) {}
}
