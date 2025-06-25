import fs from 'fs';
import path from 'path';
import { AuditResult } from './rules/base';

export function exportReport(
  result: AuditResult,
  format: 'json' | 'md',
  outFile: string
): void {
  let output = '';

  if (format === 'json') {
    output = JSON.stringify(result, null, 2);
  }

  if (format === 'md') {
    const violationsMd = result.violations.map((v, i) =>
      `### ${i + 1}. ${v.message}\n- **Type**: ${v.type}\n- **Severity**: ${v.severity}\n`
    ).join('\n');

    output = `# UXRay Audit Report

**Score**: ${result.score}  
**Passed Checks**: ${result.passedChecks} / ${result.totalChecks}  
**Violations**: ${result.violations.length}

${violationsMd || '✅ No violations found!'}
`;
  }

  fs.writeFileSync(path.resolve(outFile), output, 'utf-8');
  console.log(`\n📤 Report exported to: ${outFile}\n`);
}
