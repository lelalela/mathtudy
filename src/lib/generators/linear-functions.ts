import { Problem, ProblemStep, Difficulty } from './types';
import { getRandomInt, getRandomNonZeroInt, simplifyFraction, shuffleArray, getUniqueId } from './math-utils';

export function generateSlopeFromTwoPoints(difficulty: Difficulty = 'medium'): Problem {
  // Point A (x1, y1), Point B (x2, y2)
  const x1 = getRandomInt(-5, 4);
  const dx = getRandomNonZeroInt(1, 6);
  const x2 = x1 + dx; // ensures x2 !== x1

  // Choose a nice slope or integer slope
  const m = getRandomInt(-3, 4);
  const y1 = getRandomInt(-6, 6);
  const y2 = y1 + m * dx;

  const dy = y2 - y1;
  const slopeFraction = simplifyFraction(dy, dx);
  const slopeVal = slopeFraction.stringValue;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '기울기 공식 확인',
      explanation: '두 점 (x₁, y₁)과 (x₂, y₂)를 지나는 직선의 기울기 m은 [y의 변화량 / x의 변화량]입니다.',
      mathLatex: `m = \\frac{\\Delta y}{\\Delta x} = \\frac{y_2 - y_1}{x_2 - x_1}`
    },
    {
      stepNumber: 2,
      title: '좌표 대입 및 계산',
      explanation: `주어진 두 점 (${x1}, ${y1})과 (${x2}, ${y2})의 좌표를 공식에 대입합니다.`,
      mathLatex: `m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${dy}}{${dx}}`
    },
    {
      stepNumber: 3,
      title: '기약분수 또는 정수로 약분',
      explanation: '분수 형태의 기울기를 기약분수 또는 정수로 정리합니다.',
      mathLatex: `m = ${slopeFraction.latex}`
    }
  ];

  const distractorsSet = new Set<string>();
  // Mistake 1: inverted slope dx / dy
  if (dy !== 0) {
    const inv = simplifyFraction(dx, dy);
    if (inv.stringValue !== slopeVal) distractorsSet.add(inv.stringValue);
  }
  // Mistake 2: sign flipped
  distractorsSet.add(simplifyFraction(-dy, dx).stringValue);
  // Mistake 3: add offset
  distractorsSet.add((m + 1).toString());
  distractorsSet.add((m - 1).toString());
  distractorsSet.delete(slopeVal);

  while (distractorsSet.size < 3) {
    const fallback = (m + getRandomInt(-4, 4)).toString();
    if (fallback !== slopeVal) distractorsSet.add(fallback);
  }

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([slopeVal, ...distractors]);

  return {
    id: getUniqueId('slope-pts'),
    topicId: 'functions',
    subtopicId: 'linear-functions-slope',
    unit: '일차함수와 그래프',
    title: '두 점을 지나는 직선의 기울기 구하기',
    difficulty,
    questionText: `두 점 $A(${x1}, ${y1})$과 $B(${x2}, ${y2})$를 지나는 직선의 기울기를 구하세요.`,
    questionLatex: `A(${x1}, ${y1}),\\quad B(${x2}, ${y2})`,
    correctAnswer: slopeVal,
    answerDisplayLatex: `m = ${slopeFraction.latex}`,
    distractors,
    choices,
    steps,
    hints: [
      '기울기 = (y의 증가량) / (x의 증가량) = (y2 - y1) / (x2 - x1)',
      '음수 좌표를 뺄 때 부호 변화에 유의하세요!'
    ],
    conceptSummary: '직선의 기울기는 x가 1단위 증가할 때 y가 얼마나 변화하는지를 나타내는 비율입니다.'
  };
}

export function generateLinearFunctionIntercepts(difficulty: Difficulty = 'medium'): Problem {
  // y = ax + b, find y-intercept or x-intercept
  const a = getRandomNonZeroInt(-4, 4);
  const rootX = getRandomInt(-6, 6);
  // b = -a * rootX
  const b = -a * rootX;

  const signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  const aStr = a === 1 ? '' : a === -1 ? '-' : `${a}`;
  const funcLatex = `y = ${aStr}x ${signB}`;

  // Let's ask for the x-intercept: where y = 0
  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: 'x절편의 정의 확인',
      explanation: 'x절편은 그래프가 x축과 만나는 점의 x좌표이며, 이때 y값은 항상 0입니다.',
      mathLatex: `y = 0 \\implies ${aStr}x ${signB} = 0`
    },
    {
      stepNumber: 2,
      title: 'x에 대해 방정식 풀기',
      explanation: `상수항을 이항하고 x의 계수로 나눕니다.`,
      mathLatex: `${aStr}x = ${-b} \\implies x = \\frac{${-b}}{${a}} = ${rootX}`
    }
  ];

  const distractorsSet = new Set<string>();
  distractorsSet.add(b.toString()); // Common confusion: taking y-intercept instead
  distractorsSet.add((-rootX).toString());
  distractorsSet.add((rootX + 1).toString());
  distractorsSet.delete(rootX.toString());

  while (distractorsSet.size < 3) {
    const candidate = (rootX + getRandomInt(-5, 5)).toString();
    if (candidate !== rootX.toString()) distractorsSet.add(candidate);
  }

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([rootX.toString(), ...distractors]);

  return {
    id: getUniqueId('linear-intercept'),
    topicId: 'functions',
    subtopicId: 'linear-functions-intercept',
    unit: '일차함수와 그래프',
    title: '일차함수의 x절편 구하기',
    difficulty,
    questionText: `일차함수 $${funcLatex}$의 그래프에서 x절편을 구하세요.`,
    questionLatex: funcLatex,
    correctAnswer: rootX.toString(),
    answerDisplayLatex: `x = ${rootX}`,
    distractors,
    choices,
    steps,
    hints: [
      'x절편은 y = 0 일 때의 x값입니다.',
      '주어진 식에 y = 0을 대입하여 x에 대한 일차방정식을 푸세요.'
    ],
    conceptSummary: 'x절편은 그래프가 x축과 교차하는 점의 x좌표(y=0)이고, y절편은 y축과 교차하는 점의 y좌표(x=0)입니다.'
  };
}
