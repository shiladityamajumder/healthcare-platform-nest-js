/**
 * Validated patch DTO for the authenticated user's editable profile fields.
 * Used backward by CurrentUserController; connects forward to CurrentUserService.
 */
import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateCurrentUserSchema {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(16) preferredLocale?: string;
  @IsOptional() @IsString() @MinLength(3) @MaxLength(64) timezone?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) firstName?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) lastName?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) preferredName?: string;
  @IsOptional() @IsUUID() avatarFileId?: string;
}
