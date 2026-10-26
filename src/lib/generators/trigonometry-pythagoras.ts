import { Problem, ProblemStep, Difficulty } from './types';
import { getRandomInt, shuffleArray, getUniqueId } from './math-utils';

export function generatePythagoreanTheorem(difficulty: Difficulty = 'medium'): Problem {
  // Triples: [a, b, c]
  const triples = [
    [3, 4, 5],
    [5, 12, 13],
    [6, 8, 10],
    [8, 15, 17],
    [7, 24, 25],
    [9, 12, 15]
  ];
  const choice = triples[getRandomInt(0, triples.length - 1)];
  const a = choice[0];
  const b = choice[1];
  const c = choice[2]; // hypotenuse

  // Ask for hypotenuse c (or side b)
  const askHypotenuse = getRandomInt(0, 1) === 1;

  if (askHypotenuse) {
    const questionText = `직각삼각형의 두 직교 변의 길이가 a = ${a}, b = ${b} 일 때, 빗변의 길이 c를 구하세요.`;
    const questionLatex = `a = ${a}, \\quad b = ${b}, \\quad c = ?`;
    const answerStr = `${c}`;
    const answerDisplayLatex = `c = ${c}`;

    const steps: ProblemStep[] = [
      {
        stepNumber: 1,
        title: '피타고라스 정리 적용',
        explanation: '직각삼각형에서 빗변의 제곱은 나머지 두 변의 제곱의 합과 같습니다: c² = a² + b²',
        mathLatex: `c^2 = a^2 + b^2 = ${a}^2 + ${b}^2`
      },
      {
        stepNumber: 2,
        title: '제곱의 합 계산',
        explanation: `각 변을 제곱하여 더합니다.`,
        mathLatex: `c^2 = ${a * a} + ${b * b} = ${c * c}`
      },
      {
        stepNumber: 3,
        title: '제곱근을 취하여 빗변 구하기',
        explanation: '길이는 항상 양수이므로 양의 제곱근을 취합니다.',
        mathLatex: `c = \\sqrt{${c * c}} = ${c}`
      }
    ];

    const distractors = shuffleArray([
      (c + 1).toString(),
      (c - 1).toString(),
      (a + b).toString(), // common mistake: a + b
    ]);

    return {
      id: getUniqueId('pyth'),
      topicId: 'geometry',
      subtopicId: 'pythagoras',
      unit: '기하와 삼각비',
      title: '피타고라스 정리 (c² = a² + b²)',
      difficulty,
      questionText,
      questionLatex,
      correctAnswer: answerStr,
      answerDisplayLatex,
      distractors,
      choices: shuffleArray([answerStr, ...distractors]),
      steps,
      hints: [
        '직각삼각형의 가장 긴 빗변 c는 c = √(a² + b²) 입니다.',
        `${a}² = ${a * a}, ${b}² = ${b * b}의 합을 구하세요.`
      ],
      conceptSummary: '직각삼각형의 세 변의 길이는 c² = a² + b² (피타고라스 정리) 관계를 만족합니다.'
    };
  } else {
    const questionText = `직각삼각형에서 한 변의 길이가 a = ${a} 이고 빗변의 길이가 c = ${c} 일 때, 나머지 한 변 b의 길이를 구하세요.`;
    const questionLatex = `a = ${a}, \\quad c = ${c}, \\quad b = ?`;
    const answerStr = `${b}`;
    const answerDisplayLatex = `b = ${b}`;

    const steps: ProblemStep[] = [
      {
        stepNumber: 1,
        title: '피타고라스 정리 변형',
        explanation: '빗변 c와 밑변 a가 주어졌을 때 높이 b는: b² = c² - a²',
        mathLatex: `b^2 = c^2 - a^2 = ${c}^2 - ${a}^2`
      },
      {
        stepNumber: 2,
        title: '제곱의 차 계산',
        explanation: `빗변의 제곱에서 한 변의 제곱을 뺍니다.`,
        mathLatex: `b^2 = ${c * c} - ${a * a} = ${b * b}`
      },
      {
        stepNumber: 3,
        title: '제곱근 구하기',
        explanation: '양의 제곱근을 취해 b를 구합니다.',
        mathLatex: `b = \\sqrt{${b * b}} = ${b}`
      }
    ];

    const distractors = shuffleArray([
      (b + 2).toString(),
      (b - 2).toString(),
      (c - a).toString(),
    ]);

    return {
      id: getUniqueId('pyth-leg'),
      topicId: 'geometry',
      subtopicId: 'pythagoras',
      unit: '기하와 삼각비',
      title: '피타고라스 정리 변의 길이 구하기',
      difficulty,
      questionText,
      questionLatex,
      correctAnswer: answerStr,
      answerDisplayLatex,
      distractors,
      choices: shuffleArray([answerStr, ...distractors]),
      steps,
      hints: [
        '빗변이 아닌 변을 구할 때는 빗변의 제곱에서 뺍니다: b² = c² - a²',
      ],
      conceptSummary: '빗변의 제곱에서 다른 변의 제곱을 뺀 값의 제곱근이 구하고자 하는 변의 길이입니다.'
    };
  }
}

export function generateSpecialTrigValues(difficulty: Difficulty = 'medium'): Problem {
  // Angles: 30, 45, 60
  const questions = [
    { fn: '\\sin', angle: '30^\\circ', ans: '1/2', latexAns: '\\frac{1}{2}', dist: ['\\sqrt{3}/2', '1', '\\sqrt{2}/2'] },
    { fn: '\\cos', angle: '60^\\circ', ans: '1/2', latexAns: '\\frac{1}{2}', dist: ['\\sqrt{3}/2', '0', '\\sqrt{2}/2'] },
    { fn: '\\sin', angle: '45^\\circ', ans: '\\sqrt{2}/2', latexAns: '\\frac{\\sqrt{2}}{2}', dist: ['1/2', '1', '\\sqrt{3}/2'] },
    { fn: '\\cos', angle: '45^\\circ', ans: '\\sqrt{2}/2', latexAns: '\\frac{\\sqrt{2}}{2}', dist: ['1/2', '0', '\\sqrt{3}/2'] },
    { fn: '\\sin', angle: '60^\\circ', ans: '\\sqrt{3}/2', latexAns: '\\frac{\\sqrt{3}}{2}', dist: ['1/2', '1', '\\sqrt{2}/2'] },
    { fn: '\\cos', angle: '30^\\circ', ans: '\\sqrt{3}/2', latexAns: '\\frac{\\sqrt{3}}{2}', dist: ['1/2', '1', '\\sqrt{2}/2'] },
    { fn: '\\tan', angle: '45^\\circ', ans: '1', latexAns: '1', dist: ['\\sqrt{3}', '1/\\sqrt{3}', '0'] },
    { fn: '\\tan', angle: '60^\\circ', ans: '\\sqrt{3}', latexAns: '\\sqrt{3}', dist: ['1', '1/\\sqrt{3}', '2'] },
  ];

  const item = questions[getRandomInt(0, questions.length - 1)];
  const questionLatex = `${item.fn}(${item.angle})`;
  const answerStr = item.ans;
  const answerDisplayLatex = item.latexAns;

  const steps: ProblemStep[] = [
    {
      stepNumber: 1,
      title: '특수각 직각삼각형 비례 확인',
      explanation: '30°-60°-90° 삼각형의 변의 비는 1 : √3 : 2 이며, 45°-45°-90° 삼각형의 변의 비는 1 : 1 : √2 입니다.',
      mathLatex: `1 : \\sqrt{3} : 2 \\quad \\text{또는} \\quad 1 : 1 : \\sqrt{2}`
    },
    {
      stepNumber: 2,
      title: '삼각비의 정의 적용',
      explanation: 'sin = 높이/빗변, cos = 밑변/빗변, tan = 높이/밑변 정의에 대입하여 삼각비를 도출합니다.',
      mathLatex: `${questionLatex} = ${item.latexAns}`
    }
  ];

  const choices = shuffleArray([answerStr, ...item.dist]);

  return {
    id: getUniqueId('trig-val'),
    topicId: 'trigonometry',
    subtopicId: 'special-angles',
    unit: '기하와 삼각비',
    title: '특수각의 삼각비 (sin, cos, tan)',
    difficulty,
    questionText: `다음 특수각의 삼각비 값을 구하세요.`,
    questionLatex,
    correctAnswer: answerStr,
    answerDisplayLatex,
    distractors: item.dist,
    choices,
    steps,
    hints: [
      '30°, 45°, 60°의 삼각비는 직각삼각형의 변의 길이 비율로 바로 기억합니다.',
      'sin(30°) = cos(60°) = 1/2'
    ],
    conceptSummary: '특수각(30°, 45°, 60°)의 삼각비는 주기함수와 기하학, 물리학 전반의 기본 상수처럼 사용됩니다.'
  };
}
