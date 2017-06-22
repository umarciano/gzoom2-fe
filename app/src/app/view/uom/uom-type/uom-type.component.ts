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
  styleUrls: ['./uom-type.component.css']
})
export class UomTypeComponent implements OnInit {
  uomTypesObs: Observable<UomType[]>;
  uomTypes: UomType[];
  cols: any[];

  constructor(private uomService: UomService, private readonly route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.uomTypesObs = this.route.data
      .map((data: { uomTypes: UomType[] }) => data.uomTypes);

    // TODO va bene cosi?
    this.uomTypesObs.map((types) => types)
    .subscribe((data) => {
      this.uomTypes = data;
    });

    this.cols = [
      {field: 'uomTypeId', header: 'UomTypeId'},
      {field: 'description', header: 'Description'}
    ];
  }

  selectUomType(uomType: UomType) {
    // this.msgs = [];
    // this.msgs.push({severity:'info', summary:'Car Select', detail:'Vin: ' + car.vin});
  }
}
