import { Problem, ProblemStep, Difficulty } from './types';
import { getRandomInt, shuffleArray, getUniqueId } from './math-utils';

export function generateQuadraticFactoring(difficulty: Difficulty = 'medium'): Problem {
  // (x - r1)(x - r2) = x^2 - (r1+r2)x + r1*r2 = 0
  const r1 = getRandomInt(-6, 6);
  let r2 = getRandomInt(-6, 6);
  if (r1 === r2) {
    r2 = r1 === 6 ? 5 : r1 + 1;
  }

  // Ensure r1 <= r2 for consistent formatting
  const rootLow = Math.min(r1, r2);
  const rootHigh = Math.max(r1, r2);

  const bCoeff = -(rootLow + rootHigh);
  const cCoeff = rootLow * rootHigh;

  const bSign = bCoeff >= 0 ? `+ ${bCoeff === 1 ? '' : bCoeff}` : `- ${Math.abs(bCoeff) === 1 ? '' : Math.abs(bCoeff)}`;
  const bTerm = bCoeff === 0 ? '' : `${bSign}x`;
  const cSign = cCoeff >= 0 ? `+ ${cCoeff}` : `- ${Math.abs(cCoeff)}`;
  const cTerm = cCoeff === 0 ? '' : ` ${cSign}`;

  const eqLatex = `x^2 ${bTerm}${cTerm} = 0`;

  // Factor form: (x - r1)(x - r2) = 0
  const factor1Sign = rootLow >= 0 ? `- ${rootLow}` : `+ ${Math.abs(rootLow)}`;
  const factor2Sign = rootHigh >= 0 ? `- ${rootHigh}` : `+ ${Math.abs(rootHigh)}`;
  const factoredLatex = `(x ${factor1Sign})(x ${factor2Sign}) = 0`;

  const answerStr = `${rootLow}, ${rootHigh}`;
  const answerDisplayLatex = `x = ${rootLow} \\quad \\text{또는} \\quad x = ${rootHigh}`;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '합과 곱으로 인수분해 공식 적용',
      explanation: `두 수의 합이 ${-bCoeff}이고 곱이 ${cCoeff}인 두 정수를 찾습니다.`,
      mathLatex: `\\begin{cases} \\alpha + \\beta = ${-bCoeff} \\\\ \\alpha \\times \\beta = ${cCoeff} \\end{cases} \\implies \\alpha = ${rootLow}, \\; \\beta = ${rootHigh}`
    },
    {
      stepNumber: 2,
      title: '인수분해 형태로 식 변형',
      explanation: '구한 두 근을 이용해 이차식을 일차식의 곱으로 인수분해합니다.',
      mathLatex: `x^2 ${bTerm}${cTerm} = ${factoredLatex}`
    },
    {
      stepNumber: 3,
      title: '각 일차식을 0으로 만드는 해 구하기',
      explanation: '두 인수의 곱이 0이 되려면 어느 한쪽이 0이어야 합니다.',
      mathLatex: `x ${factor1Sign} = 0 \\implies x = ${rootLow} \\quad \\text{또는} \\quad x ${factor2Sign} = 0 \\implies x = ${rootHigh}`
    }
  ];

  const distractorsSet = new Set<string>();
  // Mistake 1: sign error in roots
  distractorsSet.add(`${-rootHigh}, ${-rootLow}`);
  // Mistake 2: one sign wrong
  distractorsSet.add(`${-rootLow}, ${rootHigh}`);
  distractorsSet.add(`${rootLow}, ${-rootHigh}`);
  distractorsSet.add(`${rootLow + 1}, ${rootHigh + 1}`);
  distractorsSet.delete(answerStr);

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([answerStr, ...distractors]);

  return {
    id: getUniqueId('quad-factor'),
    topicId: 'quadratics',
    subtopicId: 'quadratics-factoring',
    unit: '이차방정식',
    title: '인수분해를 이용한 이차방정식 풀이',
    difficulty,
    questionText: '다음 이차방정식을 인수분해하여 해를 구하세요. (작은 수, 큰 수 순서)',
    questionLatex: eqLatex,
    correctAnswer: answerStr,
    answerDisplayLatex,
    distractors,
    choices,
    steps,
    hints: [
      '곱해서 상수항이 되고, 더해서 x의 계수가 되는 두 정수를 먼저 찾으세요.',
      '인수분해 $(x - \\alpha)(x - \\beta) = 0$ 이면 해는 $x = \\alpha$ 또는 $x = \\beta$ 입니다.'
    ],
    conceptSummary: '이차방정식 $x^2 + bx + c = 0$ 은 두 수의 합과 곱을 분석하여 $(x - \\alpha)(x - \\beta) = 0$ 으로 인수분해하여 해를 구합니다.'
  };
}
