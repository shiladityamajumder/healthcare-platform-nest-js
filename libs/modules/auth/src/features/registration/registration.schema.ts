/**
 * Validated request DTOs for email/phone registration and email verification.
 * Used backward by RegistrationController; connects forward to RegistrationService input.
 */
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PhoneSchema } from '../../contracts/phone.schema';

export class EmailRegistrationSchema {
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

export class EmailSchema {
  @IsEmail() email!: string;
}

export class EmailVerifySchema extends EmailSchema {
  @IsUUID() challengeId!: string;
  @Matches(/^[0-9]{6}$/) code!: string;
}

export class PhoneRegistrationVerifySchema extends PhoneSchema {
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
