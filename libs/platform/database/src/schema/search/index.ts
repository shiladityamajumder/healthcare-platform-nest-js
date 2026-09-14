// * Re-exports the typed PostgreSQL row shapes for the search schema.
// * Used by repositories that need compile-time row types without ORM entities.
// ! These exports describe an existing database; they do not create or modify tables.
/** Row shapes for the search PostgreSQL schema. */
export type { SearchSynonymsRow } from './synonyms';
export type { SearchRedirectsRow } from './redirects';
export type { SearchDocumentsRow } from './documents';
export type { SearchIndexingJobsRow } from './indexing_jobs';
export type { SearchQueryEventsRow } from './query_events';
