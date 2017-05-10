/*
 * DTO models for API I/O.
 */

export enum AuthenticationType {
  DB,
  LDAP
}

/**
 * The returned set of permissions.
 */
export class Permissions {
  permissions: { [x: string]: [string]};
}
