import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EmailRegistrationDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(1) @MaxLength(128) password!: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) firstName?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) lastName?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) preferredName?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(16) preferredLocale?: string;
  @IsOptional() @IsString() @MinLength(3) @MaxLength(64) timezone?: string;
  @IsOptional() @IsString() @MaxLength(32) termsVersion?: string;
  @IsOptional() @IsString() @MaxLength(32) privacyVersion?: string;
}
export class PhoneDto {
  @IsString() @MinLength(1) @MaxLength(8) phoneCountryCode!: string;
  @IsString() @MinLength(6) @MaxLength(32) phoneNumber!: string;
}
export class PhoneRegistrationVerifyDto extends PhoneDto {
  @IsUUID() challengeId!: string;
  @Matches(/^[0-9]{6}$/) code!: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(128) password?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) firstName?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) lastName?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) preferredName?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(16) preferredLocale?: string;
  @IsOptional() @IsString() @MinLength(3) @MaxLength(64) timezone?: string;
  @IsOptional() @IsString() @MaxLength(32) termsVersion?: string;
  @IsOptional() @IsString() @MaxLength(32) privacyVersion?: string;
}
export class EmailDto {
  @IsEmail() email!: string;
}
export class EmailVerifyDto extends EmailDto {
  @IsUUID() challengeId!: string;
  @Matches(/^[0-9]{6}$/) code!: string;
}
export class PasswordLoginDto {
  @IsIn(['email', 'phone']) channel!: string;
  @ValidateIf((o: PasswordLoginDto) => o.channel === 'email') @IsEmail() email?: string;
  @ValidateIf((o: PasswordLoginDto) => o.channel === 'phone')
  @IsString()
  @MinLength(1)
  @MaxLength(8)
  phoneCountryCode?: string;
  @ValidateIf((o: PasswordLoginDto) => o.channel === 'phone')
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  phoneNumber?: string;
  @IsString() @MinLength(1) @MaxLength(128) password!: string;
}
export class PhoneLoginVerifyDto extends PhoneDto {
  @IsUUID() challengeId!: string;
  @Matches(/^[0-9]{6}$/) code!: string;
}
export class RefreshTokenDto {
  @IsString() @MinLength(32) @MaxLength(8192) refreshToken!: string;
}
export class ForgotPasswordDto {
  @IsIn(['email', 'sms']) channel!: string;
  @ValidateIf((o: ForgotPasswordDto) => o.channel === 'email') @IsEmail() email?: string;
  @ValidateIf((o: ForgotPasswordDto) => o.channel === 'sms')
  @IsString()
  @MinLength(1)
  @MaxLength(8)
  phoneCountryCode?: string;
  @ValidateIf((o: ForgotPasswordDto) => o.channel === 'sms')
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  phoneNumber?: string;
}
export class ResetVerifyDto extends ForgotPasswordDto {
  @IsUUID() challengeId!: string;
  @Matches(/^[0-9]{6}$/) code!: string;
}
export class ResetPasswordDto {
  @IsString() @MinLength(32) @MaxLength(8192) resetToken!: string;
  @IsString() @MinLength(1) @MaxLength(128) newPassword!: string;
}
export class ChangePasswordDto {
  @IsString() @MinLength(1) @MaxLength(128) currentPassword!: string;
  @IsString() @MinLength(1) @MaxLength(128) newPassword!: string;
}
export class SetPasswordDto {
  @IsString() @MinLength(1) @MaxLength(128) newPassword!: string;
}
export class UpdateCurrentUserDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(16) preferredLocale?: string;
  @IsOptional() @IsString() @MinLength(3) @MaxLength(64) timezone?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) firstName?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) lastName?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) preferredName?: string;
  @IsOptional() @IsUUID() avatarFileId?: string;
}
export class UpdateStatusDto {
  @IsIn(['pending', 'active', 'locked', 'suspended', 'closed']) status!: string;
  @IsString() @MinLength(3) @MaxLength(255) reason!: string;
  @IsOptional() @IsBoolean() revokeSessions?: boolean;
}
export class AdminLogoutDto {
  @IsString() @MinLength(3) @MaxLength(255) reason!: string;
}
export class CreateRoleDto {
  @Matches(/^[a-z][a-z0-9_.-]{1,63}$/) code!: string;
  @IsString() @MinLength(2) @MaxLength(128) name!: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
}
export class UpdateRoleDto {
  @IsOptional() @Matches(/^[a-z][a-z0-9_.-]{1,63}$/) code?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(128) name?: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
}
export class CreatePermissionDto {
  @Matches(/^[a-z][a-z0-9_.:-]{1,127}$/) code!: string;
  @Matches(/^[a-z][a-z0-9_.-]{1,63}$/) resource!: string;
  @Matches(/^[a-z][a-z0-9_-]{1,63}$/) action!: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
}
export class UpdatePermissionDto {
  @IsOptional() @Matches(/^[a-z][a-z0-9_.:-]{1,127}$/) code?: string;
  @IsOptional() @Matches(/^[a-z][a-z0-9_.-]{1,63}$/) resource?: string;
  @IsOptional() @Matches(/^[a-z][a-z0-9_-]{1,63}$/) action?: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
}
export class ReplaceRolePermissionsDto {
  @IsOptional() @IsUUID('4', { each: true }) permissionIds: string[] = [];
}
export class AssignUserRoleDto {
  @IsUUID() roleId!: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(32) scopeType?: string;
  @IsOptional() @IsUUID() scopeId?: string;
  @IsOptional() validFrom?: Date;
  @IsOptional() validUntil?: Date;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
export class UpdateUserRoleDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(32) scopeType?: string;
  @IsOptional() @IsUUID() scopeId?: string;
  @IsOptional() validFrom?: Date;
  @IsOptional() validUntil?: Date;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
export class ListUsersQuery {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 20;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) @Max(100000) offset = 0;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(320) search?: string;
  @IsOptional() @IsIn(['pending', 'active', 'locked', 'suspended', 'closed']) status?: string;
}
