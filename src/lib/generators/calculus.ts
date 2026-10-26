import { Problem, ProblemStep, Difficulty } from './types';
import { getRandomInt, getRandomNonZeroInt, shuffleArray, getUniqueId } from './math-utils';

/**
 * Derivative evaluation: f(x) = a*x^3 + b*x^2 + c*x + d, evaluate f'(x0)
 */
export function generatePolynomialDerivative(difficulty: Difficulty = 'medium'): Problem {
  const a = getRandomInt(1, 3);
  const b = getRandomInt(-4, 4);
  const c = getRandomNonZeroInt(-5, 5);
  const d = getRandomInt(-6, 6);

  const x0 = getRandomInt(-2, 3);

  // f'(x) = 3a*x^2 + 2b*x + c
  const da = 3 * a;
  const db = 2 * b;
  const dc = c;

  const fPrimeX0 = da * (x0 * x0) + db * x0 + dc;

  const bSign = b >= 0 ? `+ ${b}x^2` : `- ${Math.abs(b)}x^2`;
  const cSign = c >= 0 ? `+ ${c}x` : `- ${Math.abs(c)}x`;
  const dSign = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`;
  const fxLatex = `f(x) = ${a === 1 ? '' : a}x^3 ${b !== 0 ? bSign : ''} ${cSign} ${d !== 0 ? dSign : ''}`;

  const dbSign = db >= 0 ? `+ ${db}x` : `- ${Math.abs(db)}x`;
  const dcSign = dc >= 0 ? `+ ${dc}` : `- ${Math.abs(dc)}`;
  const fPrimeLatex = `f'(x) = ${da}x^2 ${db !== 0 ? dbSign : ''} ${dcSign}`;

  const questionText = `함수 $${fxLatex}$ 에 대하여 미분계수 $f'(${x0})$ 의 값을 구하세요.`;
  const answerStr = `${fPrimeX0}`;
  const answerDisplayLatex = `f'(${x0}) = ${fPrimeX0}`;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '거듭제곱 미분 공식(Power Rule) 적용',
      explanation: 'd/dx [x^n] = n · x^(n-1) 공식을 각 항에 적용하여 도함수 f\'(x)를 구합니다. 상수항은 미분하면 0이 됩니다.',
      mathLatex: fPrimeLatex
    },
    {
      stepNumber: 2,
      title: 'x = x₀ 대입',
      explanation: `구한 도함수 f'(x)에 x = ${x0}를 대입합니다.`,
      mathLatex: `f'(${x0}) = ${da}(${x0})^2 ${db >= 0 ? `+ ${db}` : `- ${Math.abs(db)}`}(${x0}) ${dc >= 0 ? `+ ${dc}` : `- ${Math.abs(dc)}`}`
    },
    {
      stepNumber: 3,
      title: '최종 미분계수 계산',
      explanation: '각 항을 계산하여 순간변화율(미분계수)을 도출합니다.',
      mathLatex: `f'(${x0}) = ${da * x0 * x0} ${db * x0 >= 0 ? `+ ${db * x0}` : `- ${Math.abs(db * x0)}`} ${dc >= 0 ? `+ ${dc}` : `- ${Math.abs(dc)}`} = ${fPrimeX0}`
    }
  ];

  const distractorsSet = new Set<string>();
  distractorsSet.add((fPrimeX0 + 2).toString());
  distractorsSet.add((fPrimeX0 - 2).toString());
  distractorsSet.add((-fPrimeX0).toString());
  distractorsSet.add((da * x0 + db).toString());
  distractorsSet.delete(answerStr);

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([answerStr, ...distractors]);

  return {
    id: getUniqueId('deriv-poly'),
    topicId: 'calculus',
    subtopicId: 'derivatives',
    unit: '미적분학 기초',
    title: '다항함수의 도함수와 미분계수 (f\'(x))',
    difficulty,
    questionText,
    questionLatex: `${fxLatex}, \\quad x = ${x0}`,
    correctAnswer: answerStr,
    answerDisplayLatex,
    distractors,
    choices,
    steps,
    hints: [
      '미분 공식: (x³)\' = 3x², (x²)\' = 2x, (x)\' = 1, (상수)\' = 0',
      '도함수 f\'(x)를 먼저 구한 뒤 x 값을 대입하세요.'
    ],
    conceptSummary: '미분계수는 곡선 위의 한 점에서 그은 접선의 기울기이자 순간변화율(Rate of Change)을 의미합니다.'
  };
}

/**
 * Definite Integral: \int_0^k (2ax + b) dx = [ a x^2 + b x ]_0^k = a k^2 + b k
 */
export function generateDefiniteIntegral(difficulty: Difficulty = 'medium'): Problem {
  const a = getRandomInt(1, 3); // so integrand is 2a*x
  const b = getRandomInt(1, 5);
  const k = getRandomInt(1, 4);

  // \int_0^k (2ax + b) dx = a*k^2 + b*k
  const integrandLatex = `${2 * a === 1 ? '' : 2 * a}x + ${b}`;
  const integralVal = a * (k * k) + b * k;

  const questionLatex = `\\int_{0}^{${k}} (${integrandLatex}) \\, dx`;
  const answerStr = `${integralVal}`;
  const answerDisplayLatex = `${integralVal}`;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '부정적분(원시함수 F(x)) 구하기',
      explanation: '미분의 역연산 공식 ∫ x^n dx = (1/(n+1)) x^(n+1) 을 적용합니다.',
      mathLatex: `F(x) = ${a === 1 ? '' : a}x^2 + ${b}x`
    },
    {
      stepNumber: 2,
      title: '미적분학의 기본정리 (F(b) - F(a)) 적용',
      explanation: `적분 구간 [0, ${k}]의 상한과 하한을 대입하여 차를 구합니다.`,
      mathLatex: `\\left[ ${a === 1 ? '' : a}x^2 + ${b}x \\right]_0^{${k}} = F(${k}) - F(0)`
    },
    {
      stepNumber: 3,
      title: '최종 정적분 값 계산',
      explanation: `F(${k})를 계산합니다.`,
      mathLatex: `(${a}(${k})^2 + ${b}(${k})) - 0 = ${a * k * k} + ${b * k} = ${integralVal}`
    }
  ];

  const distractorsSet = new Set<string>();
  distractorsSet.add((integralVal + 2).toString());
  distractorsSet.add((integralVal - 2).toString());
  distractorsSet.add((2 * a * k + b).toString()); // forgot integral, just evaluated
  distractorsSet.delete(answerStr);

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([answerStr, ...distractors]);

  return {
    id: getUniqueId('integ-def'),
    topicId: 'calculus',
    subtopicId: 'integrals',
    unit: '미적분학 기초',
    title: '정적분의 계산과 기하학적 넓이',
    difficulty,
    questionText: `다음 정적분의 값을 계산하세요.`,
    questionLatex,
    correctAnswer: answerStr,
    answerDisplayLatex,
    distractors,
    choices,
    steps,
    hints: [
      '∫ (cx + d) dx = (c/2)x² + dx',
      '상한값을 대입한 값에서 하한값을 대입한 값을 뺍니다.'
    ],
    conceptSummary: '정적분은 곡선 아래 면적의 누적합(Sum of slices)을 나타내는 미적분학의 핵심 연산입니다.'
  };
}
