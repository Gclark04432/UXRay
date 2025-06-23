#!/usr/bin/env node

import { analyzeFile } from "../core/analyzer";

console.log('Welcome to UXRay CLI!');

const args  = process.argv.slice(2)

if (!args.length) {
    console.log('Usage: uxray <path-to-component>')
    process.exit(1)
}

const result = analyzeFile(args[0])

console.log(`\n🔍 UX Audit Report for ${args[0]}`);
console.log(`Total input fields: ${result.totalInputs}`);
console.log(`Unlabeled input fields: ${result.unlabeledInputs}\n`);

if (result.unlabeledInputs > 0) {
  console.log('⚠️ Some inputs may not be accessible. Consider adding <label> elements or aria-labels.');
} else {
  console.log('✅ All inputs appear to have labels!');
}

