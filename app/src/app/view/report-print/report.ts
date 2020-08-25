export class Params {
  constructor(public name?: string, public value?: any, public mandatory?:boolean ) {};
}

export class ReportParam {
  constructor(
     public paramName?: string,
     public paramDefault?: any,
     public paramType?: string,
     public mandatory?: boolean,
     public display?: boolean,
     public options?: string ) {};
}

export class ReportType {
  constructor(public mimeTypeId?: string, public description?: string ) {};
}

export class WorkEffortType {
  constructor(public workEffortTypeId?: string, public description?: string, public workEffortTypeName?:  string,) {};
}

export class Report {
  constructor(public reportContentId?: string,
    public reportName?: string,
    public contentName?: string,
    public parentTypeId?: string,
    public outputFormat?: string,
    public workEffortTypeId?: string,
    public outputFormats?: ReportType[],
    public params?: Params[],
    public paramsValue?: {},
    public analysis? : boolean,
    public resourceName?: string,
    public useFilter? : boolean) {}
}


export class ReportActivity {
  constructor(public activityId?: string, public status?: string, public contentName?:  string, public completedStamp?: Date,) {};
}

