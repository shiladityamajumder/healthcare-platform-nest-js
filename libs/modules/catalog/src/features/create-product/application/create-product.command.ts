export class CreateProductCommand {
  constructor(public readonly input: Readonly<Record<string, unknown>>) {}
}
