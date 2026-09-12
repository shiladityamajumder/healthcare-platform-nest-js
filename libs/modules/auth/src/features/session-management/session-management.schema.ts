/**
 * Validated refresh-token request DTO.
 * Used backward by SessionManagementController; connects forward to SessionManagementService.
 */
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RefreshTokenSchema {
  @IsString() @MinLength(32) @MaxLength(8192) refreshToken!: string;
}
