import { Module } from '@nestjs/common';
import { CreateUserModule } from './features/create-user/create-user.module';
import { GetUserModule } from './features/get-user/get-user.module';
import { ListUsersModule } from './features/list-users/list-users.module';
import { UpdateUserModule } from './features/update-user/update-user.module';
import { ActivateUserModule } from './features/activate-user/activate-user.module';
import { RolesModule } from './features/roles/roles.module';

/** Composition root for the UserManagement bounded context. */
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
