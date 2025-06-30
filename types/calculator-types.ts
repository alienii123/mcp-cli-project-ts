export interface CalculationResult {
  expression: string;
  processedExpression: string;
  result: number;
  timestamp: string;
}

export type MathOperator = 
  | 'add' 
  | 'subtract' 
  | 'multiply' 
  | 'divide' 
  | 'power' 
  | 'sqrt';

export interface MathOperation {
  operator: MathOperator;
  operands: number[];
}