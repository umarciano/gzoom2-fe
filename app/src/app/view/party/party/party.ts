/**
 * Model of a Party.
 */
export class Party {
  constructor(public partyId?: string,
    public partyName?: string,
    public partyNameLang?: string,
    public firstName?: string,
    public lastName?: string,
    public externalId?: string,
    public partyParentRole?: PartyParentRole) { }
}

export class PartyParentRole {
  constructor(public parentRoleCode?: string) { }
}


