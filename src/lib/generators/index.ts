import { Problem, Difficulty } from './types';
import { generateFractionAddition, generateOrderOfOperations } from './arithmetic';
import { generateNegativeArithmetic, generateExponentBasic } from './integers-prealgebra';
import { generateTwoStepLinearEquation, generateBothSidesLinearEquation } from './linear-equations';
import { generateSlopeFromTwoPoints, generateLinearFunctionIntercepts } from './linear-functions';
import { generateQuadraticFactoring } from './quadratics';
import { generateSystemOfLinearEquations, generateQuadraticDiscriminant } from './systems-and-roots';
import { generatePythagoreanTheorem, generateSpecialTrigValues } from './trigonometry-pythagoras';
import { generateLogarithmBasic, generateArithmeticSequence } from './logarithms-sequences';
import { generatePolynomialDerivative, generateDefiniteIntegral } from './calculus';
import { generateMatrixDeterminant, generateVectorDotProduct, generatePartialDerivative } from './linear-algebra-stats';

export interface GeneratorItem {
  id: string;
  topicId: string;
  unit: string;
  name: string;
  description: string;
  generator: (difficulty?: Difficulty) => Problem;
}

export const GENERATORS: GeneratorItem[] = [
  // 1. 기초 산수 (초등 5~6)
  {
    id: 'fractions',
    topicId: 'arithmetic',
    unit: '01. 기초 산수',
    name: '분수의 덧셈과 통분',
    description: '서로 다른 분모를 통분하고 약분하여 기약분수 만들기',
    generator: generateFractionAddition,
  },
  {
    id: 'operations-order',
    topicId: 'arithmetic',
    unit: '01. 기초 산수',
    name: '사칙혼합연산 우선순위',
    description: '괄호와 곱셈/나눗셈, 덧셈/뺄셈 연산 순서 마스터',
    generator: generateOrderOfOperations,
  },

  // 2. 정수와 유리수 (중1~2)
  {
    id: 'negative-numbers',
    topicId: 'integers',
    unit: '02. 정수와 유리수',
    name: '음수의 연산과 부호 규칙',
    description: '마이너스 부호의 중첩, 음수의 곱셈/나눗셈 부호 판정',
    generator: generateNegativeArithmetic,
  },
  {
    id: 'exponents',
    topicId: 'integers',
    unit: '02. 정수와 유리수',
    name: '기초 지수법칙',
    description: '밑이 같은 거듭제곱의 곱셈과 거듭제곱의 거듭제곱',
    generator: generateExponentBasic,
  },

  // 3. 일차방정식과 연립방정식 (중1~2)
  {
    id: 'linear-equations',
    topicId: 'algebra',
    unit: '03. 일차방정식과 연립방정식',
    name: '일차방정식 기본 풀이',
    description: '등식의 성질, 이항과 계수 정리를 통한 해 구하기',
    generator: generateTwoStepLinearEquation,
  },
  {
    id: 'linear-equations-advanced',
    topicId: 'algebra',
    unit: '03. 일차방정식과 연립방정식',
    name: '양변 미지수 일차방정식',
    description: '좌우 양변에 미지수가 있는 고난도 방정식 풀이',
    generator: generateBothSidesLinearEquation,
  },
  {
    id: 'systems-equations',
    topicId: 'algebra',
    unit: '03. 일차방정식과 연립방정식',
    name: '연립일차방정식 (가감법)',
    description: '미지수 2개인 연립방정식 소거법 풀이',
    generator: generateSystemOfLinearEquations,
  },

  // 4. 일차함수와 기하 (중2~3)
  {
    id: 'linear-functions-slope',
    topicId: 'functions',
    unit: '04. 일차함수와 기하',
    name: '두 점을 지나는 직선의 기울기',
    description: 'x의 변화량과 y의 변화량(Δy/Δx) 비율 구하기',
    generator: generateSlopeFromTwoPoints,
  },
  {
    id: 'linear-functions-intercept',
    topicId: 'functions',
    unit: '04. 일차함수와 기하',
    name: '일차함수의 x·y절편',
    description: '좌표축과 그래프가 만나는 절편 좌표 도출',
    generator: generateLinearFunctionIntercepts,
  },
  {
    id: 'pythagoras',
    topicId: 'geometry',
    unit: '04. 일차함수와 기하',
    name: '피타고라스 정리 (c² = a² + b²)',
    description: '직각삼각형 세 변의 기하학적 관계',
    generator: generatePythagoreanTheorem,
  },

  // 5. 이차방정식과 고등 대수 (중3~고1)
  {
    id: 'quadratics-factoring',
    topicId: 'quadratics',
    unit: '05. 이차방정식과 고등 대수',
    name: '인수분해와 이차방정식의 해',
    description: '합과 곱을 이용한 인수분해로 이차방정식 풀기',
    generator: generateQuadraticFactoring,
  },
  {
    id: 'quadratic-discriminant',
    topicId: 'high-algebra',
    unit: '05. 이차방정식과 고등 대수',
    name: '판별식 (D = b² - 4ac)',
    description: '실근의 개수와 허근 판정',
    generator: generateQuadraticDiscriminant,
  },

  // 6. 삼각비와 초월함수 (중3~고2)
  {
    id: 'special-angles',
    topicId: 'trigonometry',
    unit: '06. 삼각함수와 로그',
    name: '특수각의 삼각비 (sin, cos, tan)',
    description: '30°, 45°, 60°의 삼각비 값 계산',
    generator: generateSpecialTrigValues,
  },
  {
    id: 'log-basic',
    topicId: 'logarithms',
    unit: '06. 삼각함수와 로그',
    name: '로그의 기본 정의와 계산',
    description: '밑과 진수의 관계, 지수 연산의 역연산',
    generator: generateLogarithmBasic,
  },
  {
    id: 'arithmetic-sequence',
    topicId: 'sequences',
    unit: '06. 삼각함수와 로그',
    name: '등차수열의 일반항',
    description: '규칙적인 수열 패턴의 n번째 항 구하기',
    generator: generateArithmeticSequence,
  },

  // 7. 미적분학 기초 (고2~고3)
  {
    id: 'derivatives',
    topicId: 'calculus',
    unit: '07. 미적분학 기초',
    name: '다항함수 도함수와 미분계수',
    description: '거듭제곱 미분 공식과 순간변화율 f\'(x)',
    generator: generatePolynomialDerivative,
  },
  {
    id: 'integrals',
    topicId: 'calculus',
    unit: '07. 미적분학 기초',
    name: '정적분의 계산과 기하학적 넓이',
    description: '미적분학의 기본정리와 누적 면적 계산',
    generator: generateDefiniteIntegral,
  },

  // 8. 대학 / 성인 고급수학 (선형대수 & 다변수 미적분)
  {
    id: 'matrix-determinant',
    topicId: 'linear-algebra',
    unit: '08. 고급수학 (선형대수 & 다변수)',
    name: '2×2 행렬식 (Determinant: ad - bc)',
    description: '선형변환 면적 확대율과 역행렬 판정',
    generator: generateMatrixDeterminant,
  },
  {
    id: 'vector-dot-product',
    topicId: 'linear-algebra',
    unit: '08. 고급수학 (선형대수 & 다변수)',
    name: '벡터의 내적 (Dot Product)',
    description: '다차원 벡터의 스칼라 곱과 코사인 유사도',
    generator: generateVectorDotProduct,
  },
  {
    id: 'partial-derivatives',
    topicId: 'advanced-calculus',
    unit: '08. 고급수학 (선형대수 & 다변수)',
    name: '다변수 함수의 편미분',
    description: '머신러닝 경사하강법의 근간인 편도함수',
    generator: generatePartialDerivative,
  },
];

export function getGenerator(id: string): GeneratorItem | undefined {
  return GENERATORS.find((g) => g.id === id);
}

export function generateRandomProblem(topicId?: string): Problem {
  const filtered = topicId ? GENERATORS.filter((g) => g.topicId === topicId) : GENERATORS;
  const pool = filtered.length > 0 ? filtered : GENERATORS;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return chosen.generator();
}
