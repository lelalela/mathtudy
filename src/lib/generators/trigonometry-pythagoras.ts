import { Problem, ProblemStep, Difficulty } from './types';
import { getRandomInt, shuffleArray, getUniqueId } from './math-utils';

export function generatePythagoreanTheorem(difficulty: Difficulty = 'medium'): Problem {
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
  const c = choice[2];

  const askHypotenuse = getRandomInt(0, 1) === 1;

  if (askHypotenuse) {
    const questionText = `직각삼각형의 두 직교 변의 길이가 a = ${a}, b = ${b} 일 때, 빗변의 길이 c를 구하세요.`;
    const questionLatex = `a = ${a}, \\quad b = ${b}, \\quad c = ?`;
    const answerStr = `${c}`;
    const answerDisplayLatex = `c = ${c}`;

    const steps: ProblemStep[] = [
      {
        stepNumber: 1,
        title: '피타고라스 정리 공식 적용하기',
        explanation: `직각삼각형에서 직각을 낀 두 변의 제곱의 합은 가장 긴 빗변의 제곱과 같습니다: c² = a² + b² = ${a}² + ${b}².`,
        why: '직각삼각형의 각 변을 한 변으로 하는 정사각형을 그리면, 두 작은 정사각형 면적의 합이 가장 큰 빗변 위 정사각형 면적과 정확히 일치한다는 기하학적 원리입니다.',
        mathLatex: `c^2 = a^2 + b^2 = ${a}^2 + ${b}^2`,
        pitfall: '변의 길이를 그냥 더해서 c = ${a} + ${b} = ${a + b} 로 계산하지 않도록 절대 주의하세요! 반드시 각 변을 먼저 "제곱"해야 합니다.'
      },
      {
        stepNumber: 2,
        title: '각 변의 제곱 계산 및 합산',
        explanation: `${a}의 제곱(${a * a})과 ${b}의 제곱(${b * b})을 계산하여 더하면 c² = ${c * c}가 됩니다.`,
        why: '빗변의 길이를 제곱한 면적(c²)을 먼저 확정합니다.',
        mathLatex: `c^2 = ${a * a} + ${b * b} = ${c * c}`,
        pitfall: '단순 제곱 계산(예: ${a} × ${a})에서 구구단 실수가 없는지 점검하세요.'
      },
      {
        stepNumber: 3,
        title: '제곱근을 취하여 빗변 c 구하기',
        explanation: `c² = ${c * c} 이므로, 양변에 루트를 씌워 빗변 c = √${c * c} = ${c}를 구합니다.`,
        why: '도형의 길이는 음수가 될 수 없으므로(c > 0), 양의 제곱근만을 취합니다.',
        mathLatex: `c = \\sqrt{${c * c}} = ${c}`,
        pitfall: '제곱근(루트)을 씌우지 않고 c² 값인 ${c * c}를 그대로 정답으로 적는 실수를 조심하세요.'
      }
    ];

    const distractors = shuffleArray([
      (c + 1).toString(),
      (c - 1).toString(),
      (a + b).toString(),
    ]);

    return {
      id: getUniqueId('pyth'),
      topicId: 'geometry',
      subtopicId: 'pythagoras',
      unit: '07. 기하와 삼각비',
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
        title: '피타고라스 정리 변형 공식 확인',
        explanation: `빗변 c가 주어지고 다른 변 b를 구할 때는 빗변의 제곱에서 나머지 한 변의 제곱을 뺍니다: b² = c² - a² = ${c}² - ${a}².`,
        why: 'c² = a² + b² 식에서 b²만 남기고 a²을 이항하면 b² = c² - a²이 됩니다. 가장 긴 빗변에서 빼야 양수가 나옵니다.',
        mathLatex: `b^2 = c^2 - a^2 = ${c}^2 - ${a}^2`,
        pitfall: '빗변이 주어졌는데도 무의식적으로 두 수를 더해서 c² + a²으로 계산하는 실수를 가장 조심해야 합니다!'
      },
      {
        stepNumber: 2,
        title: '제곱의 차 계산하기',
        explanation: `빗변의 제곱(${c * c})에서 한 변의 제곱(${a * a})을 뺍니다: ${c * c} - ${a * a} = ${b * b}.`,
        why: '남은 변 b의 제곱 면적을 확정합니다.',
        mathLatex: `b^2 = ${c * c} - ${a * a} = ${b * b}`,
        pitfall: '뺄셈 순서가 바뀌어 음수가 나오지 않도록 항상 빗변(가장 큰 수)에서 뺍니다.'
      },
      {
        stepNumber: 3,
        title: '제곱근으로 최종 변의 길이 구하기',
        explanation: `b² = ${b * b} 이므로 양의 제곱근을 취해 b = √${b * b} = ${b}를 구합니다.`,
        why: '길이는 0보다 커야 하므로(b > 0) 양의 제곱근만을 취합니다.',
        mathLatex: `b = \\sqrt{${b * b}} = ${b}`,
        pitfall: '마지막에 루트를 씌우는 것을 잊지 마세요.'
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
      unit: '07. 기하와 삼각비',
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
      title: '특수각 직각삼각형의 변의 길이 비율 확인',
      explanation: '30°-60°-90° 삼각형은 변의 길이 비가 1 : √3 : 2 (빗변=2)이며, 45°-45°-90° 삼각형은 1 : 1 : √2 (빗변=√2) 입니다.',
      why: '정삼각형을 수직으로 반 쪼개면 30°-60°-90°가 되고, 정사각형을 대각선으로 반 쪼개면 45°-45°-90°가 됩니다. 대칭 도형에서 바로 나온 비율이라 항상 일정합니다.',
      mathLatex: `30^\\circ\\text{-}60^\\circ\\text{-}90^\\circ \\implies 1 : \\sqrt{3} : 2, \\quad 45^\\circ\\text{-}45^\\circ\\text{-}90^\\circ \\implies 1 : 1 : \\sqrt{2}`,
      pitfall: '가장 긴 변(빗변)이 2 또는 √2이고, 30°와 마주보는 가장 짧은 대변이 1이라는 위치 관계를 정확히 파악해야 합니다.'
    },
    {
      stepNumber: 2,
      title: '삼각비 정의에 따른 값 도출',
      explanation: `sin은 [높이/빗변], cos은 [밑변/빗변], tan은 [높이/밑변]입니다. 해당 각도에 대응하는 변의 비율을 적용하면 ${questionLatex} = ${item.latexAns} 가 됩니다.`,
      why: '기준각에 따라 마주보는 변이 "높이", 이웃한 변이 "밑변", 마주보는 가장 긴 빗변이 기준이 됩니다.',
      mathLatex: `${questionLatex} = ${item.latexAns}`,
      pitfall: 'sin과 cos의 30°와 60° 값을 뒤바꿔 외우는 실수를 주의하세요! sin은 각도가 0°에서 90°로 갈수록 커지고(0 → 1), cos은 작아집니다(1 → 0).'
    }
  ];

  const choices = shuffleArray([answerStr, ...item.dist]);

  return {
    id: getUniqueId('trig-val'),
    topicId: 'trigonometry',
    subtopicId: 'special-angles',
    unit: '07. 기하와 삼각비',
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
    conceptSummary: '특수각(30°, 45°, 60°)의 삼각비는 직각삼각형의 고유한 변의 길이 비율(1:√3:2, 1:1:√2)에 기반합니다.'
  };
}
