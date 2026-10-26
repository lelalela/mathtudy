import { Problem, ProblemStep, Difficulty } from './types';
import { getRandomInt, getRandomNonZeroInt, shuffleArray, getUniqueId } from './math-utils';

/**
 * 2x2 System of Linear Equations
 * a1*x + b1*y = c1
 * a2*x + b2*y = c2
 */
export function generateSystemOfLinearEquations(difficulty: Difficulty = 'medium'): Problem {
  const targetX = getRandomInt(-5, 5);
  const targetY = getRandomInt(-5, 5);

  const a1 = getRandomNonZeroInt(-3, 4);
  const b1 = getRandomNonZeroInt(-3, 4);
  const a2 = getRandomNonZeroInt(-3, 4);
  let b2 = getRandomNonZeroInt(-3, 4);

  // Ensure linearly independent (det != 0)
  while (a1 * b2 - a2 * b1 === 0) {
    b2 = getRandomNonZeroInt(-3, 4);
  }

  const c1 = a1 * targetX + b1 * targetY;
  const c2 = a2 * targetX + b2 * targetY;

  const fmtEq = (a: number, b: number, c: number) => {
    const aStr = a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`;
    const bStr = b > 0 ? `+ ${b === 1 ? '' : b}y` : `- ${Math.abs(b) === 1 ? '' : Math.abs(b)}y`;
    return `${aStr} ${bStr} = ${c}`;
  };

  const eq1 = fmtEq(a1, b1, c1);
  const eq2 = fmtEq(a2, b2, c2);

  const questionLatex = `\\begin{cases} ${eq1} \\\\ ${eq2} \\end{cases}`;
  const answerStr = `x=${targetX}, y=${targetY}`;
  const answerDisplayLatex = `x = ${targetX}, \\quad y = ${targetY}`;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '연립방정식 계수 맞추기 (가감법)',
      explanation: '한 미지수를 소거하기 위해 각 식의 양변에 적절한 수를 곱해 계수의 절댓값을 일치시킵니다.',
      mathLatex: `(${eq1}) \\times (${Math.abs(b2)}), \\quad (${eq2}) \\times (${Math.abs(b1)})`
    },
    {
      stepNumber: 2,
      title: '두 식을 가감하여 첫 번째 미지수 구하기',
      explanation: 'y를 소거하고 x에 대한 일차방정식을 풀어 x의 해를 구합니다.',
      mathLatex: `x = ${targetX}`
    },
    {
      stepNumber: 3,
      title: 'x를 대입하여 y 구하기',
      explanation: `구한 x = ${targetX}를 첫 번째 식에 대입하여 y의 값을 구합니다.`,
      mathLatex: `y = ${targetY}`
    }
  ];

  const distractorsSet = new Set<string>();
  distractorsSet.add(`x=${targetX + 1}, y=${targetY - 1}`);
  distractorsSet.add(`x=${-targetX}, y=${targetY}`);
  distractorsSet.add(`x=${targetY}, y=${targetX}`);
  distractorsSet.add(`x=${targetX}, y=${-targetY}`);
  distractorsSet.delete(answerStr);

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([answerStr, ...distractors]);

  return {
    id: getUniqueId('sys-eq'),
    topicId: 'systems-equations',
    subtopicId: 'systems-equations',
    unit: '연립일차방정식',
    title: '연립일차방정식 (가감법과 대입법)',
    difficulty,
    questionText: '다음 연립방정식을 풀어 미지수 x와 y의 값을 순서대로 구하세요.',
    questionLatex,
    correctAnswer: answerStr,
    answerDisplayLatex,
    distractors,
    choices,
    steps,
    hints: [
      '가감법: 한 문자의 계수를 맞춰 두 식을 더하거나 빼서 한 문자를 소거하세요.',
      '대입법: 한 식을 x = ... 꼴로 정리한 뒤 다른 식에 대입해도 됩니다.'
    ],
    conceptSummary: '연립방정식은 미지수가 2개인 식에서 한 미지수를 소거(가감법/대입법)하여 일차방정식으로 환원해 풉니다.'
  };
}

/**
 * Discriminant of Quadratic Equation D = b^2 - 4ac
 */
export function generateQuadraticDiscriminant(difficulty: Difficulty = 'medium'): Problem {
  const a = getRandomInt(1, 3);
  const b = getRandomInt(-6, 6);
  const c = getRandomInt(-5, 5);

  const D = b * b - 4 * a * c;

  const aStr = a === 1 ? '' : `${a}`;
  const bStr = b > 0 ? `+ ${b}x` : b < 0 ? `- ${Math.abs(b)}x` : '';
  const cStr = c > 0 ? `+ ${c}` : c < 0 ? `- ${Math.abs(c)}` : '';
  const eqLatex = `${aStr}x^2 ${bStr} ${cStr} = 0`;

  let rootType = '';
  if (D > 0) rootType = '서로 다른 두 실근';
  else if (D === 0) rootType = '중근 (서로 같은 두 실근)';
  else rootType = '서로 다른 두 허근';

  const answerStr = `${D}`;
  const answerDisplayLatex = `D = ${D} \\; (${rootType})`;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '이차방정식의 계수 확인',
      explanation: `ax² + bx + c = 0 에서 a = ${a}, b = ${b}, c = ${c} 입니다.`,
      mathLatex: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`
    },
    {
      stepNumber: 2,
      title: '판별식 공식 대입',
      explanation: '판별식 D = b² - 4ac 공식을 사용하여 판별식 값을 계산합니다.',
      mathLatex: `D = (${b})^2 - 4(${a})(${c}) = ${b * b} - (${4 * a * c}) = ${D}`
    },
    {
      stepNumber: 3,
      title: '근의 종류 판정',
      explanation: D > 0 ? 'D > 0 이므로 서로 다른 두 실근을 갖습니다.' : D === 0 ? 'D = 0 이므로 중근을 갖습니다.' : 'D < 0 이므로 서로 다른 두 허근을 갖습니다.',
      mathLatex: D > 0 ? 'D > 0 \\implies \\text{서로 다른 두 실근}' : D === 0 ? 'D = 0 \\implies \\text{중근}' : 'D < 0 \\implies \\text{서로 다른 두 허근}'
    }
  ];

  const distractorsSet = new Set<string>();
  distractorsSet.add((b * b + 4 * a * c).toString());
  distractorsSet.add((D + 4).toString());
  distractorsSet.add((-D).toString());
  distractorsSet.delete(answerStr);

  while (distractorsSet.size < 3) {
    distractorsSet.add((D + getRandomInt(-10, 10)).toString());
    distractorsSet.delete(answerStr);
  }

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([answerStr, ...distractors]);

  return {
    id: getUniqueId('quad-disc'),
    topicId: 'high-algebra',
    subtopicId: 'quadratic-discriminant',
    unit: '고등 대수학',
    title: '이차방정식 판별식 (D = b² - 4ac)',
    difficulty,
    questionText: `이차방정식 $${eqLatex}$ 의 판별식 $D$ 의 값을 계산하세요.`,
    questionLatex: eqLatex,
    correctAnswer: answerStr,
    answerDisplayLatex,
    distractors,
    choices,
    steps,
    hints: [
      '판별식 공식: D = b² - 4ac',
      'D > 0 이면 서로 다른 두 실근, D = 0 이면 중근, D < 0 이면 허근입니다.'
    ],
    conceptSummary: '판별식 D는 근의 공식의 루트 안쪽 식(b² - 4ac)으로, 근을 직접 구하지 않고도 실근/허근의 개수를 즉시 판정해 줍니다.'
  };
}
