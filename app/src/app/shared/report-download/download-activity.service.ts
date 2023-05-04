import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class DownloadActivityService {
  public lastValue : string;
  // public readonly activities: BehaviorSubject<string>;  //BehaviourSubject, non appena ti sottoscrivi ricevi l'ultimo valore (anche se era stato lanciato prima della sottoscrizione)
  public readonly activities: Subject<string>;
  constructor() {
      // this.activities = new BehaviorSubject(null);
      this.activities = new Subject();
  }
  openDownload(activityId: string) {
    console.log("service openDownload activityId " + activityId);
    this.activities.next(activityId);
  }

  getActivities(): Observable<string> {
    return this.activities.asObservable();
  }

}
