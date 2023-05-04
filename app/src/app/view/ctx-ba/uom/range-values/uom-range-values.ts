/**
 * Model of a UomRangeValues.
 */
export class UomRangeValues {
  constructor(
    public uomRangeId: string, 
    public uomRangeValuesId: string, 
    public comments?: string,
    public colorEnumId?: string, 
    public fromValue?: number,
    public iconContentId?: string,
    public objectInfo?: string,
    public dataResource?: {objectInfo?: string},
    
    
    ) { }
}
