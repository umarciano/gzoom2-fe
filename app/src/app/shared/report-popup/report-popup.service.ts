import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ReportParam } from '../../view/report-print/report';

@Injectable()
export class ReportPopupService {
  public readonly activities: BehaviorSubject<ReportParam>;
  private popupSubject = new Subject<any>();
  popupObservable = this.popupSubject.asObservable();
  constructor() {
      this.activities = new BehaviorSubject(null);
  }
  openPopup(reportParam: ReportParam) {
    console.log('service openPopup reportParam ' + reportParam);
    this.popupSubject.next(reportParam);
  }
}
