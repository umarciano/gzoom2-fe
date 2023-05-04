import { VariableGridArray } from "app/layout/table-editing-cell/table-editing-cell-configuration";

export class Timesheet {
  constructor(public idNumber?: number, public party?: string, public partyName?: string, public partyStructure?: string,
    public timesheetId?: string, public fromDate?: Date, public thruDate?: Date, public variableGridArray?: VariableGridArray,
    public contractHours?: number, public actualHours?: number, public workEffort?: string,
    public workEffortTypePeriod?: number, public statusItem?: string, public effortUomId?: string, public uom?: Object,
    public description?: string, public partyHistoryView?: Object, public updatable?: any,
    public partyParentRole?: string, public partyParentRoleStructure?: string, public partyParentRoleStructureLang?: string, public workEffortTypeContent?: string) { }
}
