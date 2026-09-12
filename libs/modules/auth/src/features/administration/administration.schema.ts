/**
 * Validated request DTOs for administrative users, roles, permissions, and assignments.
 * Used backward by AdministrationController; connects forward to AdministrationService input.
 */
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDate,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStatusSchema {
  @IsIn(['pending', 'active', 'locked', 'suspended', 'closed']) status!: string;
  @IsString() @MinLength(3) @MaxLength(255) reason!: string;
  @IsBoolean() revokeSessions = true;
}

export class AdminLogoutSchema {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  reason = 'administrative_logout_all';
}

export class CreateRoleSchema {
  @Matches(/^[a-z][a-z0-9_.-]{1,63}$/) code!: string;
  @IsString() @MinLength(2) @MaxLength(128) name!: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
}

export class UpdateRoleSchema {
  @IsOptional() @Matches(/^[a-z][a-z0-9_.-]{1,63}$/) code?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(128) name?: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
}

export class CreatePermissionSchema {
  @Matches(/^[a-z][a-z0-9_.:-]{1,127}$/) code!: string;
  @Matches(/^[a-z][a-z0-9_.-]{1,63}$/) resource!: string;
  @Matches(/^[a-z][a-z0-9_-]{1,63}$/) action!: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
}

export class UpdatePermissionSchema {
  @IsOptional() @Matches(/^[a-z][a-z0-9_.:-]{1,127}$/) code?: string;
  @IsOptional() @Matches(/^[a-z][a-z0-9_.-]{1,63}$/) resource?: string;
  @IsOptional() @Matches(/^[a-z][a-z0-9_-]{1,63}$/) action?: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
}

export class ReplaceRolePermissionsSchema {
  @IsArray()
  @ArrayMaxSize(1000)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  permissionIds: string[] = [];
}

export class AssignUserRoleSchema {
  @IsUUID() roleId!: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(32) scopeType?: string;
  @IsOptional() @IsUUID() scopeId?: string;
  @IsOptional() @Type(() => Date) @IsDate() validFrom?: Date;
  @IsOptional() @Type(() => Date) @IsDate() validUntil?: Date;
  @IsBoolean() isActive = true;
}

export class UpdateUserRoleSchema {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(32) scopeType?: string;
  @IsOptional() @IsUUID() scopeId?: string;
  @IsOptional() @Type(() => Date) @IsDate() validFrom?: Date;
  @IsOptional() @Type(() => Date) @IsDate() validUntil?: Date;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class ListUsersQuerySchema {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 20;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) @Max(100000) offset = 0;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(320) search?: string;
  @IsOptional() @IsIn(['pending', 'active', 'locked', 'suspended', 'closed']) status?: string;
}
