export class CreatePrescriptionCommand {
  constructor(public readonly input: Readonly<Record<string, unknown>>) {}
}
