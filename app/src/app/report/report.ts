
export class Params {
  constructor(public name?: string, public value?: any, public mandatory?:boolean ) {};
}

export class ReportParam {
  constructor(public paramName?: string, public paramDefault?: any, public paramType?: string, public mandatory?:boolean ) {};
}

export class ReportType {
  constructor(public mimeTypeId?: string, public description?: string ) {};
}

export class WorkEffortType {
  constructor(public workEffortTypeId?: string, public description?: string ) {};
}

export class WorkEffort {
  constructor(public workEffortId?: string, public workEffortName?: string ) {};
}

export class Report {
  constructor(public reportContentId?: string, 
    public reportName?: string, 
    public parentTypeId?: string,
    public outputFormat?: string,
    public workEffortTypeId?: string,    
    public outputFormats?: ReportType[],
    public params?: Params[],
    public paramsValue?: {},) {}
}