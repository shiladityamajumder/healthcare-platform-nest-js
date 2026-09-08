export class CreateUserCommand {
  constructor(public readonly input: Readonly<Record<string, unknown>>) {}
}
