/**
 * Validated refresh-token request DTO.
 * Used backward by SessionManagementController; connects forward to SessionManagementService.
 */
import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
