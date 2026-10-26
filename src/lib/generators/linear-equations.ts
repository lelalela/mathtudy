import { Problem, ProblemStep, Difficulty } from './types';
import { getRandomInt, getRandomNonZeroInt, shuffleArray, getUniqueId } from './math-utils';

export function generateTwoStepLinearEquation(difficulty: Difficulty = 'medium'): Problem {
  // ax + b = c  => ax = c - b => x = (c - b) / a
  // To ensure nice integer solution: pick a and target x first!
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
      title: '상수항 이항하기',
      explanation: `양변에서 상수항(${b > 0 ? b : `(${b})`})을 이항(반대 부호로 더함/뺌)하여 x가 있는 항만 좌변에 남깁니다.`,
      mathLatex: `${a}x = ${c} - (${b}) \\implies ${a}x = ${cMinusB}`
    },
    {
      stepNumber: 2,
      title: 'x의 계수로 양변 나누기',
      explanation: `x의 계수인 ${a}로 양변을 나누어 x의 값을 구합니다.`,
      mathLatex: `x = \\frac{${cMinusB}}{${a}} = ${targetX}`
    },
    {
      stepNumber: 3,
      title: '검산 (정답 확인)',
      explanation: `구한 x = ${targetX}를 원래 식에 대입하여 좌변과 우변이 일치하는지 확인합니다.`,
      mathLatex: `${a}(${targetX}) ${signB} = ${a * targetX} ${signB} = ${c}`
    }
  ];

  const distractorsSet = new Set<string>();
  // Mistake 1: sign error when transposing b (c + b instead of c - b)
  const wrongX1 = Math.round((c + b) / a);
  if (wrongX1 !== targetX) distractorsSet.add(wrongX1.toString());

  // Mistake 2: forgot to divide by negative sign of a
  if (a < 0) distractorsSet.add((-targetX).toString());

  // Mistake 3: add offset
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
    unit: '일차방정식',
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
  // ax + b = cx + d => (a - c)x = d - b
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
      title: '동류항 모으기 (x항은 좌변, 상수항은 우변)',
      explanation: `우변의 ${c}x를 좌변으로 이항하고, 좌변의 상수항(${b})을 우변으로 이항합니다.`,
      mathLatex: `${a}x - ${c}x = ${d} - (${b})`
    },
    {
      stepNumber: 2,
      title: '동류항 계산',
      explanation: '각 변의 동류항을 정리합니다.',
      mathLatex: `${diffA}x = ${diffD}`
    },
    {
      stepNumber: 3,
      title: 'x의 계수로 나누어 해 구하기',
      explanation: `양변을 ${diffA}로 나눕니다.`,
      mathLatex: `x = \\frac{${diffD}}{${diffA}} = ${targetX}`
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
    unit: '일차방정식',
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
