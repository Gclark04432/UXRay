import { Rule, RuleSeverity, RuleType } from '../base';

export const tableAccessibilityRule: Rule = {
  name: 'table-accessibility',
  description: 'Detect tables missing proper accessibility features',
  type: RuleType.A11Y,
  severity: RuleSeverity.WARN,
  check({ astPath }) {
    const tag = astPath.node.openingElement.name;
    if (tag.type !== 'JSXIdentifier' || tag.name !== 'table') return null;

    const attributes = astPath.node.openingElement.attributes;
    
    // Check for table caption
    const hasCaption = astPath.node.children.some(child =>
      child.type === 'JSXElement' && 
      child.openingElement.name.type === 'JSXIdentifier' &&
      child.openingElement.name.name === 'caption'
    );

    // Check for table headers
    const hasHeaders = astPath.node.children.some(child =>
      child.type === 'JSXElement' && 
      child.openingElement.name.type === 'JSXIdentifier' &&
      child.openingElement.name.name === 'thead'
    );

    // Check for proper ARIA attributes
    const hasAriaLabel = attributes.some(attr =>
      attr.type === 'JSXAttribute' && 
      (attr.name.name === 'aria-label' || attr.name.name === 'aria-labelledby')
    );

    // Check for table summary (deprecated but still used)
    const hasSummary = attributes.some(attr =>
      attr.type === 'JSXAttribute' && attr.name.name === 'summary'
    );

    if (!hasCaption && !hasAriaLabel && !hasSummary) {
      return {
        name: 'table-accessibility',
        type: RuleType.A11Y,
        severity: RuleSeverity.WARN,
        message: 'Table should have a caption, aria-label, or summary for accessibility',
      };
    }

    if (!hasHeaders) {
      return {
        name: 'table-accessibility',
        type: RuleType.A11Y,
        severity: RuleSeverity.WARN,
        message: 'Table should have proper header structure (thead) for accessibility',
      };
    }

    return null;
  },
}; 