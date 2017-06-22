import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Uom } from './uom';
import { UomService } from '../../../api/uom.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {LazyLoadEvent} from '../../../commons/lazyloadevent';
import {FilterMetadata} from '../../../commons/filtermetadata';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.css']
})
export class UomComponent implements OnInit {
  uomsObs: Observable<Uom[]>;
  uoms: Uom[];

  displayDialog: boolean;
  uom: Uom = new PrimeUom();
  selectedUom: Uom;
  newUom: boolean;

  cols: any[]; // TODO serve?

  /*datasource: Uom[];
  uom3: Uom[];
  totalRecords: number;
*/
  constructor(private uomService: UomService, private confirmationService: ConfirmationService,
              private readonly route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    console.log('ngOnInit');
    this.uomsObs = this.route.data
      .map((data: { uoms: Uom[] }) => data.uoms);

    // TODO va bene cosi?
    this.uomsObs.map((values) => values)
    .subscribe((data) => {
      this.uoms = data;
    });

    this.cols = [
        {field: 'uomTypeId', header: 'UomTypeId'},
        {field: 'uomId', header: 'UomId'},
        {field: 'description', header: 'Description'}
    ];
  }

  showDialogToAdd() {
    console.log(" - showDialogToAdd ");
    this.newUom = true;
    this.uom = new PrimeUom();
    this.displayDialog = true;
  }

  save() {
    let uoms = [...this.uoms];
    if(this.newUom)
        uoms.push(this.uom);
    else
        uoms[this.findSelectedUomIndex()] = this.uom;

    this.uoms = uoms;
    this.uom = null;
    this.displayDialog = false;
  }

  delete() {
    let index = this.findSelectedUomIndex();
    this.uoms = this.uoms.filter((val,i) => i!=index);
    this.uom = null;
    this.displayDialog = false;
  }

  findSelectedUomIndex(): number {
    return this.uoms.indexOf(this.selectedUom);
  }

  selectUom(data: Uom) {
    console.log("data " + data);
    this.selectedUom = data;
    this.newUom = false;
    this.uom = this.cloneUom(data);
    this.displayDialog = true;
  }

  cloneUom(u: Uom): Uom {
    let uom = new PrimeUom();
    for(let prop in uom) {
      console.log("prop " + prop + " = " + u[prop]);
      uom[prop] = u[prop];
    }
    return uom;
  }
    /*this.uomService.uom()
    .toPromise()
    .then(uoms => {
      // this.uom2 = uoms;
      this.datasource = uoms;
      this.totalRecords = this.datasource.length;
      this.uom2 = this.datasource.slice(0, 5);
    })
    .catch(error => {
        // TODO: add real error handling
        console.log(error);
        return Observable.of<Uom[]>([]);
      });
*/


  /*loadCarsLazy(event: LazyLoadEvent) {
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
  }*/
  confirm() {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to perform this action?',
        accept: () => {
            this.delete()
        },
        reject: () => {
          this.uom = null;
          this.displayDialog = false;
        }
    });
  }
}

class PrimeUom implements Uom {
  constructor(public uomId?: string, public uomTypeId?: string, public abbreviation?: string, public description?: string,
              public decimalScale?: number, public minValue?: number, public maxValue?: number) {}
}
