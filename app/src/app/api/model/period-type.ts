import { VariableGridArray } from "app/layout/table-editing-cell/table-editing-cell-configuration";

export class PeriodType {
  constructor(
    public periodTypeId?: string,
    public description?: string,
    public variableGridArray?: VariableGridArray
  ) { }
}