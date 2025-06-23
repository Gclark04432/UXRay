#!/usr/bin/env node

import { analyzeFile } from '../core/analyzer';
import chalk from 'chalk';

const args = process.argv.slice(2);

if (!args.length) {
  console.log(chalk.gray('Usage: uxray <path-to-component>'));
  process.exit(1);
}

const filePath = args[0];
const result = analyzeFile(filePath);

console.log(`\n🔍 ${chalk.cyanBright('UXRay Audit Report')} for ${chalk.yellow(filePath)}`);

console.log(`\n📊 ${chalk.bold('Score')}: ${chalk.green(`${result.score}%`)}`);
console.log(`✅ Passed Checks: ${result.passedChecks} / ${result.totalChecks}\n`);

if (result.violations.length === 0) {
  console.log(chalk.green('🎉 No violations found! Your component looks great.'));
} else {
  console.log(chalk.red(`⚠️ Found ${result.violations.length} violation${result.violations.length > 1 ? 's' : ''}:\n`));

  result.violations.forEach((v, index) => {
    const symbol = v.severity === 'error' ? '❌' : v.severity === 'warn' ? '⚠️' : 'ℹ️';
    const color = v.severity === 'error'
      ? chalk.red
      : v.severity === 'warn'
      ? chalk.yellow
      : chalk.gray;

    console.log(`${chalk.gray(`${index + 1}.`)} ${symbol} ${color.bold(v.message)} ${chalk.gray(`[${v.type}]`)}`);
  });

  console.log('\n💡 Tip: Fixing higher severity issues (❌) will most improve accessibility.');
}
