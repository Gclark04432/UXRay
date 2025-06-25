import { Rule, RuleSeverity, RuleType } from '../base';

export const missingAltTextRule: Rule = {
  name: 'missing-alt',
  description: 'Detect <img> tags missing alt attribute',
  type: RuleType.A11Y,
  severity: RuleSeverity.ERROR,
  check({ astPath }) {
    const tag = astPath.node.openingElement.name;
    if (tag.type !== 'JSXIdentifier' || tag.name !== 'img') return null;

    const hasAlt = astPath.node.openingElement.attributes.some(attr =>
      attr.type === 'JSXAttribute' && attr.name.name === 'alt'
    );

    if (!hasAlt) {
      return {
        name: 'missing-alt',
        type: RuleType.A11Y,
        severity: RuleSeverity.ERROR,
        message: '<img> tag is missing an alt attribute',
      };
    }

    return null;
  },
};
