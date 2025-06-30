import type { CalculationResult, MathOperation } from '../types/calculator-types.js';

export class CalculatorTool {
  private readonly allowedOperators = /^[0-9+\-*/().\s]+$/;
  private readonly mathFunctions: Record<string, (x: number) => number> = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    sqrt: Math.sqrt,
    log: Math.log,
    exp: Math.exp,
    abs: Math.abs,
    round: Math.round,
    floor: Math.floor,
    ceil: Math.ceil,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan
  };

  async calculate(expression: string): Promise<number> {
    try {
      if (!expression.trim()) {
        throw new Error('Expression cannot be empty');
      }

      // Basic safe evaluation - sanitize input
      const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
      
      if (sanitized !== expression) {
        throw new Error('Invalid characters in expression');
      }
      
      // Use Function constructor for safer evaluation than eval
      const result = new Function(`"use strict"; return (${sanitized})`)() as number;
      
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Invalid calculation result');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Calculation error: ${errorMessage}`);
    }
  }

  async calculateAdvanced(expression: string): Promise<CalculationResult> {
    try {
      if (!expression.trim()) {
        throw new Error('Expression cannot be empty');
      }

      // Replace function names with Math equivalents
      let processedExpression = expression;
      
      Object.keys(this.mathFunctions).forEach(func => {
        const regex = new RegExp(`\\b${func}\\b`, 'g');
        processedExpression = processedExpression.replace(regex, `Math.${func}`);
      });

      // Add pi and e constants
      processedExpression = processedExpression.replace(/\bpi\b/g, 'Math.PI');
      processedExpression = processedExpression.replace(/\be\b/g, 'Math.E');

      const result = new Function(`"use strict"; return (${processedExpression})`)() as number;
      
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Invalid calculation result');
      }
      
      return {
        expression,
        processedExpression,
        result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Advanced calculation error: ${errorMessage}`);
    }
  }

  async performOperation(operation: MathOperation): Promise<number> {
    const { operator, operands } = operation;

    if (operands.length === 0) {
      throw new Error('No operands provided');
    }

    try {
      switch (operator) {
        case 'add':
          return operands.reduce((sum, num) => sum + num, 0);
        case 'subtract':
          if (operands.length === 1) return -operands[0];
          return operands.reduce((diff, num, index) => index === 0 ? num : diff - num);
        case 'multiply':
          return operands.reduce((product, num) => product * num, 1);
        case 'divide':
          if (operands.length !== 2) {
            throw new Error('Division requires exactly 2 operands');
          }
          if (operands[1] === 0) {
            throw new Error('Division by zero');
          }
          return operands[0] / operands[1];
        case 'power':
          if (operands.length !== 2) {
            throw new Error('Power operation requires exactly 2 operands');
          }
          return Math.pow(operands[0], operands[1]);
        case 'sqrt':
          if (operands.length !== 1) {
            throw new Error('Square root requires exactly 1 operand');
          }
          if (operands[0] < 0) {
            throw new Error('Cannot take square root of negative number');
          }
          return Math.sqrt(operands[0]);
        default:
          throw new Error(`Unknown operator: ${operator}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Operation error: ${errorMessage}`);
    }
  }

  getSupportedFunctions(): string[] {
    return Object.keys(this.mathFunctions);
  }
}