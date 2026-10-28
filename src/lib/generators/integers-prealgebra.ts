import { Problem, ProblemStep, Difficulty } from './types';
import { getRandomInt, shuffleArray, getUniqueId } from './math-utils';

export function generateNegativeArithmetic(difficulty: Difficulty = 'medium'): Problem {
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
      title: '이중 마이너스 부호 변환하기',
      explanation: `빼기 기호 뒤에 음수 괄호가 붙어 있는 '-(-${b})'는 부호가 반전되어 '+ ${b}'로 바뀝니다.`,
      why: '빚(-${b})을 탕감(빼기)해 주는 것은 내 재산이 +${b}만큼 늘어나는 것과 같습니다. 수학에서는 두 개의 연속된 마이너스가 만나면 항상 플러스(+)가 됩니다.',
      mathLatex: `${a} - (-${b}) = ${a} + ${b}`,
      pitfall: '괄호 안의 마이너스를 보고 무작정 뺄셈으로 계산해 ${a} - ${b}로 풀지 않도록 주의하세요.'
    });
    steps.push({
      stepNumber: 2,
      title: '정수 덧셈으로 최종 계산',
      explanation: `바뀐 식 ${a} + ${b}를 계산합니다. 시작점 ${a}에서 오른쪽으로 ${b}만큼 이동한 결과는 ${result}입니다.`,
      why: '부호 정리가 끝났으므로 수직선에서 오른쪽(+) 방향으로 크기만큼 이동해 정답을 찾습니다.',
      mathLatex: `${a} + ${b} = ${result}`,
      pitfall: '앞의 수가 음수(${a})일 때는 음수와 양수의 덧셈이므로 절댓값의 차이를 잘 생각해야 합니다.'
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
      title: '음수 곱셈 부호 판정하기',
      explanation: `음수(-${a})와 음수(-${b})를 곱할 때는 부호 먼저 결정합니다. 음수끼리의 곱은 항상 양수(+)가 됩니다.`,
      why: '수직선에서 마이너스는 "뒤로 돌기(방향 반전)"입니다. 뒤를 돌아본 상태에서 다시 한 번 뒤를 돌면 결국 원래 앞방향(+)을 바라보게 됩니다. 따라서 (-) × (-) = (+)입니다.',
      mathLatex: `(-${a}) \\times (-${b}) = +(${a} \\times ${b})`,
      pitfall: '음수가 두 개라고 해서 결과도 음수일 것이라 착각하여 -${result}로 적는 실수를 가장 많이 합니다.'
    });
    steps.push({
      stepNumber: 2,
      title: '절댓값 곱 계산하기',
      explanation: `부호가 (+)로 확정되었으므로, 두 숫자의 절댓값 ${a}와 ${b}를 곱하여 ${result}를 얻습니다.`,
      why: '부호와 크기를 분리해서 생각하면 아무리 큰 수라도 실수 없이 정확하게 계산할 수 있습니다.',
      mathLatex: `+(${a} \\times ${b}) = ${result}`,
      pitfall: '구구단 곱셈 실수를 조심하세요.'
    });

    distractorsSet.add((-result).toString());
    distractorsSet.add((-(a + b)).toString());
    distractorsSet.add((a + b).toString());
  } else {
    // (-a) + (-b)
    const a = getRandomInt(4, 15);
    const b = getRandomInt(5, 18);
    questionLatex = `(-${a}) + (-${b})`;
    result = -(a + b);

    steps.push({
      stepNumber: 1,
      title: '부호가 같은 두 음수의 덧셈 원리',
      explanation: `음수 -${a}에 또 다른 음수 -${b}를 더하는 것은 마이너스 방향으로 계속해서 누적하는 것입니다. 따라서 공통 부호인 마이너스(-)를 묶어냅니다.`,
      why: '${a}원의 빚에 ${b}원의 빚이 새로 더해진 상황입니다. 빚의 총량(${a} + ${b})을 구한 뒤 빚을 뜻하는 마이너스(-) 부호를 붙여줍니다.',
      mathLatex: `(-${a}) + (-${b}) = -(${a} + ${b})`,
      pitfall: '음수끼리 더하는 것인데 곱셈 부호 규칙と 혼동하여 (+)로 바꿔버리는 실수를 주의하세요. 덧셈에서는 마이너스가 누적됩니다.'
    });
    steps.push({
      stepNumber: 2,
      title: '괄호 안 합산 및 부호 적용',
      explanation: `절댓값의 합 ${a} + ${b} = ${a + b}를 계산하고, 앞에 음의 부호를 붙여 ${result}가 됩니다.`,
      why: '원점에서 왼쪽으로 ${a}칸 가고 또 왼쪽으로 ${b}칸 더 갔으므로 총 왼쪽으로 ${a + b}칸 위치에 도달합니다.',
      mathLatex: `-(${a} + ${b}) = ${result}`,
      pitfall: '양수/음수 덧셈에서 부호 판별에 집중하세요.'
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
    unit: '02. 정수와 유리수',
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
    conceptSummary: '음수의 연산에서는 마이너스 부호의 중첩(-(-x) = +x)과 곱셈/덧셈 부호 규칙의 차이를 구별하는 것이 핵심입니다.'
  };
}

export function generateExponentBasic(difficulty: Difficulty = 'medium'): Problem {
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
      title: '밑이 같은 곱셈의 지수법칙 적용',
      explanation: `밑이 'a'로 서로 같은 두 거듭제곱을 곱할 때는, 지수끼리 서로 더해줍니다: a^{${a}} \\times a^{${b}} = a^{${a} + ${b}}.`,
      why: 'a^{${a}}는 a를 ${a}번 곱한 것이고, a^{${b}}는 a를 ${b}번 곱한 것입니다. 둘을 나란히 곱하면 a가 총 (${a} + ${b})번 곱해진 것이 되므로 지수를 더해야 합니다.',
      mathLatex: `a^{${a}} \\times a^{${b}} = a^{${a} + ${b}}`,
      pitfall: '곱셈 기호(\\times)를 보고 지수끼리 곱해서 a^{${a * b}}로 계산하는 실수를 가장 많이 합니다. 밑이 곱해질 때는 지수를 더해야 합니다!'
    });
    steps.push({
      stepNumber: 2,
      title: '지수 합산하여 최종 형태 완성',
      explanation: `지수 덧셈 ${a} + ${b}를 계산하여 a^{${resultExp}}로 정리합니다.`,
      why: '거듭제곱의 기본 정의에 따라 곱해진 문자 a의 총 개수를 지수로 간결하게 표현합니다.',
      mathLatex: `a^{${a} + ${b}} = a^{${resultExp}}`,
      pitfall: '밑인 문자 a는 변하지 않고 지수 자리의 숫자만 변합니다.'
    });

    distractorsSet.add(`a^{${a * b}}`);
    distractorsSet.add(`a^{${Math.abs(a - b)}}`);
    distractorsSet.add(`a^{${resultExp + 1}}`);
  } else {
    // (a^m)^n = a^(m*n)
    questionLatex = `(a^{${a}})^{${b}}`;
    resultExp = a * b;

    steps.push({
      stepNumber: 1,
      title: '거듭제곱의 거듭제곱 법칙 적용',
      explanation: `괄호 밖의 지수가 있을 때는 안쪽 지수 ${a}와 바깥쪽 지수 ${b}를 서로 곱합니다: (a^{${a}})^{${b}} = a^{${a} \\times ${b}}.`,
      why: '(a^{${a}})^{${b}}는 a가 ${a}개씩 묶여 있는 덩어리가 총 ${b}개 있다는 뜻입니다. ${a}개씩 ${b}묶음이므로 총 개수는 곱셈(${a} \\times ${b})이 됩니다.',
      mathLatex: `(a^{${a}})^{${b}} = a^{${a} \\times ${b}}`,
      pitfall: '괄호 안팎의 지수를 곱해야 하는데 더해서 a^{${a + b}}로 잘못 계산하는 실수를 주의하세요.'
    });
    steps.push({
      stepNumber: 2,
      title: '지수 곱셈 완료',
      explanation: `지수 곱셈 ${a} \\times ${b} = ${resultExp}를 계산하여 최종 거듭제곱 a^{${resultExp}}를 구합니다.`,
      why: '묶음의 총 곱 개수를 단일 지수로 정리합니다.',
      mathLatex: `a^{${a} \\times ${b}} = a^{${resultExp}}`,
      pitfall: '밑 a 자체를 거듭제곱하지 않도록(지수만 곱함) 주의하세요.'
    });

    distractorsSet.add(`a^{${a + b}}`);
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
    unit: '02. 정수와 유리수',
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
    conceptSummary: '밑이 같은 거듭제곱의 곱셈은 지수를 더하고(a^m × a^n = a^(m+n)), 괄호로 묶인 거듭제곱은 지수를 곱합니다((a^m)^n = a^(mn)).'
  };
}
