<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Mathtudy - AI Agent Guidelines & Architecture Rules

이 문서는 AI 에이전트(Antigravity, Cursor, Claude 등)가 **Mathtudy** 프로젝트를 유지보수하거나 새 기능을 추가할 때 반드시 따라야 하는 핵심 원칙과 코드 컨벤션을 정의합니다.

---

## 1. 프로젝트 핵심 철학 (Core Philosophy)

1. **100% DB-less & Local-First**:
   - 별도의 데이터베이스 서버(PostgreSQL, MySQL, Supabase, Prisma, MongoDB 등)를 절대 도입하지 않습니다.
   - 모든 사용자 데이터(푼 문제 수, 정답률, 연속 학습일, 단원별 마스터리, 진단 평가 결과)는 브라우저의 `localStorage`에 영구 보존됩니다.
   - 외부 서버 운영 비용 0원, 완전한 오프라인 작동(PWA)을 보장합니다.

2. **동적 알고리즘 문제 생성기 (Algorithmic Generators)**:
   - 문제는 고정된 DB 레코드가 아니며, TypeScript 순수 함수(Pure Function)로 매번 0.001초 만에 새로운 난수 파라미터로 무한 생성됩니다.
   - 모든 문제는 **[정답, 오답 선지 3개, Step-by-Step 단계별 LaTeX 해설, 힌트, 단원 핵심 요약]**을 반드시 동시에 합성해야 합니다.

3. **고품질 수학 렌더링 & 미니멀 UI**:
   - 수식은 반드시 `katex`를 통하여 렌더링합니다 (`MathRenderer` 컴포넌트 활용).
   - 비주얼 스타일은 Notion / Linear 감성의 모던 미니멀 & 다크 모드 중심 디자인을 유지합니다.

---

## 2. 개발 및 빌드 명령어

* 개발 서버 실행: `pnpm dev`
* 린트 검사: `pnpm lint` (ESLint 9 + React 19 규칙 준수 필수)
* 프로덕션 빌드: `pnpm build`
* 의존성 관리: `pnpm` 전용

---

## 3. 새로운 문제 생성기 추가 규칙 (Generator Conventions)

새로운 수학 단원을 추가할 때는 다음 절차를 엄격히 준수합니다:

### Step 1: 생성기 함수 작성 ([`src/lib/generators/`](src/lib/generators))
* 함수 시그니처: `generateSomeMath(difficulty: Difficulty = 'medium'): Problem`
* ID 생성 시 `Date.now()` 대신 반드시 `getUniqueId('prefix')`를 사용할 것 (SSR Prerender 결정론적 빌드 보장).
* 반환 객체 규격:
  ```ts
  return {
    id: getUniqueId('unique-prefix'),
    topicId: 'topic-slug',
    subtopicId: 'subtopic-slug',
    unit: '01. 대단원명',
    title: '단원 제목',
    difficulty,
    questionText: '문제 본문 설명',
    questionLatex: '수식 문제 (KaTeX)',
    correctAnswer: '비교용 문자열 (예: 5, -3/4, x=2)',
    answerDisplayLatex: '정답 화면 표시용 LaTeX',
    distractors: ['오답1', '오답2', '오답3'], // 반드시 3개의 그럴듯한 오답 선지
    choices: shuffleArray([correctAnswer, ...distractors]),
    steps: [
      {
        stepNumber: 1,
        title: '단계 제목',
        explanation: '단계별 개념 설명',
        mathLatex: '전개 수식 LaTeX',
      },
      ...
    ],
    hints: ['힌트 1', '힌트 2'],
    conceptSummary: '단원 핵심 요약 한 줄',
  };
  ```

### Step 2: `GENERATORS` 레지스트리 등록 ([`src/lib/generators/index.ts`](src/lib/generators/index.ts))
* `GENERATORS` 배열에 항목 추가:
  ```ts
  {
    id: 'subtopic-id',
    topicId: 'topic-id',
    unit: '01. 대단원명',
    name: '단원 이름',
    description: '단원 설명',
    generator: generateSomeMath,
  }
  ```

### Step 3: 교재형 개념 해설 데이터 등록 ([`src/lib/curriculum-data.ts`](src/lib/curriculum-data.ts))
* `CURRICULUM_TOPICS` 배열에 `TopicConcept` 등록 (개념 요약, 핵심 공식, 단계별 대표 예제 포함).

---

## 4. 프론트엔드 & React 19 주의사항

1. **상태 동기화**:
   - `localStorage` 읽기/쓰기는 [`src/lib/storage.ts`](src/lib/storage.ts)의 `useUserProgress()` 훅을 통해서만 수행합니다.
   - `useEffect` 내에서 `setState`를 동기적으로 호출하지 마세요 (React 19 `react-hooks/set-state-in-effect` 린트 에러 발생).
2. **템플릿 리터럴과 LaTeX 충돌 방지**:
   - JS 템플릿 리터럴 `${ ... }` 안에서 LaTeX 명령어(`\times`, `\frac` 등)를 넣지 마세요.
   - 예: `` `${u1 \times v1}` `` ❌ (JS 파싱 에러) → `` `(${u1} \\times ${v1})` `` ⭕
3. **PWA & 오프라인 유지**:
   - 모든 에셋과 아이콘은 로컬 번들에 포함되어 인터넷이 없는 환경에서도 PWA로 실행될 수 있어야 합니다.
