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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PhoneSchema } from '../../contracts/phone.schema';

export class EmailRegistrationSchema {
  @ApiProperty({ description: 'Email address for the new account.', example: 'user@example.com' })
  @IsEmail()
  email!: string;
  @ApiProperty({
    description: 'Initial account password.',
    example: 'SecurePass#123',
    format: 'password',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password!: string;
  @ApiPropertyOptional({ description: 'User first name.', example: 'Aarav' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName?: string;
  @ApiPropertyOptional({ description: 'User last name.', example: 'Sharma' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName?: string;
  @ApiPropertyOptional({ description: 'Preferred name shown in the profile.', example: 'Aarav' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  preferredName?: string;
  @ApiPropertyOptional({
    description: 'Preferred language/locale.',
    example: 'en-IN',
    default: 'en-IN',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  preferredLocale?: string;
  @ApiPropertyOptional({
    description: 'IANA timezone.',
    example: 'Asia/Kolkata',
    default: 'Asia/Kolkata',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  timezone?: string;
  @ApiPropertyOptional({ description: 'Terms version accepted by the user.', example: '2026-01' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  termsVersion?: string;
  @ApiPropertyOptional({
    description: 'Privacy policy version accepted by the user.',
    example: '2026-01',
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  privacyVersion?: string;
}

export class EmailSchema {
  @ApiProperty({
    description: 'Email address associated with the account.',
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string;
}

export class EmailVerifySchema extends EmailSchema {
  @ApiProperty({
    description: 'Email verification challenge ID.',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  challengeId!: string;
  @ApiProperty({ description: 'Six-digit email verification code.', example: '123456' })
  @Matches(/^[0-9]{6}$/)
  code!: string;
}

export class PhoneRegistrationVerifySchema extends PhoneSchema {
  @ApiProperty({
    description: 'Phone registration challenge ID.',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  challengeId!: string;
  @ApiProperty({ description: 'Six-digit phone verification code.', example: '123456' })
  @Matches(/^[0-9]{6}$/)
  code!: string;
  @ApiPropertyOptional({
    description: 'Optional password for the phone account.',
    example: 'SecurePass#123',
    format: 'password',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password?: string;
  @ApiPropertyOptional({ description: 'User first name.', example: 'Aarav' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName?: string;
  @ApiPropertyOptional({ description: 'User last name.', example: 'Sharma' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName?: string;
  @ApiPropertyOptional({ description: 'Preferred name shown in the profile.', example: 'Aarav' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  preferredName?: string;
  @ApiPropertyOptional({
    description: 'Preferred language/locale.',
    example: 'en-IN',
    default: 'en-IN',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  preferredLocale?: string;
  @ApiPropertyOptional({
    description: 'IANA timezone.',
    example: 'Asia/Kolkata',
    default: 'Asia/Kolkata',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  timezone?: string;
  @ApiPropertyOptional({ description: 'Terms version accepted by the user.', example: '2026-01' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  termsVersion?: string;
  @ApiPropertyOptional({
    description: 'Privacy policy version accepted by the user.',
    example: '2026-01',
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  privacyVersion?: string;
}
