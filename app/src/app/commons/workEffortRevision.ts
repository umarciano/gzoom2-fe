/**
 * Model of Enumararion
 */
export class WorkEffortRevision {
  constructor(
    public workEffortRevisionId?: string,
    public workEffortTypeIdCtx?: string,
    public workEffortTypeIdFil?: string,
    public description?: string,
    public organizationId?: string
    ) {}
}
