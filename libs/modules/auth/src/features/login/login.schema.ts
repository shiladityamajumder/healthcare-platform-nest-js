/**
 * Validated request DTOs for password and phone-OTP login.
 * Used backward by LoginController; connects forward to LoginService input.
 */
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  Matches,
  ValidateIf,
} from 'class-validator';
import { PhoneSchema } from '../../contracts/phone.schema';

export class PasswordLoginSchema {
  @IsIn(['email', 'phone']) channel!: string;
  @ValidateIf((input: PasswordLoginSchema) => input.channel === 'email')
  @IsNotEmpty()
  @IsEmail()
  email?: string;
  @ValidateIf((input: PasswordLoginSchema) => input.channel === 'phone')
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(8)
  phoneCountryCode?: string;
  @ValidateIf((input: PasswordLoginSchema) => input.channel === 'phone')
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  phoneNumber?: string;
  @IsString() @MinLength(1) @MaxLength(128) password!: string;
}

export class PhoneLoginVerifySchema extends PhoneSchema {
  @IsUUID() challengeId!: string;
  @Matches(/^[0-9]{6}$/) code!: string;
}
