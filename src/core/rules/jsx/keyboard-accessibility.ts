import { Rule, RuleSeverity, RuleType } from '../base';

const INTERACTIVE_TAGS = ['button', 'a', 'input', 'select', 'textarea', 'div', 'span'];

export const keyboardAccessibilityRule: Rule = {
  name: 'keyboard-accessibility',
  description: 'Detect interactive elements missing keyboard accessibility',
  type: RuleType.A11Y,
  severity: RuleSeverity.ERROR,
  check({ astPath }) {
    const el = astPath.node.openingElement;
    const tag = el.name;
    if (tag.type !== 'JSXIdentifier' || !INTERACTIVE_TAGS.includes(tag.name)) return null;

    const attributes = el.attributes;
    
    // Check if element is interactive
    const hasClickHandler = attributes.some(attr =>
      attr.type === 'JSXAttribute' && 
      (attr.name.name === 'onClick' || attr.name.name === 'onKeyDown' || attr.name.name === 'onKeyUp')
    );

    const hasRole = attributes.some(attr =>
      attr.type === 'JSXAttribute' && attr.name.name === 'role'
    );

    const isInteractive = hasClickHandler || hasRole;

    if (!isInteractive) return null;

    // Check for proper keyboard event handlers
    const hasKeyboardHandler = attributes.some(attr =>
      attr.type === 'JSXAttribute' && 
      (attr.name.name === 'onKeyDown' || attr.name.name === 'onKeyUp' || attr.name.name === 'onKeyPress')
    );

    // Check for tabindex
    const hasTabIndex = attributes.some(attr =>
      attr.type === 'JSXAttribute' && attr.name.name === 'tabIndex'
    );

    // Check for proper ARIA attributes
    const hasAriaAttributes = attributes.some(attr =>
      attr.type === 'JSXAttribute' && 
      (attr.name.name === 'aria-label' || attr.name.name === 'aria-labelledby' || attr.name.name === 'role')
    );

    // If element is interactive but not naturally focusable
    if (tag.name === 'div' || tag.name === 'span') {
      if (hasClickHandler && !hasTabIndex && !hasRole) {
        return {
          name: 'keyboard-accessibility',
          type: RuleType.A11Y,
          severity: RuleSeverity.ERROR,
          message: 'Interactive div/span should have tabIndex or role for keyboard accessibility',
        };
      }
    }

    // Check for Enter key support on interactive elements
    if (hasClickHandler && !hasKeyboardHandler) {
      return {
        name: 'keyboard-accessibility',
        type: RuleType.A11Y,
        severity: RuleSeverity.WARN,
        message: 'Interactive element should support keyboard events (Enter/Space)',
      };
    }

    // Check for proper focus management
    if (isInteractive && !hasAriaAttributes) {
      return {
        name: 'keyboard-accessibility',
        type: RuleType.A11Y,
        severity: RuleSeverity.WARN,
        message: 'Interactive element should have proper ARIA attributes for screen readers',
      };
    }

    return null;
  },
}; 