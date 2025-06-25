import fs from 'fs';
import path from 'path';
import * as babelParser from '@babel/parser';
import traverse from '@babel/traverse';
import { runRules } from './rule-engine';
import { missingLabelRule } from './rules/jsx/missing-label';
import { missingAltTextRule } from './rules/jsx/missing-alt';
import { buttonLabelRule } from './rules/jsx/button-label';
import { anchorHrefRule } from './rules/jsx/anchor-without-href';
import { Violation, AuditResult } from './rules/base';

export function analyzeFile(filePath: string): AuditResult {
  const sourceCode = fs.readFileSync(path.resolve(filePath), 'utf-8');

  const ast = babelParser.parse(sourceCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  const violations: Violation[] = [];

const rules = [
  missingLabelRule,
  missingAltTextRule,
  buttonLabelRule,
  anchorHrefRule,
];

  traverse(ast, {
    JSXElement(path) {
      const ctx = { astPath: path, sourceCode };
      const results = runRules(rules, ctx);
      violations.push(...results);
    },
  });

  const totalChecks = rules.length;
  const passedChecks = totalChecks - violations.length;
  const score = Math.max(0, Math.round((passedChecks / totalChecks) * 100));

  return {
    totalChecks,
    passedChecks,
    violations,
    score,
  };
}
