import { Rule, RuleSeverity, RuleType } from '../base';

export const ariaValidationRule: Rule = {
  name: 'aria-validation',
  description: 'Validate proper ARIA attribute usage and relationships',
  type: RuleType.A11Y,
  severity: RuleSeverity.ERROR,
  check({ astPath }) {
    const el = astPath.node.openingElement;
    const tag = el.name;
    if (tag.type !== 'JSXIdentifier') return null;

    const attributes = el.attributes;
    
    // Check for invalid ARIA attributes
    const ariaAttributes = attributes.filter(attr =>
      attr.type === 'JSXAttribute' && 
      typeof attr.name.name === 'string' && attr.name.name.startsWith('aria-')
    );

    for (const attr of ariaAttributes) {
      if (attr.type !== 'JSXAttribute') continue;
      
      const attrName = attr.name.name;
      
      // Check for common ARIA mistakes
      if (attrName === 'aria-label' && attr.value) {
        if (attr.value.type === 'StringLiteral' && attr.value.value.trim() === '') {
          return {
            name: 'aria-validation',
            type: RuleType.A11Y,
            severity: RuleSeverity.ERROR,
            message: 'aria-label should not be empty',
          };
        }
      }
      
      // Check for conflicting ARIA attributes
      if (attrName === 'aria-hidden' && attr.value) {
        if (attr.value.type === 'StringLiteral' && attr.value.value === 'true') {
          // Check if element has other ARIA attributes (conflicting)
          const hasOtherAria = ariaAttributes.some(otherAttr =>
            otherAttr !== attr && 
            otherAttr.type === 'JSXAttribute' &&
            otherAttr.name.name !== 'aria-hidden'
          );
          
          if (hasOtherAria) {
            return {
              name: 'aria-validation',
              type: RuleType.A11Y,
              severity: RuleSeverity.WARN,
              message: 'aria-hidden="true" should not be used with other ARIA attributes',
            };
          }
        }
      }
      
      // Check for proper ARIA relationships
      if (attrName === 'aria-labelledby' || attrName === 'aria-describedby') {
        if (attr.value && attr.value.type === 'StringLiteral') {
          const referencedId = attr.value.value;
          if (referencedId.trim() === '') {
            return {
              name: 'aria-validation',
              type: RuleType.A11Y,
              severity: RuleSeverity.ERROR,
              message: `${attrName} should reference a valid element ID`,
            };
          }
        }
      }
    }

    // Check for missing required ARIA attributes
    if (tag.name === 'button') {
      const hasAriaExpanded = attributes.some(attr =>
        attr.type === 'JSXAttribute' && attr.name.name === 'aria-expanded'
      );
      
      // If button toggles content, it should have aria-expanded
      // This is a simplified check - would need more context in real implementation
      const hasToggleBehavior = attributes.some(attr =>
        attr.type === 'JSXAttribute' && 
        (attr.name.name === 'onClick' || attr.name.name === 'onToggle')
      );
      
      if (hasToggleBehavior && !hasAriaExpanded) {
        return {
          name: 'aria-validation',
          type: RuleType.A11Y,
          severity: RuleSeverity.WARN,
          message: 'Button with toggle behavior should have aria-expanded attribute',
        };
      }
    }

    return null;
  },
}; 