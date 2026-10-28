import { Problem, ProblemStep, Difficulty } from './types';
import { getRandomInt, shuffleArray, getUniqueId } from './math-utils';

export function generateLogarithmBasic(difficulty: Difficulty = 'medium'): Problem {
  const bases = [2, 3, 5, 10];
  const base = bases[getRandomInt(0, bases.length - 1)];
  const ans = getRandomInt(1, 4);
  const arg = Math.pow(base, ans);

  const questionLatex = `\\log_{${base}}(${arg})`;
  const answerStr = `${ans}`;
  const answerDisplayLatex = `${ans}`;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '로그의 본질적 의미 파악하기',
      explanation: `log_{${base}}(${arg}) = x 는 "${base}를 몇 번 거듭제곱해야 ${arg}가 나오는가? (${base}^x = ${arg})"를 묻는 연산입니다.`,
      why: '로그는 거듭제곱의 "지수를 찾아내는 탐정"입니다. 거듭제곱 식 a^x = b 에서 지수 x만 쏙 뽑아내어 표현하기 위해 만든 기호입니다.',
      mathLatex: `\\log_{${base}}(${arg}) = x \\iff ${base}^x = ${arg}`,
      pitfall: '진수 ${arg}를 밑 ${base}로 나누어서 ${arg / base}라고 적는 실수를 가장 많이 합니다. 나눗셈이 아니라 "거듭제곱 횟수"를 묻는 것입니다!'
    },
    {
      stepNumber: 2,
      title: '진수를 밑의 거듭제곱 형태로 변환하기',
      explanation: `진수 ${arg}를 밑 ${base}의 거듭제곱으로 나타내면 ${base}^{${ans}} 입니다: ${arg} = ${base}^{${ans}}.`,
      why: '밑과 진수의 밑을 똑같이 통일해주면 지수 값이 한눈에 드러납니다.',
      mathLatex: `${arg} = ${base}^{${ans}}`,
      pitfall: '거듭제곱 곱셈(예: ${base}를 ${ans}번 곱하기)을 덧셈이나 곱셈 구구단과 혼동하지 마세요.'
    },
    {
      stepNumber: 3,
      title: '로그 성질을 적용하여 지수 값 추출하기',
      explanation: `log_a(a^k) = k 성질에 따라 밑(${base})과 진수의 밑(${base})이 같으므로 지수인 ${ans}가 최종 답이 됩니다.`,
      why: 'a를 k제곱한 수에서 a의 거듭제곱 횟수는 당연히 k입니다.',
      mathLatex: `\\log_{${base}}(${base}^{${ans}}) = ${ans}`,
      pitfall: '밑과 진수가 완전히 일치할 때 log_a(a) = 1 이라는 기본 성질도 함께 기억해두세요.'
    }
  ];

  const distractorsSet = new Set<string>();
  distractorsSet.add((ans + 1).toString());
  distractorsSet.add((ans - 1).toString());
  distractorsSet.add((arg / base).toString());
  distractorsSet.delete(answerStr);

  while (distractorsSet.size < 3) {
    distractorsSet.add((ans + getRandomInt(-3, 3)).toString());
    distractorsSet.delete(answerStr);
  }

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([answerStr, ...distractors]);

  return {
    id: getUniqueId('log-val'),
    topicId: 'logarithms',
    subtopicId: 'log-basic',
    unit: '08. 지수와 로그',
    title: '로그의 기본 정의와 계산',
    difficulty,
    questionText: `다음 로그의 값을 구하세요.`,
    questionLatex,
    correctAnswer: answerStr,
    answerDisplayLatex,
    distractors,
    choices,
    steps,
    hints: [
      '밑을 몇 제곱해야 괄호 안의 진수가 나오는지 생각해보세요.',
      `${base}^? = ${arg}`
    ],
    conceptSummary: '로그는 지수 연산의 역연산으로, 큰 수를 다루거나 데이터의 차원을 축소할 때 핵심적으로 사용됩니다.'
  };
}

export function generateArithmeticSequence(difficulty: Difficulty = 'medium'): Problem {
  const a1 = getRandomInt(-5, 10);
  const d = getRandomInt(2, 6);
  const n = getRandomInt(5, 12);

  const an = a1 + (n - 1) * d;

  const questionText = `첫째항이 a₁ = ${a1} 이고 공차가 d = ${d} 인 등차수열의 제 ${n}항 (a_{${n}})을 구하세요.`;
  const questionLatex = `a_1 = ${a1}, \\quad d = ${d}, \\quad a_{${n}} = ?`;
  const answerStr = `${an}`;
  const answerDisplayLatex = `a_{${n}} = ${an}`;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '등차수열 일반항 공식 확인하기',
      explanation: `첫째항 a₁에서 시작하여 공차 d가 일정하게 더해지는 등차수열의 제 n항 공식은 a_n = a₁ + (n - 1)d 입니다.`,
      why: '첫 번째 항에서 n번째 항까지 도달하려면 징검다리를 (n - 1)번 건너야 합니다. 1번째 항 자신은 공차를 더하지 않고 출발하므로 n이 아니라 (n - 1)번 더합니다.',
      mathLatex: `a_n = a_1 + (n - 1)d`,
      pitfall: '공차 d를 n번 곱해서 a₁ + nd 로 계산해버리는 실수를 가장 많이 합니다. 반드시 (n - 1)을 곱해야 합니다!'
    },
    {
      stepNumber: 2,
      title: '문제의 수치 대입하기',
      explanation: `첫째항 ${a1}, 공차 ${d}, 항 번호 ${n}을 공식에 대입합니다: a_{${n}} = ${a1} + (${n} - 1) \\times ${d}.`,
      why: '1번째 항에서 출발하여 공차 ${d}를 총 ${n - 1}번 누적하여 더해주는 식을 세웁니다.',
      mathLatex: `a_{${n}} = ${a1} + (${n - 1}) \\times ${d}`,
      pitfall: '첫째항 ${a1}이 음수일 때 부호 처리에 유의하세요.'
    },
    {
      stepNumber: 3,
      title: '곱셈 우선 계산 후 최종 합산',
      explanation: `사칙연산 우선순위에 따라 곱셈(${n - 1} \\times ${d} = ${(n - 1) * d})을 먼저 계산하고, 첫째항 ${a1}을 더하여 ${an}을 얻습니다.`,
      why: '누적된 공차의 총량에 출발점의 값을 더해 현재 위치의 값을 완성합니다.',
      mathLatex: `a_{${n}} = ${a1} + ${(n - 1) * d} = ${an}`,
      pitfall: '앞의 덧셈을 먼저 하지 않고 반드시 뒤의 곱셈을 먼저 처리하세요.'
    }
  ];

  const distractorsSet = new Set<string>();
  distractorsSet.add((a1 + n * d).toString());
  distractorsSet.add((an + d).toString());
  distractorsSet.add((an - d).toString());
  distractorsSet.delete(answerStr);

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([answerStr, ...distractors]);

  return {
    id: getUniqueId('seq-arith'),
    topicId: 'sequences',
    subtopicId: 'arithmetic-sequence',
    unit: '08. 수열과 규칙',
    title: '등차수열의 일반항 (a_n = a₁ + (n-1)d)',
    difficulty,
    questionText,
    questionLatex,
    correctAnswer: answerStr,
    answerDisplayLatex,
    distractors,
    choices,
    steps,
    hints: [
      '제 n항은 첫째항에 공차를 (n - 1)번 더한 것입니다.',
      'a_n = a₁ + (n - 1) × d'
    ],
    conceptSummary: '등차수열은 연속된 두 항의 차이가 일정한 수열로, 규칙적인 증가 패턴을 수학적으로 모델링합니다.'
  };
}
