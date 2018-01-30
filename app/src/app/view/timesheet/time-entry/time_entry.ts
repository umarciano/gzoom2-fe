/**
 * Model of a hero.
 */
export class TimeEntry {
  constructor(public timeEntryId?: string, public workEffortId?: string,
              public timesheetId?: string, public description?: string, public percentage?: number,
              public fromDate?: Date, public thruDate?: Date) { }

}
