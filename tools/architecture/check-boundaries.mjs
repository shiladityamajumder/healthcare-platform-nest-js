// Linked with: node:fs, node:path.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import fs from 'node:fs';
import path from 'node:path';

// Define the shared types or behavior used by the surrounding package.
const root = process.cwd();
const modulesRoot = path.join(root, 'libs', 'modules');
const sourceRoots = [path.join(root, 'apps'), path.join(root, 'libs')];
const errors = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(ts|mts)$/.test(entry.name) ? [full] : [];
  });
}

function moduleNameOf(file) {
  const rel = path.relative(modulesRoot, file).replaceAll('\\', '/');
  if (rel.startsWith('..')) return null;
  return rel.split('/')[0];
}

function layerOf(file) {
  const n = file.replaceAll('\\', '/');
  if (n.includes('/domain/')) return 'domain';
  if (n.includes('/application/')) return 'application';
  if (n.includes('/infrastructure/')) return 'infrastructure';
  if (n.includes('/api/')) return 'api';
  return null;
}

function resolveRelative(from, specifier) {
  if (!specifier.startsWith('.')) return null;
  return path.resolve(path.dirname(from), specifier);
}

const importRegex = /(?:import|export)\s+(?:type\s+)?(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g;
for (const file of sourceRoots.flatMap(walk)) {
  const text = fs.readFileSync(file, 'utf8');
  const currentModule = moduleNameOf(file);
  const currentLayer = layerOf(file);
  for (const match of text.matchAll(importRegex)) {
    const spec = match[1];

    if (spec.startsWith('@modules/')) {
      const parts = spec.split('/');
      if (parts.length !== 2) {
        errors.push(
          `${path.relative(root, file)} -> ${spec}: import bounded contexts only through @modules/<name>.`,
        );
      }
      continue;
    }

    const resolved = resolveRelative(file, spec);
    if (!resolved) continue;
    const targetModule = moduleNameOf(resolved);
    const targetLayer = layerOf(resolved);

    if (currentModule && targetModule && currentModule !== targetModule) {
      errors.push(
        `${path.relative(root, file)} -> ${spec}: relative cross-module import is forbidden.`,
      );
    }

    if (currentModule && targetModule === currentModule) {
      if (
        currentLayer === 'domain' &&
        ['application', 'infrastructure', 'api'].includes(targetLayer)
      ) {
        errors.push(
          `${path.relative(root, file)} -> ${spec}: domain must not depend on ${targetLayer}.`,
        );
      }
      if (currentLayer === 'application' && ['infrastructure', 'api'].includes(targetLayer)) {
        errors.push(
          `${path.relative(root, file)} -> ${spec}: application must depend on ports, not ${targetLayer}.`,
        );
      }
    }
  }
}

for (const file of walk(path.join(root, 'libs', 'platform'))) {
  const text = fs.readFileSync(file, 'utf8');
  if (text.includes('@modules/'))
    errors.push(`${path.relative(root, file)}: platform cannot depend on business modules.`);
}
for (const file of walk(path.join(root, 'libs', 'shared-kernel'))) {
  const text = fs.readFileSync(file, 'utf8');
  if (text.includes('@modules/') || text.includes('@platform/')) {
    errors.push(
      `${path.relative(root, file)}: shared-kernel cannot depend on platform or business modules.`,
    );
  }
}

if (errors.length) {
  console.error('Architecture boundary violations:\n' + errors.map((e) => ` - ${e}`).join('\n'));
  process.exit(1);
}
console.log('Architecture boundaries OK.');
