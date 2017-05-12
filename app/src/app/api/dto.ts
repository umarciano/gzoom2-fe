/*
 * DTO models for API I/O.
 */

/**
 * Authentication types.
 */
export enum AuthenticationType {
  DB,
  LDAP
}

/**
 * The returned set of permissions.
 */
export class Permissions {
  permissions: { [x: string]: string[] };
}

/**
 * Any menu entry.
 */
export abstract class MenuItem {
  id: string;
  classes: string[];
  label: string;
}

/**
 * A menu entry that has no children.
 */
export class LeafMenu extends MenuItem {
  params?: { [name: string]: any };
}

/**
 * A menu entry that can contain both leaves and folders.
 */
export class FolderMenu extends MenuItem {
  children: [FolderMenu | MenuItem];
}

/**
 * The root of the menu.
 */
export class RootMenu {
  id: string;
  children: [FolderMenu];
}
