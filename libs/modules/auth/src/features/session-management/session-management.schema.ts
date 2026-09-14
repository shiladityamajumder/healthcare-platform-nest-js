// * Auth module: Defines validation and OpenAPI DTOs for session requests.
// * File: src/features/session-management/session-management.schema.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * Validated refresh-token request DTO.
 * Used backward by SessionManagementController; connects forward to SessionManagementService.
 */
import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// * DTO [RefreshTokenSchema]: Validates and documents data crossing the HTTP boundary.
export class RefreshTokenSchema {
  @ApiProperty({
    description: 'Refresh token returned by login, registration, or a previous refresh.',
    example: 'eyJhbGciOiJIUzI1NiIs...',
    format: 'password',
  })
  @IsString()
  @MinLength(32)
  @MaxLength(8192)
  refreshToken!: string;
}
