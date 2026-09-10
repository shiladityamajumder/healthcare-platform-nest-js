// Linked with: @nestjs/common, ./features/create-user/create-user.module, ./features/get-user/get-user.module.
// Used by: the application module or feature root during NestJS startup.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreateUserModule } from './features/create-user/create-user.module';
import { GetUserModule } from './features/get-user/get-user.module';
import { ListUsersModule } from './features/list-users/list-users.module';
import { UpdateUserModule } from './features/update-user/update-user.module';
import { ActivateUserModule } from './features/activate-user/activate-user.module';
import { RolesModule } from './features/roles/roles.module';

/** Composition root for the UserManagement bounded context. */
// Register the feature components and their dependencies with NestJS.
@Module({
  imports: [
    CreateUserModule,
    GetUserModule,
    ListUsersModule,
    UpdateUserModule,
    ActivateUserModule,
    RolesModule,
  ],
  exports: [],
})
export class UserManagementModule {}
