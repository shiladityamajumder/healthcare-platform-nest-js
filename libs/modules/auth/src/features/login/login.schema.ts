// * Auth module: Defines validation and OpenAPI DTOs for login requests.
// * File: src/features/login/login.schema.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PhoneSchema } from '../../contracts/phone.schema';

// * DTO [PasswordLoginSchema]: Validates and documents data crossing the HTTP boundary.
export class PasswordLoginSchema {
  @ApiProperty({
    description: 'Identity channel used for login.',
    enum: ['email', 'phone'],
    example: 'email',
  })
  @IsIn(['email', 'phone'])
  channel!: string;
  @ApiPropertyOptional({
    description: 'Email address; required when channel is email.',
    example: 'user@example.com',
  })
  @ValidateIf((input: PasswordLoginSchema) => input.channel === 'email')
  @IsNotEmpty()
  @IsEmail()
  email?: string;
  @ApiPropertyOptional({
    description: 'Phone country code; required when channel is phone.',
    example: '+91',
  })
  @ValidateIf((input: PasswordLoginSchema) => input.channel === 'phone')
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(8)
  phoneCountryCode?: string;
  @ApiPropertyOptional({
    description: 'Phone number; required when channel is phone.',
    example: '9876543210',
  })
  @ValidateIf((input: PasswordLoginSchema) => input.channel === 'phone')
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  phoneNumber?: string;
  @ApiProperty({ description: 'Account password.', example: 'SecurePass#123', format: 'password' })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password!: string;
}

// * DTO [PhoneLoginVerifySchema]: Validates and documents data crossing the HTTP boundary.
export class PhoneLoginVerifySchema extends PhoneSchema {
  @ApiProperty({
    description: 'Challenge ID returned by the phone login OTP request.',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  challengeId!: string;
  @ApiProperty({ description: 'Six-digit one-time password.', example: '123456' })
  @Matches(/^[0-9]{6}$/)
  code!: string;
}
