
export class Visit {
  constructor(public visitorId: string, public userLoginId?: string, public firstName?: string, public lastName?: string, public parentRoleCode?: string, 
    public minFromDate?: Date, public maxThruDate?: Date) {}
}
