// * Auth module: Adapts shared persistence services to the authentication repository port.
// * File: src/infrastructure/persistence/auth.repository.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * Small compatibility facade that exposes feature-owned repositories through AuthRepositoryPort.
 * Used backward by AuthWorkflowService; connects forward to identity, OTP, session, and administration repositories.
 * It contains no SQL and preserves one transaction context across all delegated queries.
 */
import { Injectable } from '@nestjs/common';
import { AdministrationRepository } from '../../features/administration/administration.repository';
import { IdentityRepository } from '../../features/registration/identity.repository';
import { OtpRepository } from '../../features/registration/otp.repository';
import { SessionRepository } from '../../features/session-management/session.repository';
import type { AuthRepositoryPort } from '../../contracts/auth.ports';

@Injectable()
export class AuthPostgresRepository implements AuthRepositoryPort {
  public readonly findUserById: AuthRepositoryPort['findUserById'];
  public readonly findUserByEmail: AuthRepositoryPort['findUserByEmail'];
  public readonly findUserByPhone: AuthRepositoryPort['findUserByPhone'];
  public readonly findUserForLogin: AuthRepositoryPort['findUserForLogin'];
  public readonly createUser: AuthRepositoryPort['createUser'];
  public readonly updateUser: AuthRepositoryPort['updateUser'];
  public readonly createProfile: AuthRepositoryPort['createProfile'];
  public readonly findRoleByCode: AuthRepositoryPort['findRoleByCode'];
  public readonly assignRole: AuthRepositoryPort['assignRole'];
  public readonly authorization: AuthRepositoryPort['authorization'];
  public readonly listUsers: AuthRepositoryPort['listUsers'];
  public readonly createOtp: AuthRepositoryPort['createOtp'];
  public readonly findOtp: AuthRepositoryPort['findOtp'];
  public readonly consumeOtp: AuthRepositoryPort['consumeOtp'];
  public readonly createSession: AuthRepositoryPort['createSession'];
  public readonly findSession: AuthRepositoryPort['findSession'];
  public readonly rotateSession: AuthRepositoryPort['rotateSession'];
  public readonly revokeSession: AuthRepositoryPort['revokeSession'];
  public readonly revokeOtherSessions: AuthRepositoryPort['revokeOtherSessions'];
  public readonly revokeAllSessions: AuthRepositoryPort['revokeAllSessions'];
  public readonly listSessions: AuthRepositoryPort['listSessions'];
  public readonly listRoles: AuthRepositoryPort['listRoles'];
  public readonly findRole: AuthRepositoryPort['findRole'];
  public readonly createRole: AuthRepositoryPort['createRole'];
  public readonly updateRole: AuthRepositoryPort['updateRole'];
  public readonly deleteRole: AuthRepositoryPort['deleteRole'];
  public readonly listPermissions: AuthRepositoryPort['listPermissions'];
  public readonly findPermission: AuthRepositoryPort['findPermission'];
  public readonly createPermission: AuthRepositoryPort['createPermission'];
  public readonly updatePermission: AuthRepositoryPort['updatePermission'];
  public readonly deletePermission: AuthRepositoryPort['deletePermission'];
  public readonly rolePermissions: AuthRepositoryPort['rolePermissions'];
  public readonly replaceRolePermissions: AuthRepositoryPort['replaceRolePermissions'];
  public readonly userRoles: AuthRepositoryPort['userRoles'];
  public readonly assignUserRole: AuthRepositoryPort['assignUserRole'];
  public readonly updateUserRole: AuthRepositoryPort['updateUserRole'];
  public readonly deleteUserRole: AuthRepositoryPort['deleteUserRole'];

  // * Function [constructor]: Initializes the component with its required dependencies.
  public constructor(
    private readonly identity: IdentityRepository,
    private readonly otp: OtpRepository,
    private readonly sessions: SessionRepository,
    private readonly administration: AdministrationRepository,
  ) {
    this.findUserById = this.identity.findUserById.bind(this.identity);
    this.findUserByEmail = this.identity.findUserByEmail.bind(this.identity);
    this.findUserByPhone = this.identity.findUserByPhone.bind(this.identity);
    this.findUserForLogin = this.identity.findUserForLogin.bind(this.identity);
    this.createUser = this.identity.createUser.bind(this.identity);
    this.updateUser = this.identity.updateUser.bind(this.identity);
    this.createProfile = this.identity.createProfile.bind(this.identity);
    this.findRoleByCode = this.identity.findRoleByCode.bind(this.identity);
    this.assignRole = this.identity.assignRole.bind(this.identity);
    this.authorization = this.identity.authorization.bind(this.identity);
    this.listUsers = this.identity.listUsers.bind(this.identity);
    this.createOtp = this.otp.createOtp.bind(this.otp);
    this.findOtp = this.otp.findOtp.bind(this.otp);
    this.consumeOtp = this.otp.consumeOtp.bind(this.otp);
    this.createSession = this.sessions.createSession.bind(this.sessions);
    this.findSession = this.sessions.findSession.bind(this.sessions);
    this.rotateSession = this.sessions.rotateSession.bind(this.sessions);
    this.revokeSession = this.sessions.revokeSession.bind(this.sessions);
    this.revokeOtherSessions = this.sessions.revokeOtherSessions.bind(this.sessions);
    this.revokeAllSessions = this.sessions.revokeAllSessions.bind(this.sessions);
    this.listSessions = this.sessions.listSessions.bind(this.sessions);
    this.listRoles = this.administration.listRoles.bind(this.administration);
    this.findRole = this.administration.findRole.bind(this.administration);
    this.createRole = this.administration.createRole.bind(this.administration);
    this.updateRole = this.administration.updateRole.bind(this.administration);
    this.deleteRole = this.administration.deleteRole.bind(this.administration);
    this.listPermissions = this.administration.listPermissions.bind(this.administration);
    this.findPermission = this.administration.findPermission.bind(this.administration);
    this.createPermission = this.administration.createPermission.bind(this.administration);
    this.updatePermission = this.administration.updatePermission.bind(this.administration);
    this.deletePermission = this.administration.deletePermission.bind(this.administration);
    this.rolePermissions = this.administration.rolePermissions.bind(this.administration);
    this.replaceRolePermissions = this.administration.replaceRolePermissions.bind(
      this.administration,
    );
    this.userRoles = this.administration.userRoles.bind(this.administration);
    this.assignUserRole = this.administration.assignUserRole.bind(this.administration);
    this.updateUserRole = this.administration.updateUserRole.bind(this.administration);
    this.deleteUserRole = this.administration.deleteUserRole.bind(this.administration);
  }
}
