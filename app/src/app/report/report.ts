
export class Params {
  constructor(public name?: string, public value?: any ) {};
}

export class OutputType {
  constructor(public name?: string, public value?: any, public mimeTypeId?:string, public mandatory?:boolean ) {};
}

export class Report {
  constructor(public reportContentId?: string, public reportName?: string, public parentTypeId?: string,
    public outputFormat?: string,
    public mimeTypeId?: string,
    public workEffortTypeId?: string[],
    public params?: Params[],
    public outputFormats?: OutputType[]) {}
}