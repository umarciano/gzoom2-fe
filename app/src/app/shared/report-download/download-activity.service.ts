import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class DownloadActivityService {
  public readonly activities: BehaviorSubject<boolean>;
  constructor() {
      this.activities = new BehaviorSubject(false);
  }
  openDownload(activityId: string) {
      this.activities.next(true);
  }
}
