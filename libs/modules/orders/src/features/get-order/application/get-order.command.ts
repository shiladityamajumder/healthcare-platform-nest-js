export class GetOrderCommand {
  constructor(public readonly input: Readonly<Record<string, unknown>>) {}
}
