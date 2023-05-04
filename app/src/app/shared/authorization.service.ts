import { Injectable } from '@angular/core';
import { Permissions } from '../commons/model/dto';
import * as _ from 'lodash';

/**
 * Possible permission actions.
 */
export enum ACTIONS {
  ADMIN = 1 << 0,
  VIEW = 1 << 1,
  CREATE = 1 << 2,
  UPDATE = 1 << 3,
  DELETE = 1 << 4
};

function numActions(acts: string[]): number {
  return _.reduce(acts, (mask, s) => {
    const n = ACTIONS[s] || 0;
    return mask | n;
  }, 0);
}

function convert(perms: {[x: string]: string[]}): {[x: string]: number} {
  return _.reduce(perms, (res, val: string[], key: string) => {
    res[key] = numActions(val);
    return res;
  }, {});
}

/**
 * Contains information about user authorization.
 */
@Injectable()
export class AuthorizationService {
  private permissions: {[x: string]: number} = null;

  constructor() { }

  /**
   * Initializes the set of permissions.
   *
   * @param  {Permissions} perms The set of permissions
   */
  init(perms: Permissions) {
    this.permissions = convert(perms.permissions);
  }

  /**
   * Tells whether permissions have been initialized already.
   *
   * @return {boolean} True if permissions have been initialized.
   */
  isInitialized() {
    return this.permissions !== null;
  }

  /**
   * Resets the permissions.
   */
  clear() {
    this.permissions = null;
  }

  /**
   * Tests whether user has all of the permissions for the given root.
   *
   * @param  {string} root The permission root
   * @param  {number} mask The permission mask
   * @return {Boolean}     True if user has all of the permissions in the mask,
*                          false otherwise
   */
  hasPermissions(root: string, mask: number): boolean {
    const actions = this.permissions[root] || 0;
    return (actions & mask) === mask;
  }

  /**
   * Tests whether user has at least one of the permissions for the given root.
   *
   * @param  {string} root The permission root
   * @param  {number} mask The permission mask
   * @return {Boolean}     True if user has at least one of the permissions in the mask,
   *                       false otherwise.
   */
  hasAnyPermission(root: string, mask: number): boolean {
    const actions = this.permissions[root] || 0;
    return (actions & mask) !== 0;
  }
}
