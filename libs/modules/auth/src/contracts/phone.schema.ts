/**
 * Reusable phone validation contract for registration and login requests.
 * Used backward by those feature schemas/controllers; connects forward to normalized phone validation.
 */
import { IsString, MaxLength, MinLength } from 'class-validator';

export class PhoneSchema {
  @IsString() @MinLength(1) @MaxLength(8) phoneCountryCode!: string;
  @IsString() @MinLength(6) @MaxLength(32) phoneNumber!: string;
}
