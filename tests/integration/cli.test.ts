import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

// Helper function to create temporary test files
function createTestFile(content: string, filename: string): string {
  const testFile = path.join(__dirname, filename);
  fs.writeFileSync(testFile, content);
  return testFile;
}

// Helper function to clean up test files
function cleanupTestFile(filePath: string): void {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    // File might already be deleted
  }
}

describe('UXRay CLI Integration', () => {
  const testDir = __dirname;

  afterEach(() => {
    // Clean up any test files created during tests
    const files = fs.readdirSync(testDir);
    files.forEach(file => {
      if (file.startsWith('temp-') && file.endsWith('.tsx')) {
        cleanupTestFile(path.join(testDir, file));
      }
    });
  });

  describe('Basic CLI Functionality', () => {
    it('should show help when no arguments provided', () => {
      try {
        const output = execSync('node dist/cli/index.js', { 
          cwd: process.cwd(),
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        expect(output).toContain('Usage: uxray');
      } catch (error: any) {
        // Expected to fail with usage message
        expect(error.stdout || error.message).toContain('Usage: uxray');
      }
    });

    it('should show help when no arguments provided', () => {
      try {
        const output = execSync('node dist/cli/index.js', { 
          cwd: process.cwd(),
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        expect(output).toContain('Usage: uxray');
      } catch (error: any) {
        // Expected to fail with usage message
        expect(error.stdout || error.message || error.stderr).toContain('Usage: uxray');
      }
    });
  });

  describe('File Analysis', () => {
    it('should analyze a simple accessible component', () => {
      const content = `
        import React from 'react';
        
        export function AccessibleButton() {
          return <button aria-label="Close dialog">×</button>;
        }
      `;
      
      const testFile = createTestFile(content, 'temp-accessible.tsx');
      
      try {
        const output = execSync(`node dist/cli/index.js "${testFile}"`, { 
          cwd: process.cwd(),
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        expect(output).toContain('UXRay Audit Report');
        expect(output).toContain('Score');
        expect(output).toContain('Passed Checks');
      } finally {
        cleanupTestFile(testFile);
      }
    });

    it('should detect accessibility violations', () => {
      const content = `
        import React from 'react';
        
        export function InaccessibleComponent() {
          return (
            <div>
              <button>×</button>
              <img src="logo.png" />
              <input type="text" />
            </div>
          );
        }
      `;
      
      const testFile = createTestFile(content, 'temp-inaccessible.tsx');
      
      try {
        const output = execSync(`node dist/cli/index.js "${testFile}"`, { 
          cwd: process.cwd(),
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        expect(output).toContain('UXRay Audit Report');
        expect(output).toContain('violations');
        expect(output).toContain('Score');
      } finally {
        cleanupTestFile(testFile);
      }
    });
  });

  describe('Report Generation', () => {
    it('should generate JSON report', () => {
      const content = `
        import React from 'react';
        
        export function TestComponent() {
          return <button>Click me</button>;
        }
      `;
      
      const testFile = createTestFile(content, 'temp-json-test.tsx');
      const reportFile = path.join(testDir, 'temp-report.json');
      
      try {
        const output = execSync(`node dist/cli/index.js "${testFile}" --report json --out "${reportFile}"`, { 
          cwd: process.cwd(),
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        expect(output).toContain('UXRay Audit Report');
        
        // Check if report file was created
        expect(fs.existsSync(reportFile)).toBe(true);
        
        // Check if report contains valid JSON
        const reportContent = fs.readFileSync(reportFile, 'utf8');
        const report = JSON.parse(reportContent);
        
        expect(report).toHaveProperty('score');
        expect(report).toHaveProperty('violations');
        expect(report).toHaveProperty('totalChecks');
        expect(report).toHaveProperty('passedChecks');
      } finally {
        cleanupTestFile(testFile);
        cleanupTestFile(reportFile);
      }
    });

    it('should generate Markdown report', () => {
      const content = `
        import React from 'react';
        
        export function TestComponent() {
          return <button aria-label="Submit">Submit</button>;
        }
      `;
      
      const testFile = createTestFile(content, 'temp-md-test.tsx');
      const reportFile = path.join(testDir, 'temp-report.md');
      
      try {
        const output = execSync(`node dist/cli/index.js "${testFile}" --report md --out "${reportFile}"`, { 
          cwd: process.cwd(),
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        expect(output).toContain('UXRay Audit Report');
        
        // Check if report file was created
        expect(fs.existsSync(reportFile)).toBe(true);
        
        // Check if report contains markdown content
        const reportContent = fs.readFileSync(reportFile, 'utf8');
        expect(reportContent).toContain('# UXRay Audit Report');
        expect(reportContent).toContain('**Score**:');
      } finally {
        cleanupTestFile(testFile);
        cleanupTestFile(reportFile);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent files gracefully', () => {
      try {
        execSync('node dist/cli/index.js nonexistent.tsx', { 
          cwd: process.cwd(),
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        // Should not reach here
        fail('Expected command to fail');
      } catch (error: any) {
        // Should fail with appropriate error message
        expect(error.message || error.stderr || error.stdout).toContain('Error');
      }
    });

    it('should handle invalid file types', () => {
      const testFile = createTestFile('console.log("Hello");', 'temp-invalid.txt');
      
      try {
        const output = execSync(`node dist/cli/index.js "${testFile}"`, { 
          cwd: process.cwd(),
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        // Should still process the file (though it might not have JSX)
        expect(output).toContain('UXRay Audit Report');
      } finally {
        cleanupTestFile(testFile);
      }
    });
  });

  describe('Performance', () => {
    it('should handle large components efficiently', () => {
      // Create a component with many elements
      const elements = Array(100).fill(0).map((_, i) => 
        `<div key="${i}"><span>Element ${i}</span></div>`
      ).join('\n');
      
      const content = `
        import React from 'react';
        
        export function LargeComponent() {
          return (
            <div>
              ${elements}
            </div>
          );
        }
      `;
      
      const testFile = createTestFile(content, 'temp-large.tsx');
      
      try {
        const startTime = Date.now();
        const output = execSync(`node dist/cli/index.js "${testFile}"`, { 
          cwd: process.cwd(),
          encoding: 'utf8',
          stdio: 'pipe'
        });
        const endTime = Date.now();
        
        expect(output).toContain('UXRay Audit Report');
        expect(endTime - startTime).toBeLessThan(5000); // Should complete in under 5 seconds
      } finally {
        cleanupTestFile(testFile);
      }
    });
  });
}); 