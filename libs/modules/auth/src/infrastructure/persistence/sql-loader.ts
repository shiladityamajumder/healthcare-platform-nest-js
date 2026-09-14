// * Auth module: Loads named SQL statements from the auth source-controlled SQL file.
// * File: src/infrastructure/persistence/sql-loader.ts
// ? SQL remains versioned with the module and is loaded without an ORM.
// ! Keep all values parameterized; this loader must never interpolate request data.
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const sqlFileName = 'auth.sql';
const sqlDirectory = join(__dirname, 'sql');
const sourceSqlDirectory = resolve(
  process.cwd(),
  'libs/modules/auth/src/infrastructure/persistence/sql',
);

let statements: Map<string, string> | undefined;

// * Function [loadAuthSql]: Reads and expands the named SQL statements used by auth repositories.
export function loadAuthSql(name: string): string {
  if (!statements) statements = parseSql(readFileSync(resolveSqlFile(), 'utf8'));
  const statement = statements.get(name);
  if (!statement) throw new Error(`Auth SQL statement not found: ${name}`);
  return statement;
}

// * Function [resolveSqlFile]: Selects the compiled SQL asset or the source-tree fallback.
function resolveSqlFile(): string {
  const compiled = join(sqlDirectory, sqlFileName);
  try {
    readFileSync(compiled);
    return compiled;
  } catch {
    return join(sourceSqlDirectory, sqlFileName);
  }
}

// * Function [parseSql]: Parses named SQL sections and resolves reusable SQL fragments.
function parseSql(source: string): Map<string, string> {
  const parsed = new Map<string, string>();
  const marker = /^-- name: ([A-Za-z0-9_.-]+)\s*$/gm;
  const matches = [...source.matchAll(marker)];
  for (let index = 0; index < matches.length; index++) {
    const current = matches[index];
    const start = (current.index ?? 0) + current[0].length;
    const end = matches[index + 1]?.index ?? source.length;
    parsed.set(current[1], source.slice(start, end).trim());
  }

  for (const [name, sql] of parsed) {
    parsed.set(
      name,
      sql.replace(/\{\{([A-Za-z0-9_.-]+)\}\}/g, (_match: string, fragment: string) => {
        const replacement = parsed.get(fragment);
        if (!replacement) throw new Error(`Auth SQL fragment not found: ${fragment}`);
        return replacement;
      }),
    );
  }
  return parsed;
}
