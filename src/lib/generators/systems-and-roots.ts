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
      title: '한 문자 소거를 위한 계수 맞추기 (가감법 준비)',
      explanation: `미지수 y를 없애기 위해 첫 번째 식에 |${b2}|를 곱하고 두 번째 식에 |${b1}|을 곱하여 y 앞의 계수의 절댓값을 똑같이 맞춥니다.`,
      why: '미지수가 x와 y 두 개면 한 번에 답을 낼 수 없습니다. 양변에 수를 곱해 y의 크기를 똑같이 맞춘 뒤 두 식을 빼버리면 y가 사라져(소거) 단순한 일차방정식이 됩니다.',
      mathLatex: `(${eq1}) \\times ${Math.abs(b2)}, \\quad (${eq2}) \\times ${Math.abs(b1)}`,
      pitfall: '등호 오른쪽의 숫자(상수항)에는 곱하는 것을 깜빡 잊는 실수를 가장 많이 합니다. 식 전체의 모든 항에 똑같이 곱해야 등식이 유지됩니다!'
    },
    {
      stepNumber: 2,
      title: '두 식을 더하거나 빼서 첫 번째 미지수 x 구하기',
      explanation: `계수를 맞춘 두 식을 빼서 y를 제거하고, x에 대한 일차방정식을 풀어 x = ${targetX}를 구합니다.`,
      why: '골칫거리였던 y가 완전히 사라졌으므로 중학교 1학년 일차방정식 풀이로 바로 해결됩니다.',
      mathLatex: `x = ${targetX}`,
      pitfall: '두 식을 뺄 때 아래 식의 부호가 전체적으로 반전되므로 뺄셈 부호 실수를 조심하세요.'
    },
    {
      stepNumber: 3,
      title: '구한 x를 대입하여 나머지 미지수 y 구하기',
      explanation: `알아낸 x = ${targetX}를 원래의 첫 번째 식(${eq1})에 대입하여 일차방정식을 풀면 y = ${targetY}가 나옵니다.`,
      why: '둘 중 하나(x)의 정체를 알아냈으니, 원래 식에 쏙 집어넣으면 나머지 하나(y)도 저절로 풀립니다.',
      mathLatex: `${a1}(${targetX}) + (${b1})y = ${c1} \\implies y = ${targetY}`,
      pitfall: '최종 답을 적을 때 x와 y의 순서가 바뀌지 않았는지 다시 확인하세요.'
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
    unit: '06. 연립일차방정식',
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
      title: '이차방정식의 계수(a, b, c) 추출하기',
      explanation: `일반형 ax² + bx + c = 0 과 비교하여 계수를 확인합니다: a = ${a}, b = ${b}, c = ${c}.`,
      why: '판별식 공식에 넣기 전 각각의 계수가 양수인지 음수인지 부호까지 정확히 확인해야 계산 실수를 막을 수 있습니다.',
      mathLatex: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
      pitfall: 'x 항이나 상수항의 부호가 마이너스(-)일 때 부호를 빠뜨리지 않도록 주의하세요.'
    },
    {
      stepNumber: 2,
      title: '판별식 공식 D = b² - 4ac 대입 및 계산',
      explanation: `공식에 대입하여 계산합니다: (${b})² - 4 \\times ${a} \\times (${c}) = ${b * b} - (${4 * a * c}) = ${D}.`,
      why: '근의 공식에서 루트 안쪽에 들어가는 식이 바로 b² - 4ac입니다. 이 값이 양수인지 음수인지에 따라 근의 성격이 완전히 결정됩니다.',
      mathLatex: `D = (${b})^2 - 4(${a})(${c}) = ${b * b} - (${4 * a * c}) = ${D}`,
      pitfall: 'c가 음수일 때 -4ac는 마이너스와 마이너스가 곱해져 플러스(+)가 됩니다. 부호 처리에 각별히 유의하세요!'
    },
    {
      stepNumber: 3,
      title: '판별식 부호로 근의 종류 판별하기',
      explanation: D > 0
        ? `D = ${D} > 0 이므로 루트 속이 양수가 되어 '서로 다른 두 실근'을 갖습니다.`
        : D === 0
        ? `D = 0 이므로 루트 부분이 사라져(±0) 오직 하나의 '중근(실근)'을 갖습니다.`
        : `D = ${D} < 0 이므로 루트 속에 음수가 들어가 실수 범위에 존재하지 않는 '서로 다른 두 허근'을 갖습니다.`,
      why: '루트 속이 0보다 크면 ±로 값이 2개 갈라지고, 0이면 1개로 겹치며, 0보다 작으면 허수 i가 생기기 때문입니다.',
      mathLatex: D > 0 ? `D = ${D} > 0 \\implies \\text{서로 다른 두 실근}` : D === 0 ? `D = 0 \\implies \\text{중근}` : `D = ${D} < 0 \\implies \\text{서로 다른 두 허근}`,
      pitfall: '중근도 실근의 일종입니다. "실근의 개수"를 물을 때는 D ≥ 0(D>0 또는 D=0)이어야 합니다.'
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
    unit: '06. 연립방정식과 대수',
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
