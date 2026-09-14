// * Auth module: Defines the shared validated country-code and phone-number DTO.
// * File: src/contracts/phone.schema.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * Reusable phone validation contract for registration and login requests.
 * Used backward by those feature schemas/controllers; connects forward to normalized phone validation.
 */
import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// * DTO [PhoneSchema]: Validates and documents data crossing the HTTP boundary.
export class PhoneSchema {
  @ApiProperty({
    description: 'Country calling code, with or without a leading plus sign.',
    example: '+91',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(8)
  phoneCountryCode!: string;
  @ApiProperty({ description: 'Phone number without the country code.', example: '9876543210' })
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  phoneNumber!: string;
}
