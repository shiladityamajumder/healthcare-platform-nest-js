export class UpdateUserCommand {
  constructor(public readonly input: Readonly<Record<string, unknown>>) {}
}
