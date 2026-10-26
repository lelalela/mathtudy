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
  // 01. 기초 산수
  {
    id: 'fractions',
    unit: '01. 기초 산수 (초등 5~6학년)',
    title: '분수의 덧셈과 통분',
    subtitle: '분모가 다른 분수의 사칙연산을 완벽히 정복하기',
    order: 1,
    estimatedMinutes: 10,
    generatorId: 'fractions',
    summary: '분모가 서로 다른 두 분수는 기준 단위가 다르므로 그대로 더할 수 없습니다. 따라서 두 분모의 공통배수로 분모를 같게 만드는 "통분"을 거친 후 분자끼리 연산합니다.',
    keyPoints: [
      {
        title: '통분(Finding Common Denominator)',
        description: '두 분모의 공배수로 통분하고 분자에도 동일한 배수를 곱해 크기가 같은 분수를 만듭니다.',
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
          '2/3 = 8/12,  1/4 = 3/12 로 통분합니다.',
          '분자끼리 더합니다: (8 + 3) / 12 = 11/12',
        ],
        answerLatex: '\\frac{11}{12}',
      },
    ],
  },
  {
    id: 'operations-order',
    unit: '01. 기초 산수 (초등 5~6학년)',
    title: '사칙연산 우선순위',
    subtitle: '괄호와 곱셈/나눗셈, 덧셈/뺄셈의 엄격한 연산 법칙',
    order: 2,
    estimatedMinutes: 8,
    generatorId: 'operations-order',
    summary: '수학의 식은 단순히 왼쪽에서 오른쪽으로 읽는 것이 아니라, 정의된 연산자 결합 우선순위(PEMDAS)에 따라 단계적으로 계산해야 유일한 진리값을 얻습니다.',
    keyPoints: [
      {
        title: '연산 순서 원칙',
        description: '1) 괄호 () → 2) 거듭제곱(지수) → 3) 곱셈(×)과 나눗셈(÷) → 4) 덧셈(+)과 뺄셈(-)',
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

  // 02. 정수와 유리수
  {
    id: 'negative-numbers',
    unit: '02. 정수와 유리수 (중학교 1~2학년)',
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
    unit: '02. 정수와 유리수 (중학교 1~2학년)',
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

  // 03. 일차방정식과 연립방정식
  {
    id: 'linear-equations',
    unit: '03. 일차방정식과 연립방정식 (중학교 1~2학년)',
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
          '양변을 3으로 나눔: x = 18 / 3 = 6',
        ],
        answerLatex: 'x = 6',
      },
    ],
  },
  {
    id: 'systems-equations',
    unit: '03. 일차방정식과 연립방정식 (중학교 1~2학년)',
    title: '연립일차방정식과 소거법',
    subtitle: '미지수 2개인 식에서 가감법과 대입법으로 해 도출하기',
    order: 6,
    estimatedMinutes: 15,
    generatorId: 'systems-equations',
    summary: '두 개 이상의 미지수가 얽혀 있는 연립방정식은 한 미지수의 계수를 일치시켜 두 식을 더하거나 빼는(가감법) 방식으로 미지수를 하나씩 소거하여 풉니다.',
    keyPoints: [
      {
        title: '가감법의 원리',
        description: '두 식의 한 미지수 계수의 절댓값을 같게 만든 뒤, 부호가 같으면 빼고 부호가 다르면 더하여 한 문자를 제거합니다.',
        formulaLatex: '\\begin{cases} a_1 x + b_1 y = c_1 \\\\ a_2 x + b_2 y = c_2 \\end{cases}',
      },
    ],
    examples: [
      {
        question: '다음 연립방정식을 푸세요.',
        questionLatex: '\\begin{cases} x + y = 5 \\\\ 2x - y = 4 \\end{cases}',
        solutionSteps: [
          '두 식을 더해 y를 소거합니다: 3x = 9 ⟹ x = 3',
          '첫 식에 x = 3을 대입합니다: 3 + y = 5 ⟹ y = 2',
        ],
        answerLatex: 'x = 3, \\; y = 2',
      },
    ],
  },

  // 04. 일차함수와 기하
  {
    id: 'linear-functions-slope',
    unit: '04. 일차함수와 기하 (중학교 2~3학년)',
    title: '직선의 기울기와 그래프',
    subtitle: '변화율(Rate of Change)의 기하학적 의미와 수식화',
    order: 7,
    estimatedMinutes: 15,
    generatorId: 'linear-functions-slope',
    hasInteractiveGraph: true,
    graphType: 'linear',
    summary: '일차함수 y = ax + b에서 a는 직선의 기울기(Slope)로, x가 1단위 증가할 때 y가 얼마나 변화하는지를 결정하며 b는 y축과 만나는 절편입니다.',
    keyPoints: [
      {
        title: '기울기 공식',
        description: '두 점 사이 x의 증가량에 대한 y의 증가량 비율입니다.',
        formulaLatex: 'm = \\frac{\\Delta y}{\\Delta x} = \\frac{y_2 - y_1}{x_2 - x_1}',
      },
    ],
    examples: [
      {
        question: '두 점 (1, 2)와 (4, 8)을 지나는 직선의 기울기를 구하세요.',
        questionLatex: 'A(1, 2), \\quad B(4, 8)',
        solutionSteps: [
          'Δx = 4 - 1 = 3,  Δy = 8 - 2 = 6',
          '기울기 m = 6 / 3 = 2',
        ],
        answerLatex: 'm = 2',
      },
    ],
  },
  {
    id: 'pythagoras',
    unit: '04. 일차함수와 기하 (중학교 2~3학년)',
    title: '피타고라스 정리',
    subtitle: '직각삼각형의 세 변의 제곱 관계와 거리 공식의 기초',
    order: 8,
    estimatedMinutes: 12,
    generatorId: 'pythagoras',
    summary: '직각삼각형에서 빗변의 길이를 c, 나머지 두 직교 변의 길이를 a, b라 할 때, 빗변의 제곱은 두 변의 제곱의 합과 항상 일치합니다.',
    keyPoints: [
      {
        title: '피타고라스 공식',
        description: '좌표평면 위 두 점 사이의 거리를 계산하는 공식(Euclidean Distance)의 근간이 됩니다.',
        formulaLatex: 'a^2 + b^2 = c^2 \\iff c = \\sqrt{a^2 + b^2}',
      },
    ],
    examples: [
      {
        question: '직교 변이 a = 3, b = 4 일 때 빗변 c를 구하세요.',
        questionLatex: 'c^2 = 3^2 + 4^2',
        solutionSteps: [
          '3² + 4² = 9 + 16 = 25',
          'c = √25 = 5',
        ],
        answerLatex: 'c = 5',
      },
    ],
  },

  // 05. 이차방정식과 고등 대수
  {
    id: 'quadratics-factoring',
    unit: '05. 이차방정식과 고등 대수 (중3~고1)',
    title: '인수분해와 이차방정식',
    subtitle: '이차식의 분해와 영인자 성질(AB=0이면 A=0 또는 B=0)',
    order: 9,
    estimatedMinutes: 18,
    generatorId: 'quadratics-factoring',
    hasInteractiveGraph: true,
    graphType: 'quadratic',
    summary: '이차방정식은 최고차항의 차수가 2인 다항방정식입니다. 두 일차식의 곱(A · B = 0)으로 분해하여 해를 구합니다.',
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
          '(x - 2)(x - 3) = 0 이므로 x = 2 또는 x = 3 입니다.',
        ],
        answerLatex: 'x = 2, \\; 3',
      },
    ],
  },
  {
    id: 'quadratic-discriminant',
    unit: '05. 이차방정식과 고등 대수 (중3~고1)',
    title: '판별식과 근의 판정',
    subtitle: 'D = b² - 4ac 로 실근과 허근의 개수를 단숨에 판별하기',
    order: 10,
    estimatedMinutes: 15,
    generatorId: 'quadratic-discriminant',
    summary: '근의 공식의 루트 내부 식인 D = b² - 4ac 의 부호를 조사하면, 직접 해를 구하지 않고도 그래프가 x축과 몇 번 만나는지, 실근인지 허근인지를 판별할 수 있습니다.',
    keyPoints: [
      {
        title: '판별식의 성질',
        description: 'D > 0: 서로 다른 두 실근 (그래프가 x축과 2점 교차)\nD = 0: 중근 (x축에 접함)\nD < 0: 서로 다른 두 허근 (x축과 만나지 않음)',
        formulaLatex: 'D = b^2 - 4ac',
      },
    ],
    examples: [
      {
        question: 'x² - 4x + 4 = 0 의 판별식을 구하세요.',
        questionLatex: 'D = (-4)^2 - 4(1)(4)',
        solutionSteps: [
          'D = 16 - 16 = 0',
          'D = 0 이므로 중근을 갖습니다.',
        ],
        answerLatex: 'D = 0',
      },
    ],
  },

  // 06. 삼각함수와 로그
  {
    id: 'special-angles',
    unit: '06. 삼각함수와 로그 (고등학교 2학년 / 수학 I)',
    title: '특수각의 삼각비',
    subtitle: '30°, 45°, 60°의 직각삼각형 변의 비와 삼각함수 기초',
    order: 11,
    estimatedMinutes: 15,
    generatorId: 'special-angles',
    summary: '각도가 30°, 45°, 60°인 삼각형은 변의 길이 비율이 고정되어 있습니다. 이 비율은 회전과 파동, 주기 현상을 다루는 삼각함수의 기본 척도가 됩니다.',
    keyPoints: [
      {
        title: '특수각 삼각비 요약',
        description: 'sin(30°) = 1/2,  sin(45°) = √2/2,  sin(60°) = √3/2\ncos(30°) = √3/2, cos(45°) = √2/2, cos(60°) = 1/2\ntan(45°) = 1',
        formulaLatex: '\\sin^2 \\theta + \\cos^2 \\theta = 1',
      },
    ],
    examples: [
      {
        question: 'sin(30°) + cos(60°) 값을 구하세요.',
        questionLatex: '\\sin(30^\\circ) + \\cos(60^\\circ)',
        solutionSteps: [
          'sin(30°) = 1/2,  cos(60°) = 1/2',
          '1/2 + 1/2 = 1',
        ],
        answerLatex: '1',
      },
    ],
  },
  {
    id: 'log-basic',
    unit: '06. 삼각함수와 로그 (고등학교 2학년 / 수학 I)',
    title: '로그의 정의와 성질',
    subtitle: '지수의 역연산, 거대한 수치를 다루는 지진/소음 스케일의 원리',
    order: 12,
    estimatedMinutes: 15,
    generatorId: 'log-basic',
    summary: '로그(Logarithm)는 "밑을 몇 제곱해야 진수가 나오는가?"를 표현하는 연산입니다. 곱셈을 덧셈으로 변환해 주는 강력한 성질을 가지고 있습니다.',
    keyPoints: [
      {
        title: '로그의 기본 공식',
        description: 'log_a(x · y) = log_a(x) + log_a(y)\nlog_a(x^k) = k · log_a(x)',
        formulaLatex: '\\log_a(b) = c \\iff a^c = b',
      },
    ],
    examples: [
      {
        question: 'log₂(16) 의 값을 구하세요.',
        questionLatex: '\\log_2(16)',
        solutionSteps: [
          '16 = 2⁴ 이므로 2를 4제곱하면 16이 됩니다.',
          '따라서 log₂(2⁴) = 4 입니다.',
        ],
        answerLatex: '4',
      },
    ],
  },
  {
    id: 'arithmetic-sequence',
    unit: '06. 삼각함수와 로그 (고등학교 2학년 / 수학 I)',
    title: '등차수열과 일반항',
    subtitle: '규칙적인 증가 패턴 모델링과 n번째 항 도출',
    order: 13,
    estimatedMinutes: 14,
    generatorId: 'arithmetic-sequence',
    summary: '수열은 일정한 규칙에 따라 나열된 수의 열입니다. 연속된 두 항의 차이(공차 d)가 일정한 등차수열의 일반항은 첫째항에 공차를 누적하여 구합니다.',
    keyPoints: [
      {
        title: '등차수열 일반항 공식',
        description: '제 n항은 첫째항 a₁에 공차 d를 (n - 1)번 더한 것입니다.',
        formulaLatex: 'a_n = a_1 + (n - 1)d',
      },
    ],
    examples: [
      {
        question: '첫째항 3, 공차 4인 등차수열의 10번째 항을 구하세요.',
        questionLatex: 'a_1 = 3, \\; d = 4, \\; a_{10} = ?',
        solutionSteps: [
          'a₁₀ = 3 + (10 - 1) × 4',
          'a₁₀ = 3 + 36 = 39',
        ],
        answerLatex: '39',
      },
    ],
  },

  // 07. 미적분학 기초
  {
    id: 'derivatives',
    unit: '07. 미적분학 기초 (고등학교 2~3학년 / 수학 II)',
    title: '도함수와 거듭제곱 미분법',
    subtitle: '순간변화율(Instantaneous Rate of Change)과 접선의 기울기',
    order: 14,
    estimatedMinutes: 18,
    generatorId: 'derivatives',
    summary: '미분은 곡선 위의 한 점에서 함수가 얼마나 급격하게 변하는지(순간변화율)를 나타내는 도함수 f\'(x)를 구하는 작업입니다. 기하학적으로는 접선의 기울기입니다.',
    keyPoints: [
      {
        title: '거듭제곱 미분 공식 (Power Rule)',
        description: '차수를 계수로 내리고 차수를 1 낮춥니다. 상수는 미분하면 0이 됩니다.',
        formulaLatex: '\\frac{d}{dx}[x^n] = n x^{n-1}, \\quad \\frac{d}{dx}[c] = 0',
      },
    ],
    examples: [
      {
        question: 'f(x) = 2x³ - 5x + 4 의 도함수를 구하세요.',
        questionLatex: 'f\'(x) = ?',
        solutionSteps: [
          '(2x³)\' = 2 × 3x² = 6x²',
          '(-5x)\' = -5,  (4)\' = 0',
          'f\'(x) = 6x² - 5',
        ],
        answerLatex: 'f\'(x) = 6x^2 - 5',
      },
    ],
  },
  {
    id: 'integrals',
    unit: '07. 미적분학 기초 (고등학교 2~3학년 / 수학 II)',
    title: '정적분과 기하학적 넓이',
    subtitle: '미적분학의 기본정리(FTC)와 무한 누적합의 면적화',
    order: 15,
    estimatedMinutes: 20,
    generatorId: 'integrals',
    summary: '적분은 미분의 역연산(부정적분)이자, 곡선 아래 면적을 무수히 잘게 쪼개어 합산하는 극한 연산(정적분)입니다. 미적분학의 기본정리를 통해 쉽게 계산할 수 있습니다.',
    keyPoints: [
      {
        title: '미적분학의 기본정리 (FTC)',
        description: '원시함수 F(x)를 구한 뒤 적분 구간의 상한 b를 대입한 값에서 하한 a를 대입한 값을 뺍니다.',
        formulaLatex: '\\int_a^b f(x) \\, dx = \\left[ F(x) \\right]_a^b = F(b) - F(a)',
      },
    ],
    examples: [
      {
        question: '정적분 ∫₀² 3x² dx 값을 구하세요.',
        questionLatex: '\\int_{0}^{2} 3x^2 \\, dx',
        solutionSteps: [
          '3x²의 부정적분은 x³ 입니다.',
          '[x³]₀² = 2³ - 0³ = 8 - 0 = 8',
        ],
        answerLatex: '8',
      },
    ],
  },

  // 08. 대학 / 성인 고급수학
  {
    id: 'matrix-determinant',
    unit: '08. 고급수학 (선형대수 & 다변수)',
    title: '2×2 행렬식 (Determinant)',
    subtitle: '선형변환 시 면적의 확대율과 역행렬의 존재 조건 (ad - bc)',
    order: 16,
    estimatedMinutes: 18,
    generatorId: 'matrix-determinant',
    summary: '행렬식(Determinant)은 정사각행렬에 하나의 실수를 대응시키는 함수로, 선형변환이 공간을 얼마나 확대/축소하는지, 역행렬(A⁻¹)이 존재하는지(det ≠ 0)를 판정합니다.',
    keyPoints: [
      {
        title: '2×2 행렬식 공식',
        description: '주대각선 성분의 곱에서 반대 대각선 성분의 곱을 뺍니다.',
        formulaLatex: '\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc',
      },
    ],
    examples: [
      {
        question: '행렬 [[3, 2], [1, 4]] 의 행렬식을 구하세요.',
        questionLatex: '\\det \\begin{pmatrix} 3 & 2 \\\\ 1 & 4 \\end{pmatrix}',
        solutionSteps: [
          '주대각선 곱: 3 × 4 = 12',
          '반대 대각선 곱: 2 × 1 = 2',
          '행렬식: 12 - 2 = 10',
        ],
        answerLatex: '10',
      },
    ],
  },
  {
    id: 'vector-dot-product',
    unit: '08. 고급수학 (선형대수 & 다변수)',
    title: '벡터의 내적 (Dot Product)',
    subtitle: '두 다차원 벡터의 유사도와 사영(Projection)의 기초',
    order: 17,
    estimatedMinutes: 16,
    generatorId: 'vector-dot-product',
    summary: '벡터의 내적(스칼라적)은 같은 성분끼리 곱하여 모두 더한 값으로, 두 벡터가 같은 방향을 가리키는지, 수직인지(내적=0), 각도가 얼마인지를 산출합니다.',
    keyPoints: [
      {
        title: '내적 공식과 각도 관계',
        description: 'u · v = u₁v₁ + u₂v₂ = |u||v| cos(θ)',
        formulaLatex: '\\vec{u} \\cdot \\vec{v} = \\sum_{i=1}^n u_i v_i',
      },
    ],
    examples: [
      {
        question: '벡터 u=(2, 3), v=(4, -1) 의 내적을 구하세요.',
        questionLatex: '\\vec{u} \\cdot \\vec{v}',
        solutionSteps: [
          'x성분 곱: 2 × 4 = 8',
          'y성분 곱: 3 × (-1) = -3',
          '내적 합: 8 + (-3) = 5',
        ],
        answerLatex: '5',
      },
    ],
  },
  {
    id: 'partial-derivatives',
    unit: '08. 고급수학 (선형대수 & 다변수)',
    title: '다변수 함수의 편미분',
    subtitle: '머신러닝 경사하강법(Gradient Descent)의 수학적 근간',
    order: 18,
    estimatedMinutes: 22,
    generatorId: 'partial-derivatives',
    summary: '입력 변수가 2개 이상인 함수 f(x, y)에서 한 변수(x)만 변화할 때의 순간변화율을 구하는 것을 편미분이라 합니다. 이때 다른 변수(y)는 단순한 상수로 고정 취급합니다.',
    keyPoints: [
      {
        title: '편도함수의 원리',
        description: 'x에 대해 편미분할 때 y는 상수 계수로 취급하여 미분합니다. 모든 편도함수를 모은 벡터를 그래디언트(Gradient ∇f)라 합니다.',
        formulaLatex: '\\nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\, \\frac{\\partial f}{\\partial y} \\right)',
      },
    ],
    examples: [
      {
        question: 'f(x, y) = 3x²y + 5y 의 ∂f/∂x 를 구하세요.',
        questionLatex: '\\frac{\\partial}{\\partial x} (3x^2 y + 5y)',
        solutionSteps: [
          '3x²y 에서 y를 상수로 보고 x² 미분: 3(2x)y = 6xy',
          '5y 에는 x가 없으므로 상수 미분되어 0 이 됩니다.',
          '따라서 ∂f/∂x = 6xy 입니다.',
        ],
        answerLatex: '6xy',
      },
    ],
  },
];
