import { runRules } from '../../src/core/rule-engine';
import { Rule, Violation, RuleType, RuleSeverity } from '../../src/core/rules/base';

// Mock rule for testing
const mockRule: Rule = {
  name: 'mock-rule',
  description: 'A mock rule for testing',
  type: RuleType.SEMANTIC,
  severity: RuleSeverity.WARN,
  check: jest.fn().mockReturnValue(null)
};

// Mock rule that returns violations
const mockViolationRule: Rule = {
  name: 'mock-violation-rule',
  description: 'A mock rule that returns violations',
  type: RuleType.A11Y,
  severity: RuleSeverity.ERROR,
  check: jest.fn().mockReturnValue({
    name: 'mock-violation-rule',
    type: RuleType.A11Y,
    severity: RuleSeverity.ERROR,
    message: 'Mock violation message'
  })
};

// Mock context
const mockContext = {
  astPath: {
    node: {
      type: 'JSXElement',
      openingElement: {
        name: { name: 'div' }
      }
    }
  } as any,
  sourceCode: '<div>Test</div>'
};

describe('UXRay Rule Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rule Execution', () => {
    it('should execute a single rule', () => {
      const rules = [mockRule];
      const result = runRules(rules, mockContext);

      expect(mockRule.check).toHaveBeenCalledWith(mockContext);
      expect(result).toEqual([]);
    });

    it('should execute multiple rules', () => {
      const rules = [mockRule, mockViolationRule];
      const result = runRules(rules, mockContext);

      expect(mockRule.check).toHaveBeenCalledWith(mockContext);
      expect(mockViolationRule.check).toHaveBeenCalledWith(mockContext);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('mock-violation-rule');
    });

    it('should handle empty rules array', () => {
      const result = runRules([], mockContext);
      expect(result).toEqual([]);
    });

    it('should handle rules that return undefined', () => {
      const undefinedRule: Rule = {
        name: 'undefined-rule',
        description: 'A rule that returns undefined',
        type: RuleType.SEMANTIC,
        severity: RuleSeverity.INFO,
        check: jest.fn().mockReturnValue(undefined)
      };

      const result = runRules([undefinedRule], mockContext);
      expect(result).toEqual([]);
      expect(undefinedRule.check).toHaveBeenCalledWith(mockContext);
    });
  });

  describe('Violation Aggregation', () => {
    it('should aggregate violations from multiple rules', () => {
      const multipleViolationRule: Rule = {
        name: 'multiple-violations',
        description: 'A rule with multiple violations',
        type: RuleType.A11Y,
        severity: RuleSeverity.WARN,
        check: jest.fn().mockReturnValue({
          name: 'multiple-violations',
          type: RuleType.A11Y,
          severity: RuleSeverity.WARN,
          message: 'First violation'
        })
      };

      const rules = [mockRule, multipleViolationRule];
      const result = runRules(rules, mockContext);

      expect(result).toHaveLength(1);
      expect(result[0].message).toBe('First violation');
    });

    it('should preserve violation properties', () => {
      const rules = [mockViolationRule];
      const result = runRules(rules, mockContext);

      expect(result).toHaveLength(1);
      const violation = result[0];
      expect(violation.name).toBe('mock-violation-rule');
      expect(violation.message).toBe('Mock violation message');
      expect(violation.severity).toBe(RuleSeverity.ERROR);
      expect(violation.type).toBe(RuleType.A11Y);
    });
  });

  describe('Error Handling', () => {
    it('should handle rules that throw errors', () => {
      const errorRule: Rule = {
        name: 'error-rule',
        description: 'A rule that throws an error',
        type: RuleType.A11Y,
        severity: RuleSeverity.ERROR,
        check: jest.fn().mockImplementation(() => {
          throw new Error('Rule execution failed');
        })
      };

      const rules = [errorRule, mockRule];
      
      // The rule engine doesn't handle errors gracefully yet
      // This test documents the current behavior
      expect(() => runRules(rules, mockContext)).toThrow('Rule execution failed');
    });

    it('should handle rules that return invalid data', () => {
      const invalidRule: Rule = {
        name: 'invalid-rule',
        description: 'A rule that returns invalid data',
        type: RuleType.SEMANTIC,
        severity: RuleSeverity.WARN,
        check: jest.fn().mockReturnValue('not an array')
      };

      const rules = [invalidRule, mockRule];
      const result = runRules(rules, mockContext);

      // The rule engine doesn't validate return types yet
      // This test documents the current behavior
      expect(result).toContain('not an array');
      expect(mockRule.check).toHaveBeenCalledWith(mockContext);
    });
  });

  describe('Context Passing', () => {
    it('should pass correct context to rules', () => {
      const contextCheckingRule: Rule = {
        name: 'context-checker',
        description: 'A rule that checks context',
        type: RuleType.SEMANTIC,
        severity: RuleSeverity.INFO,
        check: jest.fn().mockImplementation((context) => {
          expect(context).toBe(mockContext);
          expect(context.astPath.node.type).toBe('JSXElement');
          expect(context.sourceCode).toBe('<div>Test</div>');
          return null;
        })
      };

      const rules = [contextCheckingRule];
      runRules(rules, mockContext);

      expect(contextCheckingRule.check).toHaveBeenCalledWith(mockContext);
    });

    it('should handle different context types', () => {
      const differentContext = {
        astPath: {
          node: {
            type: 'JSXFragment',
            openingFragment: {}
          }
        } as any,
        sourceCode: '<>Fragment</>'
      };

      const rules = [mockRule];
      const result = runRules(rules, differentContext);

      expect(mockRule.check).toHaveBeenCalledWith(differentContext);
      expect(result).toEqual([]);
    });
  });

  describe('Performance', () => {
    it('should execute rules efficiently', () => {
      const rules = Array(100).fill(null).map((_, index) => ({
        name: `rule-${index}`,
        description: `Rule ${index}`,
        type: RuleType.SEMANTIC,
        severity: RuleSeverity.INFO,
        check: jest.fn().mockReturnValue(null)
      }));

      const startTime = Date.now();
      const result = runRules(rules, mockContext);
      const endTime = Date.now();

      expect(result).toEqual([]);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
      
      // All rules should have been called
      rules.forEach(rule => {
        expect(rule.check).toHaveBeenCalledWith(mockContext);
      });
    });
  });
}); 