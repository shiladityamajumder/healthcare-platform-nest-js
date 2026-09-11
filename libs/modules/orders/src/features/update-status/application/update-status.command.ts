// * Linked with: the surrounding package and its exported types.
// * Used by: the feature module/controller and the domain or infrastructure ports it coordinates.
// * Other linkup: This layer keeps transport concerns separate from domain rules and persistence details.
export class UpdateStatusCommand {
  constructor(public readonly input: Readonly<Record<string, unknown>>) {}
}
