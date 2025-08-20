import { Rule, RuleSeverity, RuleType } from '../base';

export const headingStructureRule: Rule = {
  name: 'heading-structure',
  description: 'Detect improper heading hierarchy and missing heading levels',
  type: RuleType.A11Y,
  severity: RuleSeverity.WARN,
  check({ astPath }) {
    const tag = astPath.node.openingElement.name;
    if (tag.type !== 'JSXIdentifier' || !/^h[1-6]$/.test(tag.name)) return null;

    const headingLevel = parseInt(tag.name.charAt(1));
    
    // Check if heading level is appropriate (h1 should be main heading)
    if (headingLevel === 1) {
      // Check if this is the first h1 in the document
      // This is a simplified check - in a real implementation you'd need to analyze the full document
      return {
        name: 'heading-structure',
        type: RuleType.A11Y,
        severity: RuleSeverity.INFO,
        message: 'Ensure this h1 is the main heading and there is only one h1 per page',
      };
    }

    // TODO: Check for skipped heading levels (e.g., h1 -> h3)
    // This would require more context about previous headings in the document
    
    return null;
  },
}; 