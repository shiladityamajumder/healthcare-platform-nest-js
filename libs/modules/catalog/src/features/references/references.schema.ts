// * Catalog module: Defines validated DTOs for reference-master endpoints.
// * File: src/features/references/references.schema.ts
// ? Keep transport contracts close to the references feature like the auth schemas.
export {
  BrandCreateDto,
  BrandUpdateDto,
  CategoryCreateDto,
  CategoryUpdateDto,
  DosageFormCreateDto,
  DosageFormUpdateDto,
  ManufacturerCreateDto,
  ManufacturerUpdateDto,
  ReferenceListQueryDto,
  SaltCreateDto,
  SaltUpdateDto,
  SubstitutionGroupCreateDto,
  SubstitutionGroupListQueryDto,
  SubstitutionGroupProductCreateDto,
  SubstitutionGroupProductUpdateDto,
  SubstitutionGroupUpdateDto,
  UnitCreateDto,
  UnitUpdateDto,
} from '../../contracts/catalog.schema';
