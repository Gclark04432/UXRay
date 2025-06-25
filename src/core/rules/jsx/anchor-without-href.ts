import { Rule, RuleSeverity, RuleType } from '../base';

export const anchorHrefRule: Rule = {
  name: 'anchor-without-href',
  description: 'Detect <a> tags without href attribute',
  type: RuleType.SEMANTIC,
  severity: RuleSeverity.WARN,
  check({ astPath }) {
    const tag = astPath.node.openingElement.name;
    if (tag.type !== 'JSXIdentifier' || tag.name !== 'a') return null;

    const hasHref = astPath.node.openingElement.attributes.some(attr =>
      attr.type === 'JSXAttribute' && attr.name.name === 'href'
    );

    if (!hasHref) {
      return {
        name: 'anchor-without-href',
        type: RuleType.SEMANTIC,
        severity: RuleSeverity.WARN,
        message: '<a> tag is missing an href attribute',
      };
    }

    return null;
  },
};
