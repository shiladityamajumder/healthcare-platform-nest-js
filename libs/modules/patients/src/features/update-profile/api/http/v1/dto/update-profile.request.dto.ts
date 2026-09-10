// Linked with: the feature controller and the public API contract.
// Used by: controllers and validation/serialization at the HTTP boundary.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
/** Transport DTO only. Do not reuse persistence entities as API contracts. */
// Define the transport shape used for validation, serialization, or API documentation.
export class UpdateProfileRequestDto {
  // Add validated request fields when implementing this feature.
}
