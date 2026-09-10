// Linked with: ./synonyms, ./redirects, ./documents.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the search PostgreSQL schema. */
// Describe the database row shape consumed by repositories and transaction code.
export type { SearchSynonymsRow } from './synonyms';
export type { SearchRedirectsRow } from './redirects';
export type { SearchDocumentsRow } from './documents';
export type { SearchIndexingJobsRow } from './indexing_jobs';
export type { SearchQueryEventsRow } from './query_events';
