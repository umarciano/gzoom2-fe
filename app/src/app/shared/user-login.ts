import { UserProfile } from 'app/commons/service/auth.service';

/**
 * Model of a UserLogin
 */
export class UserLogin extends UserProfile  {
    public userLoginId?: string;
    public currentPassword?: string;
    public newPassword?: string;
    public newPasswordVerify?: string;
    public requirePasswordChange?: boolean;
    public disabledDateTime?:  Date;
    public successiveFailedLogins?: number;
}
