export class ActivateUserCommand {
  constructor(public readonly input: Readonly<Record<string, unknown>>) {}
}
