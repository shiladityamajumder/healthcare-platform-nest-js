/**
 * Validated request DTOs for password recovery and password changes.
 * Used backward by PasswordManagementController; connects forward to PasswordManagementService input.
 */
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class ForgotPasswordSchema {
  @IsIn(['email', 'sms']) channel!: string;
  @ValidateIf((input: ForgotPasswordSchema) => input.channel === 'email')
  @IsNotEmpty()
  @IsEmail()
  email?: string;
  @ValidateIf((input: ForgotPasswordSchema) => input.channel === 'sms')
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(8)
  phoneCountryCode?: string;
  @ValidateIf((input: ForgotPasswordSchema) => input.channel === 'sms')
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  phoneNumber?: string;
}

export class ResetVerifySchema extends ForgotPasswordSchema {
  @IsUUID() challengeId!: string;
  @Matches(/^[0-9]{6}$/) code!: string;
}

export class ResetPasswordSchema {
  @IsString() @MinLength(32) @MaxLength(8192) resetToken!: string;
  @IsString() @MinLength(1) @MaxLength(128) newPassword!: string;
}

export class ChangePasswordSchema {
  @IsString() @MinLength(1) @MaxLength(128) currentPassword!: string;
  @IsString() @MinLength(1) @MaxLength(128) newPassword!: string;
}

export class SetPasswordSchema {
  @IsString() @MinLength(1) @MaxLength(128) newPassword!: string;
}
