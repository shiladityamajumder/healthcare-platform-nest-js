// Linked with: ./categories, ./salts, ./dosage_forms.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the catalog PostgreSQL schema. */
// Describe the database row shape consumed by repositories and transaction code.
export type { CatalogCategoriesRow } from './categories';
export type { CatalogSaltsRow } from './salts';
export type { CatalogDosageFormsRow } from './dosage_forms';
export type { CatalogUnitsOfMeasureRow } from './units_of_measure';
export type { CatalogManufacturersRow } from './manufacturers';
export type { CatalogSubstitutionGroupsRow } from './substitution_groups';
export type { CatalogBrandsRow } from './brands';
export type { CatalogProductsRow } from './products';
export type { CatalogProductVariantsRow } from './product_variants';
export type { CatalogProductSaltsRow } from './product_salts';
export type { CatalogProductAttributesRow } from './product_attributes';
export type { CatalogProductRelationshipsRow } from './product_relationships';
export type { CatalogProductRegulatoryRow } from './product_regulatory';
export type { CatalogProductContentRow } from './product_content';
export type { CatalogSubstitutionGroupProductsRow } from './substitution_group_products';
export type { CatalogProductIdentifiersRow } from './product_identifiers';
export type { CatalogProductMediaRow } from './product_media';
