import { Rule, RuleSeverity, RuleType } from '../base';

const FORM_INPUT_TAGS = ['input', 'select', 'textarea'];

export const formValidationRule: Rule = {
  name: 'form-validation',
  description: 'Detect form elements missing proper validation attributes',
  type: RuleType.FORM,
  severity: RuleSeverity.WARN,
  check({ astPath }) {
    const tag = astPath.node.openingElement.name;
    if (tag.type !== 'JSXIdentifier' || !FORM_INPUT_TAGS.includes(tag.name)) return null;

    const attributes = astPath.node.openingElement.attributes;
    
    // Check for required fields
    const isRequired = attributes.some(attr =>
      attr.type === 'JSXAttribute' && 
      (attr.name.name === 'required' || attr.name.name === 'aria-required')
    );

    // Check for proper input types
    if (tag.name === 'input') {
      const typeAttr = attributes.find(attr =>
        attr.type === 'JSXAttribute' && attr.name.name === 'type'
      );
      
      if (typeAttr && typeAttr.type === 'JSXAttribute' && typeAttr.value && typeAttr.value.type === 'StringLiteral') {
        const inputType = typeAttr.value.value;
        
        // Email inputs should have proper validation
        if (inputType === 'email' && !isRequired) {
          return {
            name: 'form-validation',
            type: RuleType.FORM,
            severity: RuleSeverity.WARN,
            message: 'Email input should have required attribute for better validation',
          };
        }
        
        // Password inputs should have proper attributes
        if (inputType === 'password') {
          const hasAriaDescribedby = attributes.some(attr =>
            attr.type === 'JSXAttribute' && attr.name.name === 'aria-describedby'
          );
          
          if (!hasAriaDescribedby) {
            return {
              name: 'form-validation',
              type: RuleType.FORM,
              severity: RuleSeverity.INFO,
              message: 'Password input should have aria-describedby for password requirements',
            };
          }
        }
      }
    }

    // Check for proper labels on required fields
    if (isRequired) {
      const hasAriaLabel = attributes.some(attr =>
        attr.type === 'JSXAttribute' && 
        (attr.name.name === 'aria-label' || attr.name.name === 'aria-labelledby')
      );
      
      if (!hasAriaLabel) {
        return {
          name: 'form-validation',
          type: RuleType.FORM,
          severity: RuleSeverity.WARN,
          message: 'Required form field should have aria-label or aria-labelledby',
        };
      }
    }

    return null;
  },
}; 