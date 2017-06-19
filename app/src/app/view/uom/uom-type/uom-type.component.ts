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

  datasource: UomType[];
  cars: UomType[];
  totalRecords: number;

  constructor(private uomService: UomService, private router: Router) { }

  ngOnInit() {
    console.log('ngOnInit');
    this.uomTypes = Observable.of<UomType[]>([]);
    this.uomService.search()
    .toPromise()
    .then(cars => {
      // this.uomTypes2 = cars
      this.datasource = cars;
      this.totalRecords = this.datasource.length;
      this.cars = this.datasource.slice(0, 3);
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

    loadCarsLazy(event: LazyLoadEvent) {
        //in a real application, make a remote request to load data using state metadata from event
        //event.first = First row offset
        //event.rows = Number of rows per page
        //event.sortField = Field name to sort with
        //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

        //imitate db connection over a network
        setTimeout(() => {
            if(this.datasource) {
                this.cars = this.datasource.slice(event.first, (event.first + event.rows));
            }
    }, 250);

  }
}
