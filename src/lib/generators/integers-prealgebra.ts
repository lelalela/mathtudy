import { Problem, ProblemStep, Difficulty } from './types';
import { getRandomInt, shuffleArray, getUniqueId } from './math-utils';

export function generateNegativeArithmetic(difficulty: Difficulty = 'medium'): Problem {
  // Problem: a - (-b) or (-a) * (-b) or (-a) + b
  const type = getRandomInt(1, 3);
  let questionLatex = '';
  let result = 0;
  const steps: ProblemStep[] = [];
  const distractorsSet = new Set<string>();

  if (type === 1) {
    // a - (-b) = a + b
    const a = getRandomInt(-15, 10);
    const b = getRandomInt(3, 15);
    questionLatex = `${a} - (-${b})`;
    result = a + b;

    steps.push({
      stepNumber: 1,
      title: '마이너스 부호 정리',
      explanation: '음수를 빼는 것은 같은 수의 양수를 더하는 것과 같습니다: -(-b) = +b',
      mathLatex: `${a} - (-${b}) = ${a} + ${b}`
    });
    steps.push({
      stepNumber: 2,
      title: '최종 덧셈',
      explanation: '두 정수를 더합니다.',
      mathLatex: `${a} + ${b} = ${result}`
    });

    distractorsSet.add((a - b).toString());
    distractorsSet.add((-a - b).toString());
    distractorsSet.add((-result).toString());
  } else if (type === 2) {
    // (-a) * (-b) = ab
    const a = getRandomInt(3, 12);
    const b = getRandomInt(3, 9);
    questionLatex = `(-${a}) \\times (-${b})`;
    result = a * b;

    steps.push({
      stepNumber: 1,
      title: '음수 곱셈 부호 규칙 적용',
      explanation: '음수와 음수의 곱은 항상 양수가 됩니다: (-) × (-) = (+)',
      mathLatex: `(-${a}) \\times (-${b}) = +(${a} \\times ${b})`
    });
    steps.push({
      stepNumber: 2,
      title: '절댓값 곱 계산',
      explanation: '두 수의 절댓값을 곱합니다.',
      mathLatex: `${a} \\times ${b} = ${result}`
    });

    distractorsSet.add((-result).toString());
    distractorsSet.add((-(a + b)).toString());
    distractorsSet.add((a + b).toString());
  } else {
    // (-a) * b or (-a) + (-b)
    const a = getRandomInt(4, 15);
    const b = getRandomInt(5, 18);
    questionLatex = `(-${a}) + (-${b})`;
    result = -(a + b);

    steps.push({
      stepNumber: 1,
      title: '부호가 같은 두 음수의 덧셈',
      explanation: '부호가 같은 두 음수를 더할 때는 절댓값을 더하고 앞에 마이너스(-) 부호를 붙입니다.',
      mathLatex: `(-${a}) + (-${b}) = -(${a} + ${b})`
    });
    steps.push({
      stepNumber: 2,
      title: '계산 완료',
      explanation: '절댓값의 합에 음수 부호를 적용합니다.',
      mathLatex: `-(${a + b}) = ${result}`
    });

    distractorsSet.add((a + b).toString());
    distractorsSet.add((b - a).toString());
    distractorsSet.add((a - b).toString());
  }

  distractorsSet.delete(result.toString());
  while (distractorsSet.size < 3) {
    const candidate = (result + getRandomInt(-4, 4)).toString();
    if (candidate !== result.toString()) distractorsSet.add(candidate);
  }

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([result.toString(), ...distractors]);

  return {
    id: getUniqueId('neg-arith'),
    topicId: 'integers',
    subtopicId: 'negative-numbers',
    unit: '정수와 유리수',
    title: '음수의 연산과 부호 규칙',
    difficulty,
    questionText: '다음 음수가 포함된 식을 부호 규칙에 맞추어 계산하세요.',
    questionLatex,
    correctAnswer: result.toString(),
    answerDisplayLatex: `${result}`,
    distractors,
    choices,
    steps,
    hints: [
      '부호 규칙: (-) × (-) = (+),  (-) × (+) = (-)',
      '마이너스를 빼는 것(-(-k))은 양수를 더하는 것(+k)과 같습니다.'
    ],
    conceptSummary: '음수의 연산에서는 마이너스 부호의 중첩과 곱셈 부호 규칙을 정확히 판별하는 것이 핵심입니다.'
  };
}

export function generateExponentBasic(difficulty: Difficulty = 'medium'): Problem {
  // e.g. x^a * x^b = x^(a+b) or (x^a)^b = x^(ab)
  const isPowerOfPower = getRandomInt(0, 1) === 1;
  const a = getRandomInt(2, 5);
  const b = getRandomInt(2, 4);

  let questionLatex = '';
  let resultExp = 0;
  const steps: ProblemStep[] = [];
  const distractorsSet = new Set<string>();

  if (!isPowerOfPower) {
    // a^m * a^n = a^(m+n)
    questionLatex = `a^{${a}} \\times a^{${b}}`;
    resultExp = a + b;

    steps.push({
      stepNumber: 1,
      title: '지수법칙 곱셈 공식 적용',
      explanation: '밑이 같은 거듭제곱의 곱셈에서는 지수끼리 더합니다: a^m × a^n = a^(m+n)',
      mathLatex: `a^{${a}} \\times a^{${b}} = a^{${a} + ${b}}`
    });
    steps.push({
      stepNumber: 2,
      title: '지수 덧셈 계산',
      explanation: '지수를 더해 최종 거듭제곱을 구합니다.',
      mathLatex: `a^{${a} + ${b}} = a^{${resultExp}}`
    });

    distractorsSet.add(`a^{${a * b}}`); // Common mistake: multiplying exponents
    distractorsSet.add(`a^{${Math.abs(a - b)}}`);
    distractorsSet.add(`a^{${resultExp + 1}}`);
  } else {
    // (a^m)^n = a^(m*n)
    questionLatex = `(a^{${a}})^{${b}}`;
    resultExp = a * b;

    steps.push({
      stepNumber: 1,
      title: '거듭제곱의 거듭제곱 법칙 적용',
      explanation: '거듭제곱의 거듭제곱은 안팎의 지수를 서로 곱합니다: (a^m)^n = a^(m × n)',
      mathLatex: `(a^{${a}})^{${b}} = a^{${a} \\times ${b}}`
    });
    steps.push({
      stepNumber: 2,
      title: '지수 곱셈 계산',
      explanation: '두 지수를 곱하여 최종 지수를 구합니다.',
      mathLatex: `a^{${a} \\times ${b}} = a^{${resultExp}}`
    });

    distractorsSet.add(`a^{${a + b}}`); // Common mistake: adding exponents
    distractorsSet.add(`a^{${resultExp - 1}}`);
    distractorsSet.add(`a^{${resultExp + 2}}`);
  }

  const correctLatex = `a^{${resultExp}}`;
  distractorsSet.delete(correctLatex);

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([correctLatex, ...distractors]);

  return {
    id: getUniqueId('exp-basic'),
    topicId: 'integers',
    subtopicId: 'exponents',
    unit: '정수와 유리수',
    title: '기초 지수법칙',
    difficulty,
    questionText: '다음 거듭제곱 식을 지수법칙을 사용하여 가장 간단히 나타내세요.',
    questionLatex,
    correctAnswer: correctLatex,
    answerDisplayLatex: correctLatex,
    distractors,
    choices,
    steps,
    hints: [
      '밑이 같을 때 곱셈은 지수의 덧셈: a^m × a^n = a^(m+n)',
      '괄호 밖의 거듭제곱은 지수의 곱셈: (a^m)^n = a^(mn)'
    ],
    conceptSummary: '거듭제곱의 곱셈과 거듭제곱의 거듭제곱에서 지수를 더해야 하는지 곱해야 하는지를 구분하는 것이 핵심입니다.'
  };
}
