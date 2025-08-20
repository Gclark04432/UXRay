import fs from 'fs';
import path from 'path';

/**
 * Creates a temporary test file with the given content
 * @param content - The content to write to the file
 * @param filename - Optional filename (defaults to 'temp-test.tsx')
 * @returns The path to the created file
 */
export function createTestFile(content: string, filename: string = 'temp-test.tsx'): string {
  const testFile = path.join(__dirname, '..', filename);
  fs.writeFileSync(testFile, content);
  return testFile;
}

/**
 * Cleans up a test file
 * @param filePath - The path to the file to delete
 */
export function cleanupTestFile(filePath: string): void {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    // File might already be deleted
  }
}

/**
 * Creates a test component with accessibility violations
 * @param violations - Array of violation types to include
 * @returns JSX content string
 */
export function createViolationComponent(violations: string[]): string {
  const components: Record<string, string> = {
    'button-label': '<button>×</button>',
    'missing-alt': '<img src="logo.png" />',
    'missing-label': '<input type="text" />',
    'anchor-without-href': '<a>Click me</a>',
    'iframe-without-title': '<iframe src="content.html" />',
    'heading-structure': '<h1>Title</h1><h3>Missing h2</h3>',
    'landmark-elements': '<div role="banner">Header</div>',
    'form-validation': '<input type="email" />',
    'aria-validation': '<button aria-label="">×</button>',
    'table-accessibility': '<table><tr><td>Data</td></tr></table>',
    'keyboard-accessibility': '<div tabIndex={-1}>Not focusable</div>'
  };

  const content = violations.map(v => components[v] || '').join('\n');
  
  return `
    import React from 'react';
    
    export function ViolationComponent() {
      return (
        <div>
          ${content}
        </div>
      );
    }
  `;
}

/**
 * Creates a test component with good accessibility practices
 * @returns JSX content string
 */
export function createAccessibleComponent(): string {
  return `
    import React from 'react';
    
    export function AccessibleComponent() {
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
              <h2>Getting Started</h2>
              <p>This is accessible content.</p>
              <form>
                <label htmlFor="email">Email:</label>
                <input 
                  id="email" 
                  type="email" 
                  required 
                  aria-describedby="email-help"
                />
                <div id="email-help">Enter your email address</div>
                <button type="submit" aria-label="Submit form">Submit</button>
              </form>
            </section>
          </main>
          <footer>
            <p>&copy; 2025 Accessible App</p>
          </footer>
        </div>
      );
    }
  `;
}

/**
 * Waits for a specified number of milliseconds
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mocks console methods to suppress output during tests
 */
export function mockConsole(): { restore: () => void } {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();

  return {
    restore: () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    }
  };
} 