export class UpdateProductCommand {
  constructor(public readonly input: Readonly<Record<string, unknown>>) {}
}
