import { Problem, ProblemStep, Difficulty } from './types';
import { getRandomInt, shuffleArray, getUniqueId } from './math-utils';

/**
 * 2x2 Matrix Determinant: det | a b ; c d | = ad - bc
 */
export function generateMatrixDeterminant(difficulty: Difficulty = 'medium'): Problem {
  const a = getRandomInt(-5, 5);
  const b = getRandomInt(-4, 4);
  const c = getRandomInt(-4, 4);
  const d = getRandomInt(-5, 5);

  const det = a * d - b * c;

  const questionLatex = `\\det \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;
  const answerStr = `${det}`;
  const answerDisplayLatex = `\\det(A) = ${det}`;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '2×2 행렬식(Determinant) 공식 확인',
      explanation: '2x2 행렬의 행렬식은 주대각선 성분의 곱에서 반대 대각선 성분의 곱을 뺍니다: det(A) = ad - bc',
      mathLatex: `\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc`
    },
    {
      stepNumber: 2,
      title: '각 성분 대입',
      explanation: `a = ${a}, b = ${b}, c = ${c}, d = ${d} 를 공식에 대입합니다.`,
      mathLatex: `(${a}) \\times (${d}) - (${b}) \\times (${c})`
    },
    {
      stepNumber: 3,
      title: '최종 행렬식 값 계산',
      explanation: '곱셈과 뺄셈을 완료합니다.',
      mathLatex: `${a * d} - (${b * c}) = ${det}`
    }
  ];

  const distractorsSet = new Set<string>();
  distractorsSet.add((a * d + b * c).toString()); // added instead of subtracted
  distractorsSet.add((b * c - a * d).toString()); // reversed sign
  distractorsSet.add((det + 2).toString());
  distractorsSet.delete(answerStr);

  while (distractorsSet.size < 3) {
    distractorsSet.add((det + getRandomInt(-5, 5)).toString());
    distractorsSet.delete(answerStr);
  }

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([answerStr, ...distractors]);

  return {
    id: getUniqueId('mat-det'),
    topicId: 'linear-algebra',
    subtopicId: 'matrix-determinant',
    unit: '선형대수와 벡터',
    title: '2×2 행렬식 (Determinant: ad - bc)',
    difficulty,
    questionText: `다음 2×2 정사각행렬의 행렬식(Determinant)을 계산하세요.`,
    questionLatex,
    correctAnswer: answerStr,
    answerDisplayLatex,
    distractors,
    choices,
    steps,
    hints: [
      '주대각선 성분의 곱: a × d',
      '반대 대각선 성분의 곱: b × c',
      '행렬식 = (a × d) - (b × c)'
    ],
    conceptSummary: '행렬식은 선형변환 시 면적의 확대율과 역행렬의 존재 여부(det ≠ 0)를 판정하는 선형대수학의 기둥입니다.'
  };
}

/**
 * 2D Vector Dot Product: u · v = u1*v1 + u2*v2
 */
export function generateVectorDotProduct(difficulty: Difficulty = 'medium'): Problem {
  const u1 = getRandomInt(-5, 5);
  const u2 = getRandomInt(-5, 5);
  const v1 = getRandomInt(-5, 5);
  const v2 = getRandomInt(-5, 5);

  const dot = u1 * v1 + u2 * v2;

  const questionLatex = `\\vec{u} = (${u1}, \\, ${u2}), \\quad \\vec{v} = (${v1}, \\, ${v2}) \\implies \\vec{u} \\cdot \\vec{v} = ?`;
  const answerStr = `${dot}`;
  const answerDisplayLatex = `\\vec{u} \\cdot \\vec{v} = ${dot}`;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '벡터 내적(Dot Product) 공식 확인',
      explanation: '각 성분별 곱을 구하여 모두 더합니다: u · v = u₁v₁ + u₂v₂',
      mathLatex: `\\vec{u} \\cdot \\vec{v} = u_1 v_1 + u_2 v_2`
    },
    {
      stepNumber: 2,
      title: '성분 대입 및 계산',
      explanation: `(${u1} × ${v1}) + (${u2} × ${v2})`,
      mathLatex: `(${u1} \\times ${v1}) + (${u2} \\times ${v2}) = ${dot}`
    }
  ];

  const distractorsSet = new Set<string>();
  distractorsSet.add((u1 * v1 - u2 * v2).toString());
  distractorsSet.add((dot + 3).toString());
  distractorsSet.add((dot - 3).toString());
  distractorsSet.delete(answerStr);

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([answerStr, ...distractors]);

  return {
    id: getUniqueId('vec-dot'),
    topicId: 'linear-algebra',
    subtopicId: 'vector-dot-product',
    unit: '선형대수와 벡터',
    title: '벡터의 내적 (Dot Product)',
    difficulty,
    questionText: `두 2차원 벡터의 내적(스칼라적) 값을 계산하세요.`,
    questionLatex,
    correctAnswer: answerStr,
    answerDisplayLatex,
    distractors,
    choices,
    steps,
    hints: [
      '같은 방향 성분끼리 곱한 뒤 더하세요: x성분 곱 + y성분 곱',
      '결과는 벡터가 아니라 하나의 스칼라(실수) 값입니다.'
    ],
    conceptSummary: '벡터 내적은 두 벡터 사이의 각도와 닮음(유사도, 코사인 유사도)을 계산하는 인공지능과 물리학의 핵심 도구입니다.'
  };
}

/**
 * Partial Derivative: f(x, y) = a x^2 y + b x y^2, find \partial f / \partial x
 */
export function generatePartialDerivative(difficulty: Difficulty = 'medium'): Problem {
  const a = getRandomInt(2, 5);
  const b = getRandomInt(2, 5);

  const fxLatex = `f(x, y) = ${a}x^2 y + ${b}xy^2`;
  // \partial f / \partial x = 2a x y + b y^2
  const pLatex = `\\frac{\\partial f}{\\partial x} = ${2 * a}xy + ${b}y^2`;
  const answerStr = `${2 * a}xy + ${b}y^2`;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '편미분의 원리 확인',
      explanation: 'x에 대해 편미분할 때는 다른 변수(y)를 마치 "상수(숫자)"처럼 취급하고 미분합니다.',
      mathLatex: `\\frac{\\partial}{\\partial x} [x^2] = 2x, \\quad \\frac{\\partial}{\\partial x} [x] = 1`
    },
    {
      stepNumber: 2,
      title: '항별 편미분 전개',
      explanation: `첫째 항 ${a}x²y 미분 → ${2 * a}xy, 둘째 항 ${b}xy² 미분 → ${b}y²`,
      mathLatex: `\\frac{\\partial}{\\partial x}(${a}x^2 y) + \\frac{\\partial}{\\partial x}(${b}xy^2) = ${2 * a}xy + ${b}y^2`
    }
  ];

  const distractors = [
    `${a}x^2 + ${2 * b}xy`, // \partial f / \partial y
    `${2 * a}x + ${b}y`,
    `${2 * a}xy + ${2 * b}xy`,
  ];

  return {
    id: getUniqueId('partial-deriv'),
    topicId: 'advanced-calculus',
    subtopicId: 'partial-derivatives',
    unit: '다변수 미적분학',
    title: '다변수 함수의 편미분 (Partial Derivative)',
    difficulty,
    questionText: `이변수 함수 $${fxLatex}$ 의 $x$에 대한 편도함수 $\\frac{\\partial f}{\\partial x}$ 를 구하세요.`,
    questionLatex: `\\frac{\\partial f}{\\partial x} = ?`,
    correctAnswer: answerStr,
    answerDisplayLatex: pLatex,
    distractors,
    choices: shuffleArray([answerStr, ...distractors]),
    steps,
    hints: [
      'x로 편미분할 때는 y를 단순한 상수로 보고 x만 미분합니다.',
      'd/dx [x²] = 2x,  d/dx [x] = 1'
    ],
    conceptSummary: '편미분은 여러 변수 중 하나만 변화할 때의 순간변화율을 구하는 기법으로 머신러닝의 경사하강법(Gradient Descent)의 핵심입니다.'
  };
}
