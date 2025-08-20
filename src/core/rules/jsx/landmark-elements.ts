import { Rule, RuleSeverity, RuleType } from '../base';

const LANDMARK_TAGS = ['nav', 'main', 'aside', 'header', 'footer', 'section', 'article'];

export const landmarkElementsRule: Rule = {
  name: 'landmark-elements',
  description: 'Detect missing or improper landmark elements for page structure',
  type: RuleType.A11Y,
  severity: RuleSeverity.WARN,
  check({ astPath }) {
    const tag = astPath.node.openingElement.name;
    if (tag.type !== 'JSXIdentifier' || !LANDMARK_TAGS.includes(tag.name)) return null;

    // Check if landmark has proper ARIA role or semantic meaning
    const hasAriaRole = astPath.node.openingElement.attributes.some(attr =>
      attr.type === 'JSXAttribute' && attr.name.name === 'role'
    );

    // For section and article, check if they have proper headings
    if ((tag.name === 'section' || tag.name === 'article') && !hasAriaRole) {
      const hasHeading = astPath.node.children.some(child =>
        child.type === 'JSXElement' && 
        child.openingElement.name.type === 'JSXIdentifier' &&
        /^h[1-6]$/.test(child.openingElement.name.name)
      );

      if (!hasHeading) {
        return {
          name: 'landmark-elements',
          type: RuleType.A11Y,
          severity: RuleSeverity.WARN,
          message: `${tag.name} element should have a heading or aria-label for accessibility`,
        };
      }
    }

    return null;
  },
}; 