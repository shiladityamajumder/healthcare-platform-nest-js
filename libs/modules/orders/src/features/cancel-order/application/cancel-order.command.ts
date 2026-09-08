export class CancelOrderCommand {
  constructor(public readonly input: Readonly<Record<string, unknown>>) {}
}
