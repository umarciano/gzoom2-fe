import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Uom } from './uom';
import { UomService } from '../../../api/uom.service';
import { Router } from '@angular/router'; // TODO ?
import {LazyLoadEvent} from '../../../commons/lazyloadevent';
import {FilterMetadata} from '../../../commons/filtermetadata';

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.css'],
  providers: [UomService]
})
export class UomComponent implements OnInit {
  uom: Observable<Uom[]>;
  uom2: Uom[]; // per scroll
  cols: any[];

  datasource: Uom[];
  uom3: Uom[];
  totalRecords: number;

  constructor(private uomService: UomService, private router: Router) { }

  ngOnInit() {
    console.log('ngOnInit');
    // this.uomTypes = Observable.of<UomType[]>([]);
    this.uomService.uom()
    .toPromise()
    .then(uoms => {
      /*this.uom2 = uoms;*/
      this.datasource = uoms;
      this.totalRecords = this.datasource.length;
      this.uom2 = this.datasource.slice(0, 5);
    })
    .catch(error => {
        // TODO: add real error handling
        console.log(error);
        return Observable.of<Uom[]>([]);
      });

      this.cols = [
          {field: 'uomTypeId', header: 'UomTypeId'},
          {field: 'uomId', header: 'UomId'},
          {field: 'description', header: 'Description'}
      ];
    }

    loadCarsLazy(event: LazyLoadEvent) {
        //in a real application, make a remote request to load data using state metadata from event
        //event.first = First row offset
        //event.rows = Number of rows per page
        //event.sortField = Field name to sort with
        //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        //filters: FilterMetadata object having field as key and filter value, filter matchMode as value
        console.log(" - loadCarsLazy " + event.filters);

        //imitate db connection over a network
        setTimeout(() => {
            if(this.datasource) {
                this.uom2 = this.datasource.slice(event.first, (event.first + event.rows));
                this.uom2.filter(v => v.description.indexOf(event.filters.global.value) !== -1)
            }
    }, 250);
  }

  selectUom(uomType: Uom) {
        // this.msgs = [];
        // this.msgs.push({severity:'info', summary:'Car Select', detail:'Vin: ' + car.vin});
  }

}
