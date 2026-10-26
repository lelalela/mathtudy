import { Problem, ProblemStep, Difficulty } from './types';
import { getRandomInt, simplifyFraction, shuffleArray, getUniqueId } from './math-utils';

export function generateFractionAddition(difficulty: Difficulty = 'medium'): Problem {
  const d1 = difficulty === 'easy' ? getRandomInt(2, 6) : getRandomInt(3, 9);
  const d2 = difficulty === 'easy' ? d1 : getRandomInt(2, 8);
  const n1 = getRandomInt(1, d1 - 1);
  const n2 = getRandomInt(1, d2 - 1);

  // n1/d1 + n2/d2 = (n1*d2 + n2*d1) / (d1*d2)
  const commonDen = d1 === d2 ? d1 : d1 * d2;
  const numSum = d1 === d2 ? n1 + n2 : n1 * d2 + n2 * d1;
  const simplified = simplifyFraction(numSum, commonDen);

  const steps: ProblemStep[] = [];
  if (d1 === d2) {
    steps.push({
      stepNumber: 1,
      title: '분모 확인',
      explanation: '두 분수의 분모가 같으므로 분자끼리 더합니다.',
      mathLatex: `\\frac{${n1}}{${d1}} + \\frac{${n2}}{${d2}} = \\frac{${n1} + ${n2}}{${d1}} = \\frac{${numSum}}{${commonDen}}`
    });
  } else {
    steps.push({
      stepNumber: 1,
      title: '통분하기 (공통분모 구하기)',
      explanation: `두 분모 ${d1}과 ${d2}의 공통분모인 ${commonDen}으로 통분합니다.`,
      mathLatex: `\\frac{${n1} \\times ${d2}}{${d1} \\times ${d2}} + \\frac{${n2} \\times ${d1}}{${d2} \\times ${d1}} = \\frac{${n1 * d2}}{${commonDen}} + \\frac{${n2 * d1}}{${commonDen}}`
    });
    steps.push({
      stepNumber: 2,
      title: '분자끼리 더하기',
      explanation: '통분된 분모를 유지한 채 분자끼리 더합니다.',
      mathLatex: `\\frac{${n1 * d2} + ${n2 * d1}}{${commonDen}} = \\frac{${numSum}}{${commonDen}}`
    });
  }

  if (simplified.denominator !== commonDen) {
    steps.push({
      stepNumber: steps.length + 1,
      title: '기약분수로 약분',
      explanation: `분자와 분모의 최대공약수로 나누어 가장 간단한 기약분수로 만듭니다.`,
      mathLatex: `\\frac{${numSum}}{${commonDen}} = ${simplified.latex}`
    });
  }

  // Create plausible distractors
  const distractorsSet = new Set<string>();
  // Distractor 1: Add numerators and add denominators (common mistake: (n1+n2)/(d1+d2))
  const naiveSum = simplifyFraction(n1 + n2, d1 + d2);
  if (naiveSum.stringValue !== simplified.stringValue) distractorsSet.add(naiveSum.stringValue);

  // Distractor 2: Forgot to multiply cross numerator
  const mistake2 = simplifyFraction(n1 + n2, commonDen);
  if (mistake2.stringValue !== simplified.stringValue) distractorsSet.add(mistake2.stringValue);

  // Distractor 3: Subtract instead of add
  const mistake3 = simplifyFraction(Math.abs(numSum - 2), commonDen);
  if (mistake3.stringValue !== simplified.stringValue) distractorsSet.add(mistake3.stringValue);

  // Fill up to 3 distractors
  let offset = 1;
  while (distractorsSet.size < 3) {
    const fallback = simplifyFraction(numSum + offset, commonDen);
    if (fallback.stringValue !== simplified.stringValue) {
      distractorsSet.add(fallback.stringValue);
    }
    offset++;
  }

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([simplified.stringValue, ...distractors]);

  return {
    id: getUniqueId('frac-add'),
    topicId: 'arithmetic',
    subtopicId: 'fractions',
    unit: '기초 산수',
    title: '분수의 덧셈',
    difficulty,
    questionText: '다음 두 분수의 덧셈을 계산하여 기약분수(또는 정수)로 나타내세요.',
    questionLatex: `\\frac{${n1}}{${d1}} + \\frac{${n2}}{${d2}}`,
    correctAnswer: simplified.stringValue,
    answerDisplayLatex: simplified.latex,
    distractors,
    choices,
    steps,
    hints: [
      '분수의 덧셈은 먼저 분모를 같게 만드는 "통분"이 필요합니다.',
      `공통분모 ${commonDen}을 만들어 각 분자의 크기를 맞춘 뒤 더하세요.`
    ],
    conceptSummary: '분모가 서로 다른 분수의 덧셈은 두 분모의 공배수로 통분한 후 분자끼리 더합니다.'
  };
}

export function generateOrderOfOperations(difficulty: Difficulty = 'medium'): Problem {
  // e.g. a + b * (c - d) or a * b + c / d
  const a = getRandomInt(2, 9);
  const b = getRandomInt(2, 6);
  const c = getRandomInt(3, 8);
  const d = getRandomInt(1, c - 1); // c - d > 0

  // Problem: a + b * (c - d)
  const innerParen = c - d;
  const product = b * innerParen;
  const result = a + product;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '괄호 안 먼저 계산',
      explanation: '사칙연산에서는 괄호 안의 계산을 가장 먼저 수행합니다.',
      mathLatex: `(${c} - ${d}) = ${innerParen}`
    },
    {
      stepNumber: 2,
      title: '곱셈 계산',
      explanation: '덧셈보다 곱셈/나눗셈을 먼저 계산합니다.',
      mathLatex: `${b} \\times ${innerParen} = ${product}`
    },
    {
      stepNumber: 3,
      title: '최종 덧셈',
      explanation: '남은 덧셈을 계산하여 최종 결과를 도출합니다.',
      mathLatex: `${a} + ${product} = ${result}`
    }
  ];

  const distractorsSet = new Set<string>();
  // Mistake 1: Left to right ignoring precedence (a + b) * (c - d)
  distractorsSet.add(((a + b) * innerParen).toString());
  // Mistake 2: b * c first then - d then + a
  distractorsSet.add((a + b * c - d).toString());
  // Mistake 3: result +- 2
  distractorsSet.add((result + 2).toString());
  distractorsSet.delete(result.toString());

  while (distractorsSet.size < 3) {
    const candidate = (result + getRandomInt(-5, 5)).toString();
    if (candidate !== result.toString()) distractorsSet.add(candidate);
  }

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([result.toString(), ...distractors]);

  return {
    id: getUniqueId('order-op'),
    topicId: 'arithmetic',
    subtopicId: 'operations-order',
    unit: '기초 산수',
    title: '사칙연산 우선순위 혼합계산',
    difficulty,
    questionText: '다음 혼합 계산식을 연산 우선순위에 맞추어 계산하세요.',
    questionLatex: `${a} + ${b} \\times (${c} - ${d})`,
    correctAnswer: result.toString(),
    answerDisplayLatex: `${result}`,
    distractors,
    choices,
    steps,
    hints: [
      '연산 우선순위: 1) 괄호 안 → 2) 곱셈/나눗셈 → 3) 덧셈/뺄셈',
      '왼쪽부터 순서대로 더하지 않도록 주의하세요!'
    ],
    conceptSummary: '사칙혼합연산은 괄호 → 곱셈/나눗셈 → 덧셈/뺄셈 순서로 계산해야 올바른 값이 도출됩니다.'
  };
}
