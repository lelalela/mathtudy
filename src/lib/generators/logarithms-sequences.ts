import { Problem, ProblemStep, Difficulty } from './types';
import { getRandomInt, shuffleArray, getUniqueId } from './math-utils';

export function generateLogarithmBasic(difficulty: Difficulty = 'medium'): Problem {
  // log_base(arg) = ans
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
      title: '로그의 정의 확인',
      explanation: 'log_a(b) = x 는 "밑 a를 몇 제곱(x)해야 진수 b가 되는가?"(a^x = b)를 묻는 연산입니다.',
      mathLatex: `\\log_{a}(b) = x \\iff a^x = b`
    },
    {
      stepNumber: 2,
      title: '진수를 거듭제곱 형태로 표현',
      explanation: `진수 ${arg}를 밑 ${base}의 거듭제곱으로 나타냅니다.`,
      mathLatex: `${arg} = ${base}^{${ans}}`
    },
    {
      stepNumber: 3,
      title: '로그의 기본 성질 적용',
      explanation: 'log_a(a^k) = k 성질에 따라 지수 값을 답으로 취합니다.',
      mathLatex: `\\log_{${base}}(${base}^{${ans}}) = ${ans}`
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
    unit: '지수와 로그',
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
  // a_n = a_1 + (n - 1) * d
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
      title: '등차수열의 일반항 공식 확인',
      explanation: '첫째항 a₁과 공차 d인 등차수열의 제 n항은: a_n = a₁ + (n - 1)d 입니다.',
      mathLatex: `a_n = a_1 + (n - 1)d`
    },
    {
      stepNumber: 2,
      title: '주어진 값 대입',
      explanation: `a₁ = ${a1}, d = ${d}, n = ${n} 을 공식에 대입합니다.`,
      mathLatex: `a_{${n}} = ${a1} + (${n} - 1) \\times ${d}`
    },
    {
      stepNumber: 3,
      title: '곱셈 및 덧셈 계산',
      explanation: '계산하여 제 n항의 값을 구합니다.',
      mathLatex: `a_{${n}} = ${a1} + ${n - 1} \\times ${d} = ${a1} + ${(n - 1) * d} = ${an}`
    }
  ];

  const distractorsSet = new Set<string>();
  distractorsSet.add((a1 + n * d).toString()); // forgot (n - 1)
  distractorsSet.add((an + d).toString());
  distractorsSet.add((an - d).toString());
  distractorsSet.delete(answerStr);

  const distractors = Array.from(distractorsSet).slice(0, 3);
  const choices = shuffleArray([answerStr, ...distractors]);

  return {
    id: getUniqueId('seq-arith'),
    topicId: 'sequences',
    subtopicId: 'arithmetic-sequence',
    unit: '수열과 규칙',
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
