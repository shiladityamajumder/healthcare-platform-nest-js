// * Auth module: Defines validation and OpenAPI DTOs for current-user updates.
// * File: src/features/current-user/current-user.schema.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * Validated patch DTO for the authenticated user's editable profile fields.
 * Used backward by CurrentUserController; connects forward to CurrentUserService.
 */
import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

// * DTO [UpdateCurrentUserSchema]: Validates and documents data crossing the HTTP boundary.
export class UpdateCurrentUserSchema {
  @ApiPropertyOptional({ description: 'Preferred language/locale.', example: 'en-IN' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  preferredLocale?: string;
  @ApiPropertyOptional({ description: 'IANA timezone.', example: 'Asia/Kolkata' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  timezone?: string;
  @ApiPropertyOptional({ description: 'Updated first name.', example: 'Aarav' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName?: string;
  @ApiPropertyOptional({ description: 'Updated last name.', example: 'Sharma' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName?: string;
  @ApiPropertyOptional({ description: 'Updated preferred name.', example: 'Aarav' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  preferredName?: string;
  @ApiPropertyOptional({
    description: 'Public avatar file identifier.',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  avatarFileId?: string;
}
