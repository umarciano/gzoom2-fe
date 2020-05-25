import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class DownloadActivityService {
  public readonly activities: BehaviorSubject<string>;
  constructor() {
      this.activities = new BehaviorSubject(null);
  }
  openDownload(activityId: string) {
    console.log("service openDownload activityId " + activityId);
    this.activities.next(activityId);
  }

  getActivities(): Observable<string> {
    console.log("service getActivities ");
    return this.activities.asObservable();
  }
}
