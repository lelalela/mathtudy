/**
 * Mathematical utilities for problem generation
 */

let idCounter = 0;
export function getUniqueId(prefix: string): string {
  idCounter++;
  return `${prefix}-${idCounter}-${getRandomInt(1000, 9999)}`;
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomNonZeroInt(min: number, max: number): number {
  let val = 0;
  while (val === 0) {
    val = getRandomInt(min, max);
  }
  return val;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export interface SimplifiedFraction {
  numerator: number;
  denominator: number;
  isNegative: boolean;
  latex: string;
  stringValue: string;
}

export function simplifyFraction(num: number, den: number): SimplifiedFraction {
  if (den === 0) throw new Error("Denominator cannot be zero");
  const isNegative = (num < 0) !== (den < 0);
  const absNum = Math.abs(num);
  const absDen = Math.abs(den);
  const divisor = gcd(absNum, absDen);
  const sNum = (isNegative ? -1 : 1) * (absNum / divisor);
  const sDen = absDen / divisor;

  let latex = '';
  let stringValue = '';
  if (sDen === 1) {
    latex = `${sNum}`;
    stringValue = `${sNum}`;
  } else {
    latex = sNum < 0 ? `-\\frac{${Math.abs(sNum)}}{${sDen}}` : `\\frac{${sNum}}{${sDen}}`;
    stringValue = `${sNum}/${sDen}`;
  }

  return {
    numerator: sNum,
    denominator: sDen,
    isNegative,
    latex,
    stringValue,
  };
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Format polynomial term ax^n nicely in LaTeX
 */
export function formatTerm(coeff: number, variable: string = 'x', power: number = 1, isLeading: boolean = false): string {
  if (coeff === 0) return '';
  const sign = coeff > 0 ? (isLeading ? '' : '+') : '-';
  const absCoeff = Math.abs(coeff);
  const coeffStr = absCoeff === 1 && power > 0 ? '' : absCoeff.toString();
  const varStr = power === 0 ? '' : power === 1 ? variable : `${variable}^{${power}}`;
  return `${sign}${coeffStr}${varStr}`;
}
