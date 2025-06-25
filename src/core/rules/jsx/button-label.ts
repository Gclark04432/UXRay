import { Rule, RuleSeverity, RuleType } from '../base';
import * as t from '@babel/types';

export const buttonLabelRule: Rule = {
  name: 'button-label',
  description: 'Detect <button> elements with no accessible label',
  type: RuleType.A11Y,
  severity: RuleSeverity.ERROR,
  check({ astPath }) {
    const el = astPath.node.openingElement;
    const tag = el.name;
    if (tag.type !== 'JSXIdentifier' || tag.name !== 'button') return null;

    const hasAriaLabel = el.attributes.some(attr =>
      attr.type === 'JSXAttribute' && attr.name.name === 'aria-label'
    );

    const hasChildren = astPath.node.children.some(child =>
      t.isJSXText(child) && child.value.trim().length > 0
    );

    if (!hasChildren && !hasAriaLabel) {
      return {
        name: 'button-label',
        type: RuleType.A11Y,
        severity: RuleSeverity.ERROR,
        message: '<button> has no text content or aria-label',
      };
    }

    return null;
  },
};
