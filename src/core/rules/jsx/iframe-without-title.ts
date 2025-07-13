import { Rule, RuleSeverity, RuleType } from '../base';

export const iframeWithoutTitle: Rule = {
  name: 'iframe-without-title',
  description: 'Detect iframe elements without a title',
  type: RuleType.A11Y,
  severity: RuleSeverity.WARN,
  check({ astPath }) {
    const tag = astPath.node.openingElement.name;
    if (tag.type !== 'JSXIdentifier' || tag.name !== 'iframe' ) return null;

    const hasTitle = astPath.node.openingElement.attributes.some(attr =>
      attr.type === 'JSXAttribute' && attr.name.name === 'title'
    );

    if (!hasTitle) {
      return {
        name: 'iframe-without-title',
        type: RuleType.A11Y,
        severity: RuleSeverity.WARN,
        message: `iframe element is missing a title`,
      };
    }

    return null;
  },
};
