import { Rule, Violation } from './rules/base';
import { NodePath } from '@babel/traverse';
import { JSXElement } from '@babel/types';

export function runRules(
  rules: Rule[],
  ctx: { astPath: NodePath<JSXElement>; sourceCode: string }
): Violation[] {
  const results: Violation[] = [];

  for (const rule of rules) {
    const violation = rule.check(ctx);
    if (violation) {
      results.push(violation);
    }
  }

  return results;
}
