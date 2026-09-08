export class CapturePaymentCommand {
  constructor(public readonly input: Readonly<Record<string, unknown>>) {}
}
