export class CreatePaymentCommand {
  constructor(public readonly input: Readonly<Record<string, unknown>>) {}
}
