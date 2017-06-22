import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UomType } from './uom_type';
import { UomService } from '../../../api/uom.service';
import { Router } from '@angular/router'; // TODO ?
import {LazyLoadEvent} from '../../../commons/lazyloadevent';
import {FilterMetadata} from '../../../commons/filtermetadata';

@Component({
  selector: 'app-uom-type',
  templateUrl: './uom-type.component.html',
  styleUrls: ['./uom-type.component.css'],
  providers: [UomService]
})
export class UomTypeComponent implements OnInit {
  uomTypes: Observable<UomType[]>;
  uomTypes2: UomType[];
  cols: any[];

  constructor(private uomService: UomService, private router: Router) { }

  ngOnInit() {
    console.log('ngOnInit');
    // this.uomTypes = Observable.of<UomType[]>([]);
    this.uomService.uomType()
    .toPromise()
    .then(uomTypes => {
      this.uomTypes2 = uomTypes
    })
    .catch(error => {
      // TODO: add real error handling
      console.log(error);
      return Observable.of<UomType[]>([]);
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
