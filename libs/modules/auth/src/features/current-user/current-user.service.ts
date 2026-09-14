// * Auth module: Loads and updates the authenticated user context.
// * File: src/features/current-user/current-user.service.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * Authenticated profile read, update, and authorization use cases.
 * Used backward by CurrentUserController; connects forward to workflow and identity persistence.
 */
import { Injectable } from '@nestjs/common';
import { AuthenticationError } from '@shared/errors';
import { AuthWorkflowService } from '../../application/workflow/auth-workflow.service';
import { toAuthInput } from '../../contracts/auth-context';
import { IdentityRepository } from '../registration/identity.repository';

type AuthInput = object;

@Injectable()
export class CurrentUserService {
  // * Function [constructor]: Initializes the component with its required dependencies.
  public constructor(
    private readonly workflow: AuthWorkflowService,
    private readonly identity: IdentityRepository,
  ) {}

  // * Function [get]: Retrieves and returns the requested authentication data.
  async get(authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    const user = await this.identity.findUserById(principal.userId);
    if (!user) throw new AuthenticationError();
    return user;
  }

  // * Function [update]: Updates the requested authentication state after validation.
  async update(input: AuthInput, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    const values = toAuthInput(input);
    const accountUpdates: Record<string, unknown> = {};
    if (values.preferredLocale !== undefined)
      accountUpdates.preferred_locale = values.preferredLocale;
    if (values.timezone !== undefined) accountUpdates.timezone = values.timezone;
    const existing = await this.identity.findUserById(principal.userId);
    if (!existing) throw new AuthenticationError();
    // Account and profile updates use the same request transaction.
    await this.identity.updateUser(principal.userId, accountUpdates);
    await this.identity.createProfile(principal.userId, {
      firstName: values.firstName as string | null | undefined,
      lastName: values.lastName as string | null | undefined,
      preferredName: values.preferredName as string | null | undefined,
      avatarFileId: values.avatarFileId as string | null | undefined,
    });
    const updated = await this.identity.findUserById(principal.userId);
    if (!updated) throw new AuthenticationError();
    return updated;
  }

  // * Function [authorization]: Retrieves and returns the requested authentication data.
  async authorization(authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    return { roles: principal.roles.sort(), permissions: principal.permissions.sort() };
  }
}
