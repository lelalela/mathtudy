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
      explanation: '2x2 정사각행렬의 행렬식은 [주대각선 성분의 곱 (a × d)]에서 [반대 대각선 성분의 곱 (b × c)]을 뺍니다: ad - bc.',
      why: '기하학적으로 2×2 행렬식은 두 열벡터가 그리는 평행사변형의 "면적(스케일 변화율)"을 의미합니다. 대각선 곱의 차로 순수 넓이를 산출합니다.',
      mathLatex: `\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc`,
      pitfall: '가운데 부호가 마이너스(-)입니다. 무의식적으로 ad + bc 로 더해버리는 실수를 주의하세요!'
    },
    {
      stepNumber: 2,
      title: '성분 대입 및 괄호 처리',
      explanation: `a = ${a}, b = ${b}, c = ${c}, d = ${d} 를 공식에 대입합니다: (${a} \\times ${d}) - (${b} \\times ${c}).`,
      why: '음수 성분이 있을 때 부호 충돌을 방지하기 위해 각 성분에 괄호를 씌워 정돈합니다.',
      mathLatex: `(${a}) \\times (${d}) - (${b}) \\times (${c})`,
      pitfall: 'b와 c 중 음수가 포함되어 있으면 - (음수) = + 가 되므로 부호 반전에 각별히 유의하세요.'
    },
    {
      stepNumber: 3,
      title: '최종 행렬식 값 계산',
      explanation: `주대각선 곱 ${a * d} 에서 반대 대각선 곱 ${b * c}를 뺍니다: ${a * d} - (${b * c}) = ${det}.`,
      why: '행렬식이 0이 아니면 역행렬이 존재하고, 0이면 평면이 선으로 찌그러져 역행렬이 존재하지 않음을 뜻합니다.',
      mathLatex: `${a * d} - (${b * c}) = ${det}`,
      pitfall: '뺄셈 연산 시 부호 계산에 집중하세요.'
    }
  ];

  const distractorsSet = new Set<string>();
  distractorsSet.add((a * d + b * c).toString());
  distractorsSet.add((b * c - a * d).toString());
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
    unit: '10. 선형대수와 벡터',
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
      title: '벡터 내적(Dot Product) 공식 확인하기',
      explanation: '두 벡터의 내적은 같은 축끼리(x는 x끼리, y는 y끼리) 곱한 후 모두 더합니다: u₁v₁ + u₂v₂.',
      why: '벡터 내적은 "두 화살표가 얼마나 같은 방향을 바라보고 있는가(유사도)"를 하나의 스칼라 숫자로 압축하여 측정하는 방법입니다.',
      mathLatex: `\\vec{u} \\cdot \\vec{v} = u_1 v_1 + u_2 v_2`,
      pitfall: '내적의 결과는 새로운 벡터(좌표)가 아니라 단 하나의 "숫자(스칼라)"입니다! 괄호 (x, y)로 적지 마세요.'
    },
    {
      stepNumber: 2,
      title: '성분별 곱셈 및 최종 합산',
      explanation: `x성분의 곱 (${u1} \\times ${v1} = ${u1 * v1})과 y성분의 곱 (${u2} \\times ${v2} = ${u2 * v2})을 더하여 ${dot}을 도출합니다.`,
      why: '각 축 방향으로의 상호 기여도를 합산하여 총 내적 에너지를 구합니다.',
      mathLatex: `(${u1})(${v1}) + (${u2})(${v2}) = ${u1 * v1} + (${u2 * v2}) = ${dot}`,
      pitfall: '음수와 음수의 곱은 양수, 음수와 양수의 곱은 음수가 되는 부호 규칙을 주의하세요.'
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
    unit: '10. 선형대수와 벡터',
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
  const pLatex = `\\frac{\\partial f}{\\partial x} = ${2 * a}xy + ${b}y^2`;
  const answerStr = `${2 * a}xy + ${b}y^2`;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '편미분의 핵심 원리: 기준 변수 외에는 상수 취급하기',
      explanation: 'x에 대해 편미분할 때는 오직 x만 미지수(변수)로 보고, 다른 변수 y는 단순한 고정 숫자(상수, 예: 3이나 7)처럼 취급합니다.',
      why: '변수가 여러 개일 때 한 번에 모두 움직이면 변화율을 측정할 수 없습니다. 따라서 다른 모든 변수를 얼려두고(시간 정지) 오직 x 하나만 살짝 움직였을 때의 변화를 봅니다.',
      mathLatex: `\\frac{\\partial}{\\partial x} [x^2] = 2x, \\quad \\frac{\\partial}{\\partial x} [x] = 1, \\quad y = \\text{상수(고정)}`,
      pitfall: 'x로 미분하는데 y까지 덩달아 미분해버리는 실수를 가장 주의해야 합니다! y는 그냥 숫자처럼 계수에 붙어있을 뿐입니다.'
    },
    {
      stepNumber: 2,
      title: '각 항별 편미분 전개하기',
      explanation: `첫째 항 (${a}x²y)에서 x²만 미분하여 ${2 * a}xy 가 되고, 둘째 항 (${b}xy²)에서 x만 미분하여 1이 되므로 ${b}y² 이 남습니다.`,
      why: '다항식의 미분은 각 항을 개별적으로 미분하여 더해주면 완성됩니다.',
      mathLatex: `\\frac{\\partial}{\\partial x}(${a}x^2 y) + \\frac{\\partial}{\\partial x}(${b}xy^2) = (${a} \\times 2x)y + (${b} \\times 1)y^2 = ${2 * a}xy + ${b}y^2`,
      pitfall: '둘째 항에서 x가 미분되어 1로 사라질 때 뒤의 y²을 통째로 날려버리지 않도록 주의하세요.'
    }
  ];

  const distractors = [
    `${a}x^2 + ${2 * b}xy`,
    `${2 * a}x + ${b}y`,
    `${2 * a}xy + ${2 * b}xy`,
  ];

  return {
    id: getUniqueId('partial-deriv'),
    topicId: 'advanced-calculus',
    subtopicId: 'partial-derivatives',
    unit: '10. 다변수 미적분학',
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
