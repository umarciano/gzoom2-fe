import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class DownloadActivityService {
  public readonly activities: BehaviorSubject<boolean>;
  constructor() {
      this.activities = new BehaviorSubject(false);
  }
  openDownload() {
      this.activities.next(true);
  }

  getActivities(): Observable<boolean> {
    return this.activities.asObservable();
  }
}
