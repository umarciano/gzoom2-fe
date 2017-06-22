import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UomType } from './uom_type';
import { UomService } from '../../../api/uom.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {LazyLoadEvent} from '../../../commons/lazyloadevent';
import {FilterMetadata} from '../../../commons/filtermetadata';

@Component({
  selector: 'app-uom-type',
  templateUrl: './uom-type.component.html',
  styleUrls: ['./uom-type.component.scss']
})
export class UomTypeComponent implements OnInit {
  uomTypesObs: Observable<UomType[]>;
  uomTypes: UomType[];

  displayDialog: boolean;
  uomType: UomType = new PrimeUomType();
  selectedUomType: UomType;
  newUomType: boolean;

  constructor(private uomService: UomService, private readonly route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.uomTypesObs = this.route.data
      .map((data: { uomTypes: UomType[] }) => data.uomTypes);

    // TODO va bene cosi?
    this.uomTypesObs.map((types) => types)
    .subscribe((data) => {
      this.uomTypes = data;
    });
  }

  showDialogToAdd() {
    console.log(" - showDialogToAdd ");
    this.newUomType = true;
    this.uomType = new PrimeUomType();
    this.displayDialog = true;
  }

  save() {
    let uomTypes = [...this.uomTypes];
    if(this.newUomType)
        uomTypes.push(this.uomType);
    else
        uomTypes[this.findSelectedUomTypeIndex()] = this.uomType;

    this.uomTypes = uomTypes;
    this.uomType = null;
    this.displayDialog = false;
  }

  delete() {
      let index = this.findSelectedUomTypeIndex();
      this.uomTypes = this.uomTypes.filter((val,i) => i!=index);
      this.uomType = null;
      this.displayDialog = false;
  }

  findSelectedUomTypeIndex(): number {
        return this.uomTypes.indexOf(this.selectedUomType);
  }

  selectUomType(data: UomType) {
    console.log("data " + data);
    this.selectedUomType = data;
    this.newUomType = false;
    this.uomType = this.cloneUomType(data);
    this.displayDialog = true;
  }

  cloneUomType(u: UomType): UomType {
    let uomType = new PrimeUomType();
    for(let prop in uomType) {
      console.log("prop " + prop + " = " + u[prop]);
      uomType[prop] = u[prop];
    }
    return uomType;
  }
}

class PrimeUomType implements UomType {
  constructor(public uomTypeId?: string, public description?: string) {}
}
