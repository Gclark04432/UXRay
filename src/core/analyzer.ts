import fs from 'fs';
import path from 'path';
import * as babelParser from '@babel/parser';
import traverse from '@babel/traverse';

export function analyzeFile(filePath: string) {
  const code = fs.readFileSync(path.resolve(filePath), 'utf-8');

  const ast = babelParser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  let inputCount = 0;
  let labeledInputCount = 0;

  traverse(ast, {
    JSXElement(path) {
      const openingElement = path.node.openingElement;
      const tagName = openingElement.name;

      if (tagName.type === 'JSXIdentifier' && tagName.name === 'input') {
        inputCount++;

        const hasId = openingElement.attributes.some(attr => {
          return attr.type === 'JSXAttribute' && attr.name.name === 'id';
        });

        if (hasId) {
          labeledInputCount++;
        }
      }
    },
  });

  const unlabeledInputs = inputCount - labeledInputCount;

  return {
    totalInputs: inputCount,
    unlabeledInputs,
  };
}
