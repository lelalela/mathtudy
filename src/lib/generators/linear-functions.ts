import { Problem, ProblemStep, Difficulty } from './types';
import { getRandomInt, getRandomNonZeroInt, simplifyFraction, shuffleArray, getUniqueId } from './math-utils';

export function generateSlopeFromTwoPoints(difficulty: Difficulty = 'medium'): Problem {
  const x1 = getRandomInt(-5, 4);
  const dx = getRandomNonZeroInt(1, 6);
  const x2 = x1 + dx;

  const m = getRandomInt(-3, 4);
  const y1 = getRandomInt(-6, 6);
  const y2 = y1 + m * dx;

  const dy = y2 - y1;
  const slopeFraction = simplifyFraction(dy, dx);
  const slopeVal = slopeFraction.stringValue;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '직선의 기울기 공식 확인하기',
      explanation: '두 점을 지나는 직선의 기울기는 [y의 변화량(수직 이동) / x의 변화량(수평 이동)]으로 정의됩니다.',
      why: '기울기는 등산로의 "가파른 경사도"를 뜻합니다. 가로로 몇 걸음 전진할 때(x 증가량), 세로로 몇 미터 올라가거나 내려갔는지(y 증가량)의 비율입니다.',
      mathLatex: `m = \\frac{\\Delta y}{\\Delta x} = \\frac{y_2 - y_1}{x_2 - x_1}`,
      pitfall: 'x와 y의 위치를 뒤집어서 (x의 증가량 / y의 증가량)으로 분모·분자를 거꾸로 적는 실수를 가장 많이 합니다. 반드시 y가 위(분자)입니다!'
    },
    {
      stepNumber: 2,
      title: '좌표값 대입 및 변화량 계산하기',
      explanation: `두 점 (${x1}, ${y1})과 (${x2}, ${y2})를 공식에 대입합니다: 분자 y의 차이는 ${y2} - (${y1}) = ${dy}, 분모 x의 차이는 ${x2} - (${x1}) = ${dx}입니다.`,
      why: '끝점 좌표에서 시작점 좌표를 순서대로 빼주어야 올바른 이동 방향과 부호가 유지됩니다.',
      mathLatex: `m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${dy}}{${dx}}`,
      pitfall: '음수 좌표를 뺄 때 부호 충돌(-(-y1))을 괄호 없이 적다가 부호 실수가 발생하기 쉽습니다. 음수는 반드시 괄호를 치고 빼세요.'
    },
    {
      stepNumber: 3,
      title: '기약분수 또는 정수로 최종 정리',
      explanation: `분수 \\frac{${dy}}{${dx}}를 약분하여 가장 간단한 형태인 ${slopeFraction.latex}로 정리합니다.`,
      why: '비율은 가장 작은 정수 비율(기약분수)이나 깔끔한 정수로 나타내는 것이 수학적 표준입니다.',
      mathLatex: `m = ${slopeFraction.latex}`,
      pitfall: '약분 가능한 분수를 약분하지 않고 그대로 두지 않도록 확인하세요.'
    }
  ];

  const distractorsSet = new Set<string>();
  if (dy !== 0) {
    const inv = simplifyFraction(dx, dy);
    if (inv.stringValue !== slopeVal) distractorsSet.add(inv.stringValue);
  }
  distractorsSet.add(simplifyFraction(-dy, dx).stringValue);
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
    unit: '04. 일차함수와 그래프',
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
      '음수 좌표를 뺄 때 부호 변화(-(-k) = +k)에 유의하세요!'
    ],
    conceptSummary: '직선의 기울기는 x가 1단위 증가할 때 y가 얼마나 변화하는지를 나타내는 비율입니다.'
  };
}

export function generateLinearFunctionIntercepts(difficulty: Difficulty = 'medium'): Problem {
  const a = getRandomNonZeroInt(-4, 4);
  const rootX = getRandomInt(-6, 6);
  const b = -a * rootX;

  const signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  const aStr = a === 1 ? '' : a === -1 ? '-' : `${a}`;
  const funcLatex = `y = ${aStr}x ${signB}`;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: 'x절편의 의미 확인 및 y = 0 대입',
      explanation: `x절편은 그래프가 x축과 만나는 교점의 x좌표입니다. x축 위의 모든 점은 높이가 0(y = 0)이므로 식에 y = 0을 대입합니다: ${aStr}x ${signB} = 0.`,
      why: '좌표평면에서 가로축(x축)은 y가 0인 선입니다. 따라서 x축과 부딪히는 지점을 찾으려면 y 자리에 0을 넣기만 하면 됩니다.',
      mathLatex: `y = 0 \\implies ${aStr}x ${signB} = 0`,
      pitfall: 'x절편을 물었는데 식 맨 뒤에 보이는 상수항(y절편 ${b})을 그대로 적어버리는 실수를 주의하세요!'
    },
    {
      stepNumber: 2,
      title: '일차방정식을 풀어 x 구하기',
      explanation: `상수항 ${signB}를 우변으로 이항하면 ${aStr}x = ${-b}가 되고, x의 계수 ${a}로 나누면 x = ${rootX}가 도출됩니다.`,
      why: 'y=0을 대입함으로써 함수 문제가 단순한 "미지수 x를 구하는 일차방정식"으로 바뀌었습니다.',
      mathLatex: `${aStr}x = ${-b} \\implies x = \\frac{${-b}}{${a}} = ${rootX}`,
      pitfall: '이항할 때 부호를 반대로 바꾸지 않아 -${rootX}로 부호가 틀리는 실수를 조심하세요.'
    }
  ];

  const distractorsSet = new Set<string>();
  distractorsSet.add(b.toString());
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
    unit: '04. 일차함수와 그래프',
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
