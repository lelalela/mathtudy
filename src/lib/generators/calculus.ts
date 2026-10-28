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
      title: '거듭제곱 미분 공식(Power Rule) 적용하기',
      explanation: `지수를 계수로 앞으로 내리고 차수를 1씩 낮춥니다: (x³)' = 3x², (x²)' = 2x, (x)' = 1. 상수항 ${d}는 미분하면 0이 되어 사라집니다.`,
      why: '미분은 곡선의 "순간적인 변화율(접선의 기울기)"을 구하는 연산입니다. 다항함수는 차수를 하나씩 깎아내려 도함수 f\'(x)를 만듭니다.',
      mathLatex: fPrimeLatex,
      pitfall: '상수항(x가 없는 숫자 ${d})을 미분할 때 0으로 지우지 않고 그대로 남겨두는 실수를 가장 많이 합니다. 고정된 숫자는 변화율이 0이므로 사라집니다!'
    },
    {
      stepNumber: 2,
      title: '구한 도함수에 x = x₀ 대입하기',
      explanation: `도함수 f'(x)의 모든 x 자리에 ${x0}를 대입하여 식을 세웁니다: ${da}(${x0})² ${db >= 0 ? `+ ${db}` : `- ${Math.abs(db)}`}(${x0}) ${dc >= 0 ? `+ ${dc}` : `- ${Math.abs(dc)}`}.`,
      why: '도함수 f\'(x)는 모든 지점의 기울기 공식이고, 여기에 x=${x0}를 대입해야 비로소 "바로 그 특정 지점에서의 순간 기울기"가 하나의 숫자로 결정됩니다.',
      mathLatex: `f'(${x0}) = ${da}(${x0})^2 ${db >= 0 ? `+ ${db}` : `- ${Math.abs(db)}`}(${x0}) ${dc >= 0 ? `+ ${dc}` : `- ${Math.abs(dc)}`}`,
      pitfall: '음수(-${Math.abs(x0)})를 대입할 때는 반드시 괄호를 치고 제곱해야 합니다. (-2)² = +4 입니다.'
    },
    {
      stepNumber: 3,
      title: '최종 미분계수 산출하기',
      explanation: `각 항을 계산하여 합산합니다: ${da * x0 * x0} ${db * x0 >= 0 ? `+ ${db * x0}` : `- ${Math.abs(db * x0)}`} ${dc >= 0 ? `+ ${dc}` : `- ${Math.abs(dc)}`} = ${fPrimeX0}.`,
      why: '순간속도(접선 기울기) 계산이 최종 완료되었습니다.',
      mathLatex: `f'(${x0}) = ${da * x0 * x0} ${db * x0 >= 0 ? `+ ${db * x0}` : `- ${Math.abs(db * x0)}`} ${dc >= 0 ? `+ ${dc}` : `- ${Math.abs(dc)}`} = ${fPrimeX0}`,
      pitfall: '곱셈과 덧셈 연산 순서를 지키고 부호 실수를 주의하세요.'
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
    unit: '09. 미적분학 기초',
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
  const a = getRandomInt(1, 3);
  const b = getRandomInt(1, 5);
  const k = getRandomInt(1, 4);

  const integrandLatex = `${2 * a === 1 ? '' : 2 * a}x + ${b}`;
  const integralVal = a * (k * k) + b * k;

  const questionLatex = `\\int_{0}^{${k}} (${integrandLatex}) \\, dx`;
  const answerStr = `${integralVal}`;
  const answerDisplayLatex = `${integralVal}`;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '부정적분(원시함수 F(x)) 구하기',
      explanation: `미분의 반대 연산을 수행합니다: ∫ x dx = (1/2)x², ∫ b dx = bx. 따라서 ${2 * a}x + ${b}를 적분하면 ${a === 1 ? '' : a}x² + ${b}x 가 됩니다.`,
      why: '적분(Integral)은 미분의 정반대 과정입니다. 차수를 1 올리고 새로운 차수로 나누어주는 거꾸로 연산입니다.',
      mathLatex: `F(x) = \\int (${integrandLatex}) \\, dx = ${a === 1 ? '' : a}x^2 + ${b}x`,
      pitfall: '미분과 적분을 헷갈려 차수를 줄여버리는 실수를 주의하세요. 적분은 차수를 하나 올려야 합니다!'
    },
    {
      stepNumber: 2,
      title: '미적분학의 기본정리 (구간 대입) 적용',
      explanation: `위끝(상한 ${k})을 대입한 값에서 아래끝(하한 0)을 대입한 값을 뺍니다: F(${k}) - F(0).`,
      why: '구간 [0, ${k}] 사이에 쌓인 직사각형들의 면적 누적합을 구하기 위해 끝점 누적값에서 시작점 누적값을 뺍니다.',
      mathLatex: `\\left[ ${a === 1 ? '' : a}x^2 + ${b}x \\right]_0^{${k}} = F(${k}) - F(0)`,
      pitfall: '위끝 대입값에서 아래끝 대입값을 빼는 순서(F(b) - F(a))가 뒤바뀌지 않도록 주의하세요.'
    },
    {
      stepNumber: 3,
      title: '수치 계산으로 최종 정적분 값(면적) 도출',
      explanation: `F(${k}) = ${a}(${k})² + ${b}(${k}) = ${a * k * k} + ${b * k} = ${integralVal} 이고, F(0) = 0 이므로 최종 답은 ${integralVal} 입니다.`,
      why: '곡선(직선) 아래 x축과 이루는 영역의 실제 넓이가 정확히 계산되었습니다.',
      mathLatex: `(${a}(${k})^2 + ${b}(${k})) - 0 = ${a * k * k} + ${b * k} = ${integralVal}`,
      pitfall: '제곱 연산(${k}²)을 먼저 한 뒤 계수(${a})를 곱해야 합니다.'
    }
  ];

  const distractorsSet = new Set<string>();
  distractorsSet.add((integralVal + 2).toString());
  distractorsSet.add((integralVal - 2).toString());
  distractorsSet.add((2 * a * k + b).toString());
  distractorsSet.delete(answerStr);

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([answerStr, ...distractors]);

  return {
    id: getUniqueId('integ-def'),
    topicId: 'calculus',
    subtopicId: 'integrals',
    unit: '09. 미적분학 기초',
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
