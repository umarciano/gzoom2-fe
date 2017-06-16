import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UomType } from './uom_type';
import { UomService } from '../../../api/uom.service';
import { Router } from '@angular/router'; // TODO ?

@Component({
  selector: 'app-uom-type',
  templateUrl: './uom-type.component.html',
  styleUrls: ['./uom-type.component.css'],
  providers: [UomService]
})
export class UomTypeComponent implements OnInit {
  uomTypes: Observable<UomType[]>;

  constructor(private uomService: UomService, private router: Router) { }

  ngOnInit() {
    console.log('ngOnInit');
    this.uomTypes = Observable.of<UomType[]>([]);
    this.uomTypes = this.uomService.search()
    .catch(error => {
        // TODO: add real error handling
        console.log(error);
        return Observable.of<UomType[]>([]);
      });
  }

}
