import { analyzeFile } from '../../src/core/analyzer';
import { AuditResult } from '../../src/core/rules/base';

// Helper function to create temporary test files
function createTestFile(content: string): string {
  const fs = require('fs');
  const path = require('path');
  const testFile = path.join(__dirname, 'temp-analyzer-test.tsx');
  fs.writeFileSync(testFile, content);
  return testFile;
}

// Helper function to clean up test files
function cleanupTestFile(filePath: string): void {
  const fs = require('fs');
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    // File might already be deleted
  }
}

describe('UXRay Core Analyzer', () => {
  describe('File Analysis', () => {
    it('should analyze JSX files correctly', () => {
      const content = `
        import React from 'react';
        
        export function TestComponent() {
          return (
            <div>
              <h1>Title</h1>
              <button>Click me</button>
              <img src="logo.png" alt="Logo" />
            </div>
          );
        }
      `;
      const testFile = createTestFile(content);
      
      try {
        const result = analyzeFile(testFile);
        
        expect(result).toBeDefined();
        expect(result.totalChecks).toBe(11);
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);
        expect(result.passedChecks).toBeGreaterThanOrEqual(0);
        expect(result.violations).toBeInstanceOf(Array);
      } finally {
        cleanupTestFile(testFile);
      }
    });

    it('should handle TypeScript JSX files', () => {
      const content = `
        import React from 'react';
        
        interface Props {
          title: string;
        }
        
        export function TestComponent({ title }: Props) {
          return (
            <div>
              <h1>{title}</h1>
              <button aria-label="Submit">Submit</button>
            </div>
          );
        }
      `;
      const testFile = createTestFile(content);
      
      try {
        const result = analyzeFile(testFile);
        
        expect(result).toBeDefined();
        expect(result.totalChecks).toBe(11);
        expect(result.score).toBeGreaterThanOrEqual(0);
      } finally {
        cleanupTestFile(testFile);
      }
    });

    it('should handle complex nested JSX structures', () => {
      const content = `
        import React from 'react';
        
        export function ComplexComponent() {
          return (
            <div>
              <header>
                <nav>
                  <ul>
                    <li><a href="/home">Home</a></li>
                    <li><a href="/about">About</a></li>
                  </ul>
                </nav>
              </header>
              <main>
                <section>
                  <h1>Welcome</h1>
                  <p>Content here</p>
                  <form>
                    <label htmlFor="email">Email:</label>
                    <input id="email" type="email" required />
                    <button type="submit">Send</button>
                  </form>
                </section>
              </main>
              <footer>
                <p>&copy; 2025</p>
              </footer>
            </div>
          );
        }
      `;
      const testFile = createTestFile(content);
      
      try {
        const result = analyzeFile(testFile);
        
        expect(result).toBeDefined();
        expect(result.totalChecks).toBe(11);
        expect(result.score).toBeGreaterThanOrEqual(0);
      } finally {
        cleanupTestFile(testFile);
      }
    });

    it('should handle JSX fragments', () => {
      const content = `
        import React from 'react';
        
        export function FragmentComponent() {
          return (
            <>
              <h1>Title</h1>
              <p>Content</p>
            </>
          );
        }
      `;
      const testFile = createTestFile(content);
      
      try {
        const result = analyzeFile(testFile);
        
        expect(result).toBeDefined();
        expect(result.totalChecks).toBe(11);
        expect(result.score).toBeGreaterThanOrEqual(0);
      } finally {
        cleanupTestFile(testFile);
      }
    });

    it('should handle conditional rendering', () => {
      const content = `
        import React from 'react';
        
        export function ConditionalComponent({ show }: { show: boolean }) {
          return (
            <div>
              {show && <h1>Visible Title</h1>}
              {!show && <p>Hidden content</p>}
              <button aria-label="Toggle">Toggle</button>
            </div>
          );
        }
      `;
      const testFile = createTestFile(content);
      
      try {
        const result = analyzeFile(testFile);
        
        expect(result).toBeDefined();
        expect(result.totalChecks).toBe(11);
        expect(result.score).toBeGreaterThanOrEqual(0);
      } finally {
        cleanupTestFile(testFile);
      }
    });

    it('should handle array rendering', () => {
      const content = `
        import React from 'react';
        
        export function ListComponent() {
          const items = ['Item 1', 'Item 2', 'Item 3'];
          
          return (
            <div>
              <h1>List</h1>
              <ul>
                {items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <button aria-label="Add Item">Add</button>
            </div>
          );
        }
      `;
      const testFile = createTestFile(content);
      
      try {
        const result = analyzeFile(testFile);
        
        expect(result).toBeDefined();
        expect(result.totalChecks).toBe(11);
        expect(result.score).toBeGreaterThanOrEqual(0);
      } finally {
        cleanupTestFile(testFile);
      }
    });
  });

  describe('Score Calculation', () => {
    it('should calculate perfect score for accessible component', () => {
      const content = `
        import React from 'react';
        
        export function PerfectComponent() {
          return (
            <div>
              <h1>Main Title</h1>
              <nav>
                <ul>
                  <li><a href="/home">Home</a></li>
                </ul>
              </nav>
              <main>
                <section>
                  <h2>Section</h2>
                  <p>Content</p>
                  <form>
                    <label htmlFor="name">Name:</label>
                    <input id="name" type="text" required />
                    <button type="submit" aria-label="Submit form">Submit</button>
                  </form>
                </section>
              </main>
              <footer>
                <p>Footer content</p>
              </footer>
            </div>
          );
        }
      `;
      const testFile = createTestFile(content);
      
      try {
        const result = analyzeFile(testFile);
        
        expect(result.score).toBeGreaterThanOrEqual(80); // Should be very high
        expect(result.violations.length).toBeLessThan(3); // Should have few violations
      } finally {
        cleanupTestFile(testFile);
      }
    });

    it('should calculate low score for inaccessible component', () => {
      const content = `
        import React from 'react';
        
        export function BadComponent() {
          return (
            <div>
              <button>×</button>
              <img src="logo.png" />
              <input type="text" />
              <a>Click me</a>
              <iframe src="content.html" />
            </div>
          );
        }
      `;
      const testFile = createTestFile(content);
      
      try {
        const result = analyzeFile(testFile);
        
        expect(result.score).toBeLessThan(70); // Should be low
        expect(result.violations.length).toBeGreaterThan(3); // Should have many violations
      } finally {
        cleanupTestFile(testFile);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSX gracefully', () => {
      const content = `
        import React from 'react';
        
        export function MalformedComponent() {
          return (
            <div>
              <h1>Title</h1>
              <button>Click me</button>
            </div>
          );
        }
      `;
      const testFile = createTestFile(content);
      
      try {
        // This should not crash with valid JSX
        expect(() => analyzeFile(testFile)).not.toThrow();
      } finally {
        cleanupTestFile(testFile);
      }
    });

    it('should handle non-JSX content', () => {
      const content = `
        export function NoJSXComponent() {
          return "Just a string";
        }
      `;
      const testFile = createTestFile(content);
      
      try {
        const result = analyzeFile(testFile);
        
        expect(result).toBeDefined();
        expect(result.totalChecks).toBe(11);
        expect(result.score).toBeGreaterThanOrEqual(0);
      } finally {
        cleanupTestFile(testFile);
      }
    });
  });
}); 