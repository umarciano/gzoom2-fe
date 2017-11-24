
export class Timesheet {
  constructor(public partyId?: string, public partyName?: string,
              public timesheetId?: string, public fromDate?: Date , public thruDate?: Date,
              public contractHours?: number, public actualHours?: number) {}
}
