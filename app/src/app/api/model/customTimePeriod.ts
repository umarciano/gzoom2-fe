/**
 * Model of CustomTimePeriod
 */
 export class CustomTimePeriod {
  constructor(
    public customTimePeriodId?: string,
    public periodTypeId?: string,
    public periodName?: string,
    public periodNameLang?: string,
    public fromDate?: Date,
    public thruDate?: Date
    ) {}
}
