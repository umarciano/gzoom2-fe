import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, mergeWith, switchMap } from 'rxjs/operators';
import { VisitorService } from '../../../../api/service/visitor.service';
import { Message } from '../../../../commons/model/message';
import { I18NService } from '../../../../i18n/i18n.service';
import { Visit } from './visit';
import {dtoToDateTime} from '../../../../commons/model/utils';



@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {

  _reload: Subject<void>;
  /** Error message from be*/
  error = '';
   /** Info message in Toast*/
  msgs: Message[] = [];
  /** whether create or update */
  newVisitor: boolean;
  /** List of Uom */
  visits: Visit[]
  
  constructor(private readonly visitorService: VisitorService,
              private readonly route: ActivatedRoute,
              private readonly router: Router,
              public readonly i18nService: I18NService) {
    this._reload = new Subject<void>();
  }

  ngOnInit() {
    const reloadedVisitors = this._reload.pipe(switchMap(() => this.visitorService.visits()));

    this.route.data.pipe(
      map((data: { visitors: Visit[] }) => data.visitors),
      mergeWith(reloadedVisitors)
    ).subscribe((data) => {
      this.visits = this.fixDatesArray(data);
    });
  }

  fixDatesArray(lar: Visit[]): Visit[] {
    let visits = [];
    lar.forEach(item => {
      visits.push(this.fixDates(item));
    })
    return visits;
  }
  
  fixDates(lar: Visit): Visit {
    
    return {
      visitorId: lar.visitorId,
      userLoginId: lar.userLoginId,
      parentRoleCode: lar.parentRoleCode,
      firstName: lar.firstName,
      lastName: lar.lastName,
      minFromDate: dtoToDateTime(lar.minFromDate),
      maxThruDate: dtoToDateTime(lar.maxThruDate)
    };
  }

}
