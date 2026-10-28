import { Problem, ProblemStep, Difficulty } from './types';
import { getRandomInt, shuffleArray, getUniqueId } from './math-utils';

export function generateQuadraticFactoring(difficulty: Difficulty = 'medium'): Problem {
  const r1 = getRandomInt(-6, 6);
  let r2 = getRandomInt(-6, 6);
  if (r1 === r2) {
    r2 = r1 === 6 ? 5 : r1 + 1;
  }

  const rootLow = Math.min(r1, r2);
  const rootHigh = Math.max(r1, r2);

  const bCoeff = -(rootLow + rootHigh);
  const cCoeff = rootLow * rootHigh;

  const bSign = bCoeff >= 0 ? `+ ${bCoeff === 1 ? '' : bCoeff}` : `- ${Math.abs(bCoeff) === 1 ? '' : Math.abs(bCoeff)}`;
  const bTerm = bCoeff === 0 ? '' : `${bSign}x`;
  const cSign = cCoeff >= 0 ? `+ ${cCoeff}` : `- ${Math.abs(cCoeff)}`;
  const cTerm = cCoeff === 0 ? '' : ` ${cSign}`;

  const eqLatex = `x^2 ${bTerm}${cTerm} = 0`;

  const factor1Sign = rootLow >= 0 ? `- ${rootLow}` : `+ ${Math.abs(rootLow)}`;
  const factor2Sign = rootHigh >= 0 ? `- ${rootHigh}` : `+ ${Math.abs(rootHigh)}`;
  const factoredLatex = `(x ${factor1Sign})(x ${factor2Sign}) = 0`;

  const answerStr = `${rootLow}, ${rootHigh}`;
  const answerDisplayLatex = `x = ${rootLow} \\quad \\text{또는} \\quad x = ${rootHigh}`;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '합과 곱으로 두 수 찾기 (인수분해 핵심 원리)',
      explanation: `곱해서 상수항 ${cCoeff}가 되고, 더해서 x의 계수(${bCoeff})의 반대 부호인 ${-bCoeff}가 되는 두 정수를 탐색합니다. 그 두 수는 바로 ${rootLow}와 ${rootHigh}입니다.`,
      why: '(x - α)(x - β)를 전개해보면 x² - (α + β)x + αβ가 됩니다. 가운데 x 항은 두 근의 "합"의 반대 부호이고, 끝의 상수는 두 근의 "곱"이 되는 대칭적 성질을 이용합니다.',
      mathLatex: `\\begin{cases} \\alpha + \\beta = ${-bCoeff} \\\\ \\alpha \\times \\beta = ${cCoeff} \\end{cases} \\implies \\alpha = ${rootLow}, \\; \\beta = ${rootHigh}`,
      pitfall: '상수항의 부호가 음수(-)이면 두 수의 부호가 서로 반대이고, 양수(+)이면 두 수의 부호가 서로 같다는 점을 잊지 마세요.'
    },
    {
      stepNumber: 2,
      title: '일차식의 곱 형태로 인수분해하기',
      explanation: `찾은 두 근 ${rootLow}와 ${rootHigh}를 바탕으로 이차식을 두 일차식의 곱으로 변형합니다: ${factoredLatex}.`,
      why: '복잡한 2차식을 두 개의 단순한 1차식 묶음(A × B)으로 쪼개면 0의 성질을 이용해 아주 쉽게 해를 구할 수 있습니다.',
      mathLatex: `x^2 ${bTerm}${cTerm} = ${factoredLatex}`,
      pitfall: '괄호 안에 넣을 때는 근의 부호와 반대로 들어갑니다: 근이 ${rootLow}이면 괄호 안은 (x ${factor1Sign})입니다.'
    },
    {
      stepNumber: 3,
      title: '각 괄호를 0으로 만드는 해 도출하기',
      explanation: `두 괄호의 곱이 0이 되려면 앞 괄호가 0이거나 뒤 괄호가 0이어야 합니다. 따라서 x = ${rootLow} 또는 x = ${rootHigh}가 최종 정답입니다.`,
      why: '어떤 두 수를 곱해서 0이 나오려면(A × B = 0), 반드시 A가 0이거나 B가 0이어야만 합니다. 둘 다 0이 아닌데 곱해서 0이 되는 수는 존재하지 않습니다.',
      mathLatex: `x ${factor1Sign} = 0 \\implies x = ${rootLow} \\quad \\text{또는} \\quad x ${factor2Sign} = 0 \\implies x = ${rootHigh}`,
      pitfall: '괄호 안의 숫자 부호를 그대로 해로 착각하여 -${rootLow}, -${rootHigh}로 부호를 반대로 적는 실수를 가장 많이 합니다!'
    }
  ];

  const distractorsSet = new Set<string>();
  distractorsSet.add(`${-rootHigh}, ${-rootLow}`);
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
    unit: '05. 이차방정식',
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
      '곱해서 상수항이 되고, 더해서 x 계수의 반대부호가 되는 두 정수를 먼저 찾으세요.',
      '인수분해 $(x - \\alpha)(x - \\beta) = 0$ 이면 해는 $x = \\alpha$ 또는 $x = \\beta$ 입니다.'
    ],
    conceptSummary: '이차방정식 $x^2 + bx + c = 0$ 은 두 수의 합과 곱을 분석하여 $(x - \\alpha)(x - \\beta) = 0$ 으로 인수분해하여 해를 구합니다.'
  };
}
