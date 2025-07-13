import { Rule, RuleSeverity, RuleType } from '../base';

const JSX_TAGS = ['input', 'select', 'textarea']

export const missingLabelRule: Rule = {
  name: 'missing-label',
  description: 'Detect input elements without labels or identifiers',
  type: RuleType.FORM,
  severity: RuleSeverity.WARN,
  check({ astPath }) {
    const tag = astPath.node.openingElement.name;
    if (tag.type !== 'JSXIdentifier' || !JSX_TAGS.includes(tag.name)) return null;

    const hasId = astPath.node.openingElement.attributes.some(attr =>
      attr.type === 'JSXAttribute' && attr.name.name === 'id'
    );

    if (!hasId) {
      tag.name = String(tag.name).charAt(0).toUpperCase() + String(tag.name).slice(1);
      return {
        name: 'missing-label',
        type: RuleType.FORM,
        severity: RuleSeverity.WARN,
        message: `${tag.name} element may be missing an associated <label> (no id or label found)`,
      };
    }

    return null;
  },
};
