
export enum ProblemType {
  EQUATION = 'EQUATION',
  INEQUALITY = 'INEQUALITY',
  LINE_EQUATION = 'LINE_EQUATION',
  SYSTEM = 'SYSTEM',
  INEQUALITY_SYSTEM = 'INEQUALITY_SYSTEM',
  LINE_EXPLORER = 'LINE_EXPLORER',
  PARALLEL_LINES = 'PARALLEL_LINES',
  PERPENDICULAR_LINES = 'PERPENDICULAR_LINES',
  PERP_POINT_SLOPE = 'PERP_POINT_SLOPE',
  LINE_TWO_POINTS = 'LINE_TWO_POINTS',
  FRACTIONAL_INEQUALITY = 'FRACTIONAL_INEQUALITY',
  FRACTIONAL_INEQUALITY_CLASSIC = 'FRACTIONAL_INEQUALITY_CLASSIC',
  FRACTIONAL_EQUATION = 'FRACTIONAL_EQUATION',
  QUADRATIC_EQUATION = 'QUADRATIC_EQUATION'
}

export enum SolvingMode {
  CLASSIC = 'CLASSIC',
  INTERACTIVE = 'INTERACTIVE'
}

export enum Difficulty {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3
}

export interface Step {
  id: number;
  latex: string;
  description: string;
  expectedInput: string;
  hint: string;
}

export interface MathProblem {
  id: string;
  type: ProblemType;
  difficulty: Difficulty;
  title: string;
  operator: string;
  steps: Step[];
  finalResult: string;
  metadata?: any;
}

export interface Monomial {
  id: string;
  coeff: number;
  den: number;
  hasX: boolean;
}

export interface InequalitySolution {
  val: number;
  op: string; // '<', '<=', '>', '>='
}

