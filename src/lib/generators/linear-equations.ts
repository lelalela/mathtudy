import { Problem, ProblemStep, Difficulty } from './types';
import { getRandomInt, getRandomNonZeroInt, shuffleArray, getUniqueId } from './math-utils';

export function generateTwoStepLinearEquation(difficulty: Difficulty = 'medium'): Problem {
  const a = getRandomNonZeroInt(2, difficulty === 'easy' ? 5 : 8) * (getRandomInt(0, 1) === 1 ? 1 : -1);
  const targetX = getRandomInt(-9, 9);
  const b = getRandomNonZeroInt(-15, 15);
  const c = a * targetX + b;

  const signB = b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  const questionLatex = `${a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`} ${signB} = ${c}`;

  const cMinusB = c - b;
  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '상수항 이항하기 (x만 남기기 위한 첫걸음)',
      explanation: `x가 붙어있지 않은 숫자(${b > 0 ? `+${b}` : b})를 등호 반대편(우변)으로 넘깁니다. 부호가 반대로 바뀌어 ${c} - (${b}) = ${cMinusB}가 됩니다.`,
      why: '등호(=)는 양팔 저울과 같습니다. 저울의 한쪽에서 숫자(${b})를 덜어내면 균형을 유지하기 위해 반대쪽에서도 똑같이 ${b}를 빼주어야 합니다. 이것이 "이항"의 수학적 본질입니다.',
      mathLatex: `${a}x = ${c} - (${b}) \\implies ${a}x = ${cMinusB}`,
      pitfall: '등호를 건너갈 때 부호를 바꾸지 않는 실수를 가장 많이 합니다. (+가 넘어가면 -로, -가 넘어가면 +로 바뀝니다!)'
    },
    {
      stepNumber: 2,
      title: 'x의 계수로 양변 나누기',
      explanation: `x 앞에 곱해진 숫자 ${a}로 양변을 똑같이 나눕니다: ${cMinusB} \\div ${a} = ${targetX}. 따라서 x = ${targetX}가 도출됩니다.`,
      why: '${a}x는 "x가 ${a}개 묶여 있다"는 뜻입니다. 우리가 원하는 것은 순수한 x 1개의 값이므로 전체를 ${a}등분해주는 것입니다.',
      mathLatex: `x = \\frac{${cMinusB}}{${a}} = ${targetX}`,
      pitfall: '계수 ${a}가 음수(-)일 때 마이너스 부호를 빠뜨리고 나누지 마세요. 음수로 나누면 부호도 함께 반전됩니다.'
    },
    {
      stepNumber: 3,
      title: '검산 (내 답이 맞는지 직접 확인하기)',
      explanation: `구한 x = ${targetX}를 처음 문제 식에 대입해 봅니다: ${a}(${targetX}) ${signB} = ${a * targetX} ${signB} = ${c}. 좌변과 우변이 완벽히 일치합니다.`,
      why: '방정식은 시험에서 정답 여부를 스스로 100% 확신할 수 있는 유일한 분야입니다. 대입했을 때 양변이 같으면 무조건 정답입니다.',
      mathLatex: `${a}(${targetX}) ${signB} = ${a * targetX} ${signB} = ${c}`,
      pitfall: '대입하여 검산할 때 괄호를 씌우지 않고 곱셈을 빼먹으면 대입 계산 자체를 실수할 수 있습니다.'
    }
  ];

  const distractorsSet = new Set<string>();
  const wrongX1 = Math.round((c + b) / a);
  if (wrongX1 !== targetX) distractorsSet.add(wrongX1.toString());

  if (a < 0) distractorsSet.add((-targetX).toString());

  distractorsSet.add((targetX + 1).toString());
  distractorsSet.add((targetX - 1).toString());
  distractorsSet.add((-targetX).toString());
  distractorsSet.delete(targetX.toString());

  while (distractorsSet.size < 3) {
    const candidate = (targetX + getRandomInt(-4, 4)).toString();
    if (candidate !== targetX.toString()) distractorsSet.add(candidate);
  }

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([targetX.toString(), ...distractors]);

  return {
    id: getUniqueId('linear-eq2'),
    topicId: 'algebra',
    subtopicId: 'linear-equations',
    unit: '03. 일차방정식',
    title: '일차방정식 풀이 (ax + b = c)',
    difficulty,
    questionText: '다음 일차방정식을 풀어 미지수 x의 값을 구하세요.',
    questionLatex,
    correctAnswer: targetX.toString(),
    answerDisplayLatex: `x = ${targetX}`,
    distractors,
    choices,
    steps,
    hints: [
      '1단계: 상수항을 등호 반대편으로 넘기세요 (이항하면 부호가 반대로 바뀝니다).',
      `2단계: 좌변의 x 계수(${a})로 양변을 나누세요.`
    ],
    conceptSummary: '일차방정식을 풀 때는 [미지수 항은 좌변, 상수항은 우변]으로 모은 후, 미지수의 계수로 양변을 나눕니다.'
  };
}

export function generateBothSidesLinearEquation(difficulty: Difficulty = 'hard'): Problem {
  const a = getRandomInt(2, 6);
  let c = getRandomInt(1, 5);
  while (a === c) {
    c = getRandomInt(1, 5);
  }
  const targetX = getRandomInt(-7, 7);
  const b = getRandomInt(-12, 12);
  const d = (a - c) * targetX + b;

  const signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  const signD = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`;
  const questionLatex = `${a}x ${signB} = ${c === 1 ? 'x' : `${c}x`} ${signD}`;

  const diffA = a - c;
  const diffD = d - b;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '동류항 모으기 (교통정리: x항은 좌변, 숫자항은 우변)',
      explanation: `우변의 ${c}x를 부호를 바꿔 좌변으로 넘기고, 좌변의 숫자 ${b >= 0 ? `+${b}` : b}를 부호를 바꿔 우변으로 넘깁니다: ${a}x - ${c}x = ${d} - (${b}).`,
      why: 'x항과 숫자가 양변에 뒤섞여 있으면 비교할 수 없습니다. 문자(x)와 상수(숫자)를 각각 자기 자리로 정돈해야 단순한 계산이 가능해집니다.',
      mathLatex: `${a}x - ${c}x = ${d} - (${b})`,
      pitfall: '양쪽에서 서로 맞바꿔 넘길 때, 둘 중 하나만 부호를 바꾸고 다른 하나는 깜빡 잊는 실수를 가장 조심해야 합니다.'
    },
    {
      stepNumber: 2,
      title: '동류항 끼리 덧셈/뺄셈 정리',
      explanation: `좌변(${a}x - ${c}x = ${diffA}x)과 우변(${d} - (${b}) = ${diffD})을 각각 계산하여 단순한 하나의 식으로 만듭니다: ${diffA}x = ${diffD}.`,
      why: '사과 ${a}개에서 사과 ${c}개를 뺀 것과 같으므로 계수끼리 뺄셈(${a} - ${c})을 해줍니다.',
      mathLatex: `(${a} - ${c})x = ${diffD} \\implies ${diffA}x = ${diffD}`,
      pitfall: '우변의 마이너스 부호 연산(${d} - (${b}))에서 부호 중첩 실수를 주의하세요.'
    },
    {
      stepNumber: 3,
      title: 'x의 계수로 양변 나누기',
      explanation: `x 앞의 계수 ${diffA}로 우변의 ${diffD}를 나누어 x = ${targetX}를 구합니다.`,
      why: 'x의 순수한 1개 분량을 얻기 위해 계수 ${diffA}로 등식 양변을 나눕니다.',
      mathLatex: `x = \\frac{${diffD}}{${diffA}} = ${targetX}`,
      pitfall: '나눗셈할 때 분자와 분모의 위치를 뒤바꿔서 역수로 계산하지 않도록 조심하세요.'
    }
  ];

  const distractorsSet = new Set<string>();
  distractorsSet.add((-targetX).toString());
  distractorsSet.add((targetX + 2).toString());
  distractorsSet.add((targetX - 2).toString());
  distractorsSet.delete(targetX.toString());

  while (distractorsSet.size < 3) {
    const candidate = (targetX + getRandomInt(-4, 4)).toString();
    if (candidate !== targetX.toString()) distractorsSet.add(candidate);
  }

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([targetX.toString(), ...distractors]);

  return {
    id: getUniqueId('linear-both'),
    topicId: 'algebra',
    subtopicId: 'linear-equations-advanced',
    unit: '03. 일차방정식',
    title: '양변에 미지수가 있는 일차방정식',
    difficulty,
    questionText: '다음 일차방정식을 풀어 미지수 x의 값을 구하세요.',
    questionLatex,
    correctAnswer: targetX.toString(),
    answerDisplayLatex: `x = ${targetX}`,
    distractors,
    choices,
    steps,
    hints: [
      '양변에 x항이 있을 때는 x항들을 한쪽 변(좌변)으로 모으는 것이 첫걸음입니다.',
      '이항할 때 부호 변화에 주의하세요!'
    ],
    conceptSummary: '등식의 성질을 이용하여 미지수가 포함된 항을 좌변으로, 상수항을 우변으로 이항하여 정리합니다.'
  };
}
