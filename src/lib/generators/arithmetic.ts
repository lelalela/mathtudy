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
      title: '분모 확인 및 분자 더하기',
      explanation: `두 분수의 분모가 이미 ${d1}로 같으므로, 분모는 그대로 두고 위의 분자끼리 더합니다 (${n1} + ${n2} = ${numSum}).`,
      why: '분모는 피자 한 조각의 "크기"를 뜻합니다. 크기가 같으므로 조각의 개수(분자)만 세어서 합치면 됩니다.',
      mathLatex: `\\frac{${n1}}{${d1}} + \\frac{${n2}}{${d2}} = \\frac{${n1} + ${n2}}{${d1}} = \\frac{${numSum}}{${commonDen}}`,
      pitfall: '분모끼리 더해서 분모를 2배로 만들지 마세요! 피자 조각 크기는 변하지 않습니다.'
    });
  } else {
    steps.push({
      stepNumber: 1,
      title: '통분하기 (공통분모 만들기)',
      explanation: `두 분모 ${d1}과 ${d2}가 다르므로, 둘의 공배수인 ${commonDen}으로 맞춥니다. 앞 분수에는 위아래에 ${d2}를 곱하고, 뒤 분수에는 ${d1}을 곱합니다.`,
      why: '피자를 3조각으로 나눈 것과 4조각으로 나눈 것은 크기가 달라 바로 더할 수 없습니다. 따라서 둘 다 똑같이 12조각으로 더 잘게 쪼개어 기준 크기를 일치시키는 과정이 바로 "통분"입니다.',
      mathLatex: `\\frac{${n1} \\times ${d2}}{${d1} \\times ${d2}} + \\frac{${n2} \\times ${d1}}{${d2} \\times ${d1}} = \\frac{${n1 * d2}}{${commonDen}} + \\frac{${n2 * d1}}{${commonDen}}`,
      pitfall: '분모에만 수를 곱하고 분자에는 곱하는 것을 깜빡하면 분수의 본래 크기가 완전히 달라집니다. 위아래에 똑같은 수를 곱해야 합니다!'
    });
    steps.push({
      stepNumber: 2,
      title: '분자끼리 합치기',
      explanation: `이제 분모가 ${commonDen}으로 통일되었으므로, 분모는 그대로 두고 분자 ${n1 * d2}와 ${n2 * d1}을 더합니다 (${n1 * d2} + ${n2 * d1} = ${numSum}).`,
      why: '기준 크기(분모)가 맞춰졌으므로 이제 조각의 개수(분자)끼리만 더해주면 전체 양이 됩니다.',
      mathLatex: `\\frac{${n1 * d2} + ${n2 * d1}}{${commonDen}} = \\frac{${numSum}}{${commonDen}}`,
      pitfall: '분모끼리 더해서 분모를 두 배(${commonDen * 2})로 적는 실수를 가장 많이 합니다. 통분된 분모는 절대 더하지 않고 유지합니다.'
    });
  }

  if (simplified.denominator !== commonDen) {
    steps.push({
      stepNumber: steps.length + 1,
      title: '기약분수로 약분하기',
      explanation: `분자 ${numSum}과 분모 ${commonDen}을 공통 약수로 나누어 더 이상 나눌 수 없는 가장 간단한 기약분수로 정리합니다.`,
      why: '수학에서는 크기가 같은 수 중 가장 읽기 쉽고 간결한 형태(기약분수)를 표준 정답으로 약속합니다.',
      mathLatex: `\\frac{${numSum}}{${commonDen}} = ${simplified.latex}`,
      pitfall: '약분할 때 분자만 나누거나 분모만 나누지 않도록 주의하세요. 반드시 같은 수로 위아래를 똑같이 나누어야 합니다.'
    });
  }

  // Create plausible distractors
  const distractorsSet = new Set<string>();
  const naiveSum = simplifyFraction(n1 + n2, d1 + d2);
  if (naiveSum.stringValue !== simplified.stringValue) distractorsSet.add(naiveSum.stringValue);

  const mistake2 = simplifyFraction(n1 + n2, commonDen);
  if (mistake2.stringValue !== simplified.stringValue) distractorsSet.add(mistake2.stringValue);

  const mistake3 = simplifyFraction(Math.abs(numSum - 2), commonDen);
  if (mistake3.stringValue !== simplified.stringValue) distractorsSet.add(mistake3.stringValue);

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
    unit: '01. 기초 산수',
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
      `공통분모 ${commonDen}을 만들어 각 분자의 크기를 맞춘 뒤 분자만 더하세요.`
    ],
    conceptSummary: '분모가 서로 다른 분수의 덧셈은 분모의 공배수로 통분한 후, 분모는 그대로 두고 분자끼리만 더합니다.'
  };
}

export function generateOrderOfOperations(difficulty: Difficulty = 'medium'): Problem {
  const a = getRandomInt(2, 9);
  const b = getRandomInt(2, 6);
  const c = getRandomInt(3, 8);
  const d = getRandomInt(1, c - 1); // c - d > 0

  const innerParen = c - d;
  const product = b * innerParen;
  const result = a + product;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '괄호 안 (소괄호) 먼저 계산하기',
      explanation: `식 전체를 보기 전에 가장 안쪽에 묶여 있는 괄호 (${c} - ${d})를 먼저 풉니다. 계산 결과는 ${innerParen}입니다.`,
      why: '수학에서 괄호는 "이 묶음을 하나의 덩어리로 먼저 처리하라"는 가장 강력한 우선순위 규칙입니다.',
      mathLatex: `(${c} - ${d}) = ${innerParen} \\implies ${a} + ${b} \\times ${innerParen}`,
      pitfall: '괄호 밖의 수와 먼저 연산(예: 앞의 ${a} + ${b})을 하시면 안 됩니다. 괄호가 무조건 1순위입니다!'
    },
    {
      stepNumber: 2,
      title: '곱셈 계산하기 (사칙연산 우선순위)',
      explanation: `이제 덧셈과 곱셈이 남았습니다 (${a} + ${b} \\times ${innerParen}). 덧셈보다 곱셈을 먼저 계산하므로 ${b} \\times ${innerParen} = ${product}가 됩니다.`,
      why: '곱셈은 "같은 수를 여러 번 더하는 묶음 계산"이므로 개별 낱개를 더하는 덧셈보다 결합력이 훨씬 강합니다.',
      mathLatex: `${b} \\times ${innerParen} = ${product} \\implies ${a} + ${product}`,
      pitfall: '왼쪽에서 오른쪽으로 읽는 버릇 때문에 ${a} + ${b}를 먼저 계산해 버리는 실수를 가장 조심해야 합니다!'
    },
    {
      stepNumber: 3,
      title: '남은 덧셈으로 최종 정답 구하기',
      explanation: `마지막으로 남아 있는 앞의 수 ${a}와 곱셈 결과 ${product}를 더합니다: ${a} + ${product} = ${result}.`,
      why: '모든 우선순위(괄호, 곱셈) 처리가 끝났으므로 기본 덧셈을 수행하여 하나의 값으로 완성합니다.',
      mathLatex: `${a} + ${product} = ${result}`,
      pitfall: '계산 순서가 바르면 실수가 생길 여지가 없습니다. 항상 괄호 → 곱셈/나눗셈 → 덧셈/뺄셈 순서를 지키세요.'
    }
  ];

  const distractorsSet = new Set<string>();
  distractorsSet.add(((a + b) * innerParen).toString());
  distractorsSet.add((a + b * c - d).toString());
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
    unit: '01. 기초 산수',
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
