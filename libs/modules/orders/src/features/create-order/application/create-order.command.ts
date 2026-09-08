export class CreateOrderCommand {
  constructor(public readonly input: Readonly<Record<string, unknown>>) {}
}
