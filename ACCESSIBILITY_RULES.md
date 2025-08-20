# UXRay Accessibility Rules

This document outlines all the accessibility rules implemented in UXRay to help developers meet modern a11y standards.

### 1. **Anchor Elements** (`anchor-without-href`)
- **Purpose**: Ensures all `<a>` tags have an `href` attribute
- **Severity**: Warning
- **WCAG**: 2.1.1 (Level A) - Keyboard
- **Description**: Links without href attributes are not accessible to keyboard users and screen readers

### 2. **Button Labels** (`button-label`)
- **Purpose**: Ensures buttons have accessible labels
- **Severity**: Error
- **WCAG**: 4.1.2 (Level A) - Name, Role, Value
- **Description**: Buttons must have either text content or an `aria-label` attribute

### 3. **Image Alt Text** (`missing-alt`)
- **Purpose**: Ensures images have alternative text
- **Severity**: Error
- **WCAG**: 1.1.1 (Level A) - Non-text Content
- **Description**: Images without alt text are inaccessible to screen reader users

### 4. **Form Labels** (`missing-label`)
- **Purpose**: Ensures form inputs have associated labels
- **Severity**: Warning
- **WCAG**: 3.3.2 (Level A) - Labels or Instructions
- **Description**: Form fields should have proper labels or IDs for accessibility

### 5. **Iframe Titles** (`iframe-without-title`)
- **Purpose**: Ensures iframes have descriptive titles
- **Severity**: Warning
- **WCAG**: 2.4.1 (Level A) - Bypass Blocks
- **Description**: Iframes need titles to help users understand their content

### 6. **Heading Structure** (`heading-structure`)
- **Purpose**: Ensures proper heading hierarchy
- **Severity**: Warning
- **WCAG**: 1.3.1 (Level A) - Info and Relationships
- **Description**: Maintains logical document structure for screen readers

### 7. **Landmark Elements** (`landmark-elements`)
- **Purpose**: Validates semantic landmark usage
- **Severity**: Warning
- **WCAG**: 1.3.1 (Level A) - Info and Relationships
- **Description**: Ensures proper use of nav, main, aside, header, footer, section, and article elements

### 8. **Form Validation** (`form-validation`)
- **Purpose**: Checks form validation attributes
- **Severity**: Warning
- **WCAG**: 3.3.1 (Level A) - Error Identification
- **Description**: Ensures required fields have proper validation and accessibility attributes

### 9. **ARIA Validation** (`aria-validation`)
- **Purpose**: Validates ARIA attribute usage
- **Severity**: Error
- **WCAG**: 4.1.2 (Level A) - Name, Role, Value
- **Description**: Prevents common ARIA mistakes and ensures proper relationships

### 10. **Table Accessibility** (`table-accessibility`)
- **Purpose**: Ensures tables have proper accessibility features
- **Severity**: Warning
- **WCAG**: 1.3.1 (Level A) - Info and Relationships
- **Description**: Tables should have captions, headers, and proper ARIA attributes

### 11. **Keyboard Accessibility** (`keyboard-accessibility`)
- **Purpose**: Ensures interactive elements are keyboard accessible
- **Severity**: Error
- **WCAG**: 2.1.1 (Level A) - Keyboard
- **Description**: All interactive elements must be navigable and usable via keyboard

## Additional Rules to Consider

### Future Implementations

#### 12. **Color Contrast** (`color-contrast`)
- **Purpose**: Check for sufficient color contrast ratios
- **WCAG**: 1.4.3 (Level AA) - Contrast (Minimum)
- **Complexity**: High (requires CSS analysis)

#### 13. **Skip Links** (`skip-links`)
- **Purpose**: Ensure skip navigation links are present
- **WCAG**: 2.4.1 (Level A) - Bypass Blocks
- **Complexity**: Medium

#### 14. **Focus Management** (`focus-management`)
- **Purpose**: Validate proper focus indicators and management
- **WCAG**: 2.4.7 (Level AA) - Focus Visible
- **Complexity**: High (requires runtime analysis)

#### 15. **List Structure** (`list-structure`)
- **Purpose**: Ensure proper list markup
- **WCAG**: 1.3.1 (Level A) - Info and Relationships
- **Complexity**: Low

#### 16. **Media Accessibility** (`media-accessibility`)
- **Purpose**: Check video/audio accessibility
- **WCAG**: 1.2.1-1.2.8 (Level A-AAA) - Time-based Media
- **Complexity**: High

## Rule Categories

### **Critical (Error)**
- Button Labels
- Image Alt Text
- ARIA Validation
- Keyboard Accessibility

### **Important (Warning)**
- Anchor Href
- Form Labels
- Iframe Titles
- Heading Structure
- Landmark Elements
- Form Validation
- Table Accessibility

### **Informational (Info)**
- Heading Structure (h1 usage)

## WCAG 2.1 AA Compliance

These rules help achieve **WCAG 2.1 AA** compliance by covering:

- **Perceivable**: Alt text, captions, color contrast
- **Operable**: Keyboard navigation, focus management
- **Understandable**: Form labels, error messages
- **Robust**: ARIA validation, semantic markup

## Usage

```bash
# Run accessibility audit
uxray component.tsx

# Generate detailed report
uxray component.tsx --report json --out accessibility-report.json
```

## Best Practices

1. **Start with critical rules** - Fix Error level issues first
2. **Test with screen readers** - Rules complement but don't replace manual testing
3. **Use semantic HTML** - Prefer native elements over custom ARIA
4. **Keyboard test** - Ensure all functionality works without a mouse
5. **Regular audits** - Run UXRay as part of your development workflow

## Contributing

To add new accessibility rules:

1. Create rule file in `src/core/rules/jsx/`
2. Follow the existing rule pattern
3. Add comprehensive tests
4. Update this documentation
5. Include WCAG reference and severity justification 