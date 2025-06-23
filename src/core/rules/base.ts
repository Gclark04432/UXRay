import type { NodePath } from '@babel/traverse';
import type { JSXElement } from '@babel/types';

export enum RuleType {
    A11Y = 'a11y',
    FORM = 'form',
    SEMANTIC = 'semantic'
}

export enum RuleSeverity {
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

export type RuleContext = {
  astPath: NodePath<JSXElement>;
  sourceCode: string;
};

export interface Rule {
  name: string;
  description: string;
  type: RuleType;
  severity: RuleSeverity;
  check: (ctx: RuleContext) => Violation | null;
}

export interface Violation {
  name: string;
  type: Rule['type'];
  severity: Rule['severity'];
  message: string;
  location?: string;
}

export interface AuditResult {
  totalChecks: number;
  passedChecks: number;
  violations: Violation[];
  score: number;
}