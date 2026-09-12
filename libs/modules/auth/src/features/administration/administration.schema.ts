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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStatusSchema {
  @ApiProperty({
    description: 'New lifecycle status for the target user.',
    enum: ['pending', 'active', 'locked', 'suspended', 'closed'],
    example: 'suspended',
  })
  @IsIn(['pending', 'active', 'locked', 'suspended', 'closed'])
  status!: string;
  @ApiProperty({
    description: 'Auditable reason for changing the user status.',
    example: 'Repeated failed login attempts.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  reason!: string;
  @ApiPropertyOptional({
    description: 'Revoke the user sessions after changing status.',
    default: true,
    example: true,
  })
  @IsBoolean()
  revokeSessions = true;
}

export class AdminLogoutSchema {
  @ApiProperty({
    description: 'Auditable reason for revoking all sessions.',
    default: 'administrative_logout_all',
    example: 'Security incident response',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  reason = 'administrative_logout_all';
}

export class CreateRoleSchema {
  @ApiProperty({
    description: 'Stable role code used by authorization checks.',
    example: 'clinic_admin',
  })
  @Matches(/^[a-z][a-z0-9_.-]{1,63}$/)
  code!: string;
  @ApiProperty({ description: 'Human-readable role name.', example: 'Clinic Administrator' })
  @IsString()
  @MinLength(2)
  @MaxLength(128)
  name!: string;
  @ApiPropertyOptional({
    description: 'Optional explanation of the role responsibility.',
    example: 'Manages users and settings for a clinic.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}

export class UpdateRoleSchema {
  @ApiPropertyOptional({ description: 'Replacement stable role code.', example: 'clinic_manager' })
  @IsOptional()
  @Matches(/^[a-z][a-z0-9_.-]{1,63}$/)
  code?: string;
  @ApiPropertyOptional({
    description: 'Replacement human-readable role name.',
    example: 'Clinic Manager',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(128)
  name?: string;
  @ApiPropertyOptional({
    description: 'Replacement role description.',
    example: 'Manages clinic operations.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}

export class CreatePermissionSchema {
  @ApiProperty({ description: 'Stable permission code.', example: 'user.read' })
  @Matches(/^[a-z][a-z0-9_.:-]{1,127}$/)
  code!: string;
  @ApiProperty({ description: 'Resource protected by the permission.', example: 'user' })
  @Matches(/^[a-z][a-z0-9_.-]{1,63}$/)
  resource!: string;
  @ApiProperty({ description: 'Action allowed on the resource.', example: 'read' })
  @Matches(/^[a-z][a-z0-9_-]{1,63}$/)
  action!: string;
  @ApiPropertyOptional({
    description: 'Optional explanation of the permission.',
    example: 'View user details.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}

export class UpdatePermissionSchema {
  @ApiPropertyOptional({ description: 'Replacement permission code.', example: 'user.update' })
  @IsOptional()
  @Matches(/^[a-z][a-z0-9_.:-]{1,127}$/)
  code?: string;
  @ApiPropertyOptional({ description: 'Replacement protected resource.', example: 'user' })
  @IsOptional()
  @Matches(/^[a-z][a-z0-9_.-]{1,63}$/)
  resource?: string;
  @ApiPropertyOptional({ description: 'Replacement allowed action.', example: 'update' })
  @IsOptional()
  @Matches(/^[a-z][a-z0-9_-]{1,63}$/)
  action?: string;
  @ApiPropertyOptional({
    description: 'Replacement permission description.',
    example: 'Update user details.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}

export class ReplaceRolePermissionsSchema {
  @ApiProperty({
    description: 'Complete list of permission UUIDs that should belong to the role.',
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  @IsArray()
  @ArrayMaxSize(1000)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  permissionIds: string[] = [];
}

export class AssignUserRoleSchema {
  @ApiProperty({
    description: 'Role UUID to assign.',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  roleId!: string;
  @ApiPropertyOptional({
    description: 'Scope category for a scoped assignment.',
    example: 'clinic',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  scopeType?: string;
  @ApiPropertyOptional({
    description: 'Optional UUID of the scope.',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  scopeId?: string;
  @ApiPropertyOptional({
    description: 'ISO-8601 time when the assignment becomes active.',
    format: 'date-time',
    example: '2026-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validFrom?: Date;
  @ApiPropertyOptional({
    description: 'ISO-8601 time when the assignment expires.',
    format: 'date-time',
    example: '2026-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validUntil?: Date;
  @ApiPropertyOptional({
    description: 'Whether the assignment is active immediately.',
    default: true,
    example: true,
  })
  @IsBoolean()
  isActive = true;
}

export class UpdateUserRoleSchema {
  @ApiPropertyOptional({ description: 'Replacement scope category.', example: 'clinic' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  scopeType?: string;
  @ApiPropertyOptional({
    description: 'Replacement scope UUID.',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  scopeId?: string;
  @ApiPropertyOptional({
    description: 'Replacement assignment start time.',
    format: 'date-time',
    example: '2026-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validFrom?: Date;
  @ApiPropertyOptional({
    description: 'Replacement assignment expiry time.',
    format: 'date-time',
    example: '2026-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validUntil?: Date;
  @ApiPropertyOptional({ description: 'Enable or disable the assignment.', example: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ListUsersQuerySchema {
  @ApiPropertyOptional({
    description: 'Maximum number of users to return.',
    minimum: 1,
    maximum: 100,
    default: 20,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
  @ApiPropertyOptional({
    description: 'Number of users to skip.',
    minimum: 0,
    maximum: 100000,
    default: 0,
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100000)
  offset = 0;
  @ApiPropertyOptional({
    description: 'Search by supported user identity fields.',
    minLength: 2,
    maxLength: 320,
    example: 'user@example.com',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(320)
  search?: string;
  @ApiPropertyOptional({
    description: 'Filter users by lifecycle status.',
    enum: ['pending', 'active', 'locked', 'suspended', 'closed'],
    example: 'active',
  })
  @IsOptional()
  @IsIn(['pending', 'active', 'locked', 'suspended', 'closed'])
  status?: string;
}
