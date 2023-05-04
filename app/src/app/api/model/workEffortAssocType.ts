import { VariableGridArray } from "app/layout/table-editing-cell/table-editing-cell-configuration";

/**
 * Model of a WorkEffortAssocType.
 */
export class WorkEffortAssocType {
    public workEffortAssocTypeId?: string;
    public description?: string;
    public parentTypeId?: string;
    public parentWorkEffortAssocType?: {
        description?: string;
    }
    public parentDescription?: string;

    public variableGridArray?: VariableGridArray;
}