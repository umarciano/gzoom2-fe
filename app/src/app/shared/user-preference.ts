
/**
 * Model of a UserPreference
 */
export class UserPreference {
  constructor(
    public userLoginId?: string, 
    public userPrefTypeId?: string, 
    public userPrefValue?:  string) {};
}
