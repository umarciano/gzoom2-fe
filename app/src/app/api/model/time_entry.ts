import { VariableGridArray } from "app/layout/table-editing-cell/table-editing-cell-configuration";

/**
 * Model of a TimeEntry.
 */
export class TimeEntry {
  constructor(
    public idNumber?: number,
    public workEffortName?: string,
    public timeEntryId?: string,
    public workEffortId?: string,
    public partyId?: string,
    public rateTypeId?: string,
    public timesheetId?: string,
    public description?: string,
    public percentage?: number,
    public effortUomId?: string,
    public hours?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public planHours?: number,
    public comments?: string,
    public workEffort?: string,
    public variableGridArray?: VariableGridArray
    ) { }
}
