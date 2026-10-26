import { Problem, Difficulty } from './types';
import { generateFractionAddition, generateOrderOfOperations } from './arithmetic';
import { generateNegativeArithmetic, generateExponentBasic } from './integers-prealgebra';
import { generateTwoStepLinearEquation, generateBothSidesLinearEquation } from './linear-equations';
import { generateSlopeFromTwoPoints, generateLinearFunctionIntercepts } from './linear-functions';
import { generateQuadraticFactoring } from './quadratics';

export interface GeneratorItem {
  id: string;
  topicId: string;
  unit: string;
  name: string;
  description: string;
  generator: (difficulty?: Difficulty) => Problem;
}

export const GENERATORS: GeneratorItem[] = [
  {
    id: 'fractions',
    topicId: 'arithmetic',
    unit: '기초 산수',
    name: '분수의 덧셈과 통분',
    description: '서로 다른 분모를 통분하고 약분하여 기약분수 만들기',
    generator: generateFractionAddition,
  },
  {
    id: 'operations-order',
    topicId: 'arithmetic',
    unit: '기초 산수',
    name: '사칙혼합연산 우선순위',
    description: '괄호와 곱셈/나눗셈, 덧셈/뺄셈 연산 순서 마스터',
    generator: generateOrderOfOperations,
  },
  {
    id: 'negative-numbers',
    topicId: 'integers',
    unit: '정수와 유리수',
    name: '음수의 연산과 부호 규칙',
    description: '마이너스 부호의 중첩, 음수의 곱셈/나눗셈 부호 판정',
    generator: generateNegativeArithmetic,
  },
  {
    id: 'exponents',
    topicId: 'integers',
    unit: '정수와 유리수',
    name: '기초 지수법칙',
    description: '밑이 같은 거듭제곱의 곱셈과 거듭제곱의 거듭제곱',
    generator: generateExponentBasic,
  },
  {
    id: 'linear-equations',
    topicId: 'algebra',
    unit: '일차방정식',
    name: '일차방정식 기본 풀이 (ax + b = c)',
    description: '등식의 성질, 이항과 계수 정리를 통한 해 구하기',
    generator: generateTwoStepLinearEquation,
  },
  {
    id: 'linear-equations-advanced',
    topicId: 'algebra',
    unit: '일차방정식',
    name: '양변 미지수 일차방정식',
    description: '좌우 양변에 미지수가 있는 고난도 방정식 풀이',
    generator: generateBothSidesLinearEquation,
  },
  {
    id: 'linear-functions-slope',
    topicId: 'functions',
    unit: '일차함수와 그래프',
    name: '두 점을 지나는 직선의 기울기',
    description: 'x의 변화량과 y의 변화량(Δy/Δx) 비율 구하기',
    generator: generateSlopeFromTwoPoints,
  },
  {
    id: 'linear-functions-intercept',
    topicId: 'functions',
    unit: '일차함수와 그래프',
    name: '일차함수의 x·y절편',
    description: '좌표축과 그래프가 만나는 절편 좌표 도출',
    generator: generateLinearFunctionIntercepts,
  },
  {
    id: 'quadratics-factoring',
    topicId: 'quadratics',
    unit: '이차방정식',
    name: '인수분해와 이차방정식의 해',
    description: '합과 곱을 이용한 인수분해로 이차방정식 풀기',
    generator: generateQuadraticFactoring,
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
