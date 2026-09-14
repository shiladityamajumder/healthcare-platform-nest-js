// * Auth module: Defines validation and OpenAPI DTOs for password-management requests.
// * File: src/features/password-management/password-management.schema.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// * DTO [ForgotPasswordSchema]: Validates and documents data crossing the HTTP boundary.
export class ForgotPasswordSchema {
  @ApiProperty({ description: 'Recovery channel.', enum: ['email', 'sms'], example: 'email' })
  @IsIn(['email', 'sms'])
  channel!: string;
  @ApiPropertyOptional({
    description: 'Account email; required when channel is email.',
    example: 'user@example.com',
  })
  @ValidateIf((input: ForgotPasswordSchema) => input.channel === 'email')
  @IsNotEmpty()
  @IsEmail()
  email?: string;
  @ApiPropertyOptional({
    description: 'Phone country code; required when channel is sms.',
    example: '+91',
  })
  @ValidateIf((input: ForgotPasswordSchema) => input.channel === 'sms')
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(8)
  phoneCountryCode?: string;
  @ApiPropertyOptional({
    description: 'Phone number; required when channel is sms.',
    example: '9876543210',
  })
  @ValidateIf((input: ForgotPasswordSchema) => input.channel === 'sms')
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  phoneNumber?: string;
}

// * DTO [ResetVerifySchema]: Validates and documents data crossing the HTTP boundary.
export class ResetVerifySchema extends ForgotPasswordSchema {
  @ApiProperty({
    description: 'Password recovery challenge ID.',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  challengeId!: string;
  @ApiProperty({ description: 'Six-digit recovery code.', example: '123456' })
  @Matches(/^[0-9]{6}$/)
  code!: string;
}

// * DTO [ResetPasswordSchema]: Validates and documents data crossing the HTTP boundary.
export class ResetPasswordSchema {
  @ApiProperty({
    description: 'Short-lived reset token returned after OTP verification.',
    example: 'eyJhbGciOiJIUzI1NiIs...',
    format: 'password',
  })
  @IsString()
  @MinLength(32)
  @MaxLength(8192)
  resetToken!: string;
  @ApiProperty({
    description: 'New account password.',
    example: 'NewSecurePass#123',
    format: 'password',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  newPassword!: string;
}

// * DTO [ChangePasswordSchema]: Validates and documents data crossing the HTTP boundary.
export class ChangePasswordSchema {
  @ApiProperty({
    description: 'Current account password.',
    example: 'CurrentPass#123',
    format: 'password',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  currentPassword!: string;
  @ApiProperty({
    description: 'Replacement account password.',
    example: 'NewSecurePass#123',
    format: 'password',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  newPassword!: string;
}

// * DTO [SetPasswordSchema]: Validates and documents data crossing the HTTP boundary.
export class SetPasswordSchema {
  @ApiProperty({
    description: 'Password to configure for an account without one.',
    example: 'SecurePass#123',
    format: 'password',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  newPassword!: string;
}
