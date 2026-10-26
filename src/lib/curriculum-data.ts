export interface TopicConcept {
  id: string;
  unit: string;
  title: string;
  subtitle: string;
  order: number;
  estimatedMinutes: number;
  generatorId: string;
  hasInteractiveGraph?: boolean;
  graphType?: 'linear' | 'quadratic';
  summary: string;
  keyPoints: {
    title: string;
    description: string;
    formulaLatex?: string;
  }[];
  examples: {
    question: string;
    questionLatex: string;
    solutionSteps: string[];
    answerLatex: string;
  }[];
}

export const CURRICULUM_TOPICS: TopicConcept[] = [
  {
    id: 'fractions',
    unit: '01. 기초 산수',
    title: '분수의 덧셈과 통분',
    subtitle: '분모가 다른 분수의 사칙연산을 완벽히 정복하기',
    order: 1,
    estimatedMinutes: 10,
    generatorId: 'fractions',
    summary: '분모가 서로 다른 두 분수는 기준 단위가 다르므로 그대로 더할 수 없습니다. 따라서 두 분모의 공통배수로 분모를 같게 만드는 "통분"을 거친 후 분자끼리 연산합니다.',
    keyPoints: [
      {
        title: '통분(Finding Common Denominator)',
        description: '두 분모의 최소공배수 또는 곱을 공통분모로 삼고, 분자에도 동일한 배수를 곱해 크기가 같은 분수를 만듭니다.',
        formulaLatex: '\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}',
      },
      {
        title: '약분과 기약분수',
        description: '연산 결과 나온 분수의 분자와 분모를 최대공약수(GCD)로 나누어 더 이상 나눌 수 없는 기약분수로 표현합니다.',
        formulaLatex: '\\frac{k \\cdot p}{k \\cdot q} = \\frac{p}{q}',
      },
    ],
    examples: [
      {
        question: '2/3 와 1/4 의 합을 구하세요.',
        questionLatex: '\\frac{2}{3} + \\frac{1}{4}',
        solutionSteps: [
          '3과 4의 최소공배수는 12입니다.',
          '2/3의 분모와 분자에 4를 곱하면 8/12가 됩니다.',
          '1/4의 분모와 분자에 3을 곱하면 3/12가 됩니다.',
          '분자끼리 더합니다: (8 + 3) / 12 = 11/12',
        ],
        answerLatex: '\\frac{11}{12}',
      },
    ],
  },
  {
    id: 'operations-order',
    unit: '01. 기초 산수',
    title: '사칙연산 우선순위',
    subtitle: '괄호와 곱셈/나눗셈, 덧셈/뺄셈의 엄격한 연산 법칙',
    order: 2,
    estimatedMinutes: 8,
    generatorId: 'operations-order',
    summary: '수학의 식은 단순히 왼쪽에서 오른쪽으로 읽는 것이 아니라, 정의된 연산자 결합 우선순위(PEMDAS)에 따라 단계적으로 계산해야 유일한 진리값을 얻습니다.',
    keyPoints: [
      {
        title: '연산 순서 원칙',
        description: '1) 소괄호 () → 중괄호 {} → 대괄호 [] 순\n2) 거듭제곱(지수)\n3) 곱셈(×)과 나눗셈(÷) (동등 우선순위, 왼쪽부터)\n4) 덧셈(+)과 뺄셈(-) (동등 우선순위, 왼쪽부터)',
        formulaLatex: 'a + b \\times c \\neq (a + b) \\times c',
      },
    ],
    examples: [
      {
        question: '다음 식의 값을 구하세요.',
        questionLatex: '3 + 4 \\times (6 - 2)',
        solutionSteps: [
          '괄호 안 (6 - 2) = 4 를 먼저 계산합니다.',
          '곱셈 4 × 4 = 16 을 계산합니다.',
          '마지막 덧셈 3 + 16 = 19 를 구합니다.',
        ],
        answerLatex: '19',
      },
    ],
  },
  {
    id: 'negative-numbers',
    unit: '02. 정수와 유리수',
    title: '음수의 연산과 부호 규칙',
    subtitle: '수직선 위의 반대 방향, 마이너스 부호의 완벽한 이해',
    order: 3,
    estimatedMinutes: 12,
    generatorId: 'negative-numbers',
    summary: '음수는 0을 기준으로 양수와 반대 방향에 있는 수입니다. 음수를 뺀다는 것은 "반대의 반대"이므로 결국 양수를 더하는 것과 동일한 효과를 냅니다.',
    keyPoints: [
      {
        title: '부호 곱셈/나눗셈 규칙',
        description: '같은 부호끼리의 곱은 양수(+), 다른 부호끼리의 곱은 음수(-)가 됩니다.',
        formulaLatex: '(-) \\times (-) = (+), \\quad (-) \\times (+) = (-)',
      },
      {
        title: '음수의 뺄셈',
        description: '어떤 수에서 음수를 빼는 것은 그 수의 절댓값을 더하는 것과 같습니다.',
        formulaLatex: 'a - (-b) = a + b',
      },
    ],
    examples: [
      {
        question: '다음 식의 값을 구하세요.',
        questionLatex: '(-5) \\times (-3) - (-4)',
        solutionSteps: [
          '곱셈 먼저: (-5) × (-3) = +15',
          '뺄셈 변환: 15 - (-4) = 15 + 4 = 19',
        ],
        answerLatex: '19',
      },
    ],
  },
  {
    id: 'exponents',
    unit: '02. 정수와 유리수',
    title: '기초 지수법칙',
    subtitle: '거듭제곱의 곱셈, 나눗셈 및 거듭제곱의 성질',
    order: 4,
    estimatedMinutes: 10,
    generatorId: 'exponents',
    summary: '지수(Exponent)는 같은 수를 여러 번 곱한 횟수를 효율적으로 나타낸 것입니다. 밑이 같을 때 거듭제곱의 연산은 지수 간의 연산으로 단순화됩니다.',
    keyPoints: [
      {
        title: '지수의 곱셈과 거듭제곱 법칙',
        description: '밑이 같을 때 곱셈은 지수의 덧셈이 되며, 거듭제곱의 거듭제곱은 지수의 곱이 됩니다.',
        formulaLatex: 'a^m \\times a^n = a^{m+n}, \\quad (a^m)^n = a^{mn}',
      },
    ],
    examples: [
      {
        question: '식을 가장 간단한 거듭제곱으로 나타내세요.',
        questionLatex: '(x^3)^4 \\times x^2',
        solutionSteps: [
          '(x^3)^4 = x^(3 × 4) = x^12',
          'x^12 × x^2 = x^(12 + 2) = x^14',
        ],
        answerLatex: 'x^{14}',
      },
    ],
  },
  {
    id: 'linear-equations',
    unit: '03. 일차방정식',
    title: '일차방정식 기본 풀이',
    subtitle: '등식의 성질, 이항의 원리와 미지수 x 구하기',
    order: 5,
    estimatedMinutes: 15,
    generatorId: 'linear-equations',
    summary: '등호(=)의 양변에 같은 수를 더하거나, 빼거나, 곱하거나, 0이 아닌 수로 나누어도 등식은 항상 성립합니다. 이 성질을 이용해 미지수 항과 상수항을 분리합니다.',
    keyPoints: [
      {
        title: '이항(Transposition)의 원리',
        description: '한 변에 있는 항을 부호를 바꾸어 다른 변으로 옮기는 것을 이항이라 합니다.',
        formulaLatex: 'ax + b = c \\implies ax = c - b \\implies x = \\frac{c - b}{a}',
      },
    ],
    examples: [
      {
        question: '다음 일차방정식을 푸세요.',
        questionLatex: '3x - 7 = 11',
        solutionSteps: [
          '상수항 -7을 우변으로 이항: 3x = 11 + 7 = 18',
          '양변을 x의 계수인 3으로 나눔: x = 18 / 3 = 6',
          '검산: 3(6) - 7 = 18 - 7 = 11 (일치)',
        ],
        answerLatex: 'x = 6',
      },
    ],
  },
  {
    id: 'linear-functions-slope',
    unit: '04. 일차함수와 그래프',
    title: '직선의 기울기와 그래프',
    subtitle: '변화율(Rate of Change)의 기하학적 의미와 수식화',
    order: 6,
    estimatedMinutes: 15,
    generatorId: 'linear-functions-slope',
    hasInteractiveGraph: true,
    graphType: 'linear',
    summary: '함수는 입력값(x)에 따라 출력값(y)이 하나씩 대응하는 관계입니다. 일차함수 y = ax + b에서 a는 직선의 가파른 정도(기울기), b는 y축과 만나는 절편을 결정합니다.',
    keyPoints: [
      {
        title: '기울기 (Slope)',
        description: 'x가 1단위 증가할 때 y가 얼만큼 변하는지의 비율입니다.',
        formulaLatex: 'm = \\frac{\\Delta y}{\\Delta x} = \\frac{y_2 - y_1}{x_2 - x_1}',
      },
      {
        title: '일차함수의 표준형',
        description: 'y = mx + b 에서 m은 기울기, b는 y절편(0, b)입니다.',
        formulaLatex: 'y = mx + b',
      },
    ],
    examples: [
      {
        question: '두 점 (1, 2)와 (4, 8)을 지나는 직선의 기울기를 구하세요.',
        questionLatex: 'A(1, 2), \\quad B(4, 8)',
        solutionSteps: [
          'x의 증가량: Δx = 4 - 1 = 3',
          'y의 증가량: Δy = 8 - 2 = 6',
          '기울기 m = 6 / 3 = 2',
        ],
        answerLatex: 'm = 2',
      },
    ],
  },
  {
    id: 'quadratics-factoring',
    unit: '05. 이차방정식',
    title: '인수분해와 이차방정식',
    subtitle: '이차식의 분해와 영인자 성질(AB=0이면 A=0 또는 B=0)',
    order: 7,
    estimatedMinutes: 18,
    generatorId: 'quadratics-factoring',
    hasInteractiveGraph: true,
    graphType: 'quadratic',
    summary: '이차방정식은 최고차항의 차수가 2인 다항방정식입니다. 두 다항식의 곱이 0이 되는 성질(A · B = 0 ⇔ A=0 or B=0)을 활용하여 두 일차방정식으로 분해해 해를 구합니다.',
    keyPoints: [
      {
        title: '근과 계수의 관계(합과 곱)',
        description: 'x² + bx + c = 0 에서 두 근의 합은 -b, 두 근의 곱은 c가 됩니다.',
        formulaLatex: 'x^2 - (\\alpha + \\beta)x + \\alpha\\beta = (x - \\alpha)(x - \\beta) = 0',
      },
    ],
    examples: [
      {
        question: '이차방정식을 인수분해하여 푸세요.',
        questionLatex: 'x^2 - 5x + 6 = 0',
        solutionSteps: [
          '합이 -5이고 곱이 6인 두 정수는 -2와 -3입니다.',
          '인수분해: (x - 2)(x - 3) = 0',
          '따라서 x = 2 또는 x = 3 입니다.',
        ],
        answerLatex: 'x = 2 \\quad \\text{또는} \\quad x = 3',
      },
    ],
  },
];
