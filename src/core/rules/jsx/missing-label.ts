import { Rule, RuleSeverity, RuleType } from '../base';

export const missingLabelRule: Rule = {
  name: 'missing-label',
  description: 'Detect input elements without labels or identifiers',
  type: RuleType.FORM,
  severity: RuleSeverity.WARN,
  check({ astPath }) {
    const tag = astPath.node.openingElement.name;
    if (tag.type !== 'JSXIdentifier' || tag.name !== 'input') return null;

    const hasId = astPath.node.openingElement.attributes.some(attr =>
      attr.type === 'JSXAttribute' && attr.name.name === 'id'
    );

    if (!hasId) {
      return {
        name: 'missing-label',
        type: RuleType.FORM,
        severity: RuleSeverity.WARN,
        message: 'Input element may be missing an associated <label> (no id or label found)',
      };
    }

    return null;
  },
};
