import { VariableGridArray } from 'app/layout/table-editing-cell/table-editing-cell-configuration';

/**
 * Model of a WorkEffortSequence.
 */
export class WorkEffortSequence {
    public createdByUserLogin?: string;
    public createdStamp?: string;
    public createdTxStamp?: string;
    public lastModifiedByUserLogin?: string;
    public lastUpdatedStamp?: string;
    public lastUpdatedTxStamp?: string;
    public seqId?: number;
    public seqName?: string;

    public variableGridArray?: VariableGridArray;
    
  
  }
  