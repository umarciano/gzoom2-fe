/**
 * Model of a Party.
 */
export class Party {
  constructor(public partyId?: string, 
    public partyName?: string, 
    public firstName?: string, 
    public lastName?: string,
    public partyParentRole?: PartyParentRole) { }
}

export class PartyParentRole {
  constructor(public parentRoleCode?: string) { }
}


