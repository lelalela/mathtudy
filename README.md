# 📐 Mathtudy (매스스터디)

> **성인을 위한 산수~고급수학 독학 플랫폼 (PWA · DB-less · Local-First)**

Mathtudy는 기초 산수(분수, 사칙연산)부터 대수학, 함수, 이차방정식 및 고급수학까지 다시 공부하고자 하는 성인 학습자를 위해 설계된 **데이터베이스 없는(DB-less) 로컬 퍼스트 반응형 PWA 웹 애플리케이션**입니다.

---

## ✨ 핵심 특징

### 1. 🚀 100% DB-less & 무한 알고리즘 문제 생성기
- 데이터베이스나 백엔드 서버 없이 동작합니다.
- TypeScript 기반 수학 규칙 함수가 매번 0.001초 만에 새로운 난수 파라미터로 무한한 문제를 동적 생성합니다.
- 서버 호스팅 비용 **0원**, 오프라인 완벽 구동, 유지보수 스트레스 제로.

### 2. 🧭 5분 빠른 진단 평가 (Placement Test)
- 성인 학습자가 어디서부터 공부해야 할지 바로 알 수 있도록 사칙연산, 음수, 지수, 일차방정식, 일차함수 핵심 문제를 진단합니다.
- 테스트 완료 즉시 점수 산출 및 추천 시작 단원으로 바로 연결됩니다.

### 3. 📖 정석 교재 스타일의 개념 해설서 & 인터랙티브 그래프
- Notion / Linear 감성의 집중도 높은 모던 미니멀 UI.
- KaTeX 기반 고품질 LaTeX 수식 렌더링.
- **인터랙티브 2D 그래프 시각화**: 기울기($a$), $y$절편($b$), 꼭짓점 슬라이더를 실시간으로 움직이며 직관적으로 원리를 체득할 수 있습니다.

### 4. ⌨️ 하이브리드 입력 인터랙션
- **객관식(선택형)**: 모바일 출퇴근길 등에서 빠르게 터치로 풀 수 있는 자동 생성 선택지.
- **가상 수학 키패드(주관식)**: 분수(`/`), 음수(`-`), 거듭제곱(`^`), 미지수(`x`)를 직접 입력하여 풀 수 있는 전용 키보드 탑재.

### 5. 🔍 오답 시 단계별(Step-by-Step) 전개 과정 제공
- 틀린 문제에 대해 단순 답안이 아닌, **Step 1(공식 확인) → Step 2(식 전개) → Step 3(결론)**의 수학적 풀이 과정과 LaTeX 수식을 즉각 제공합니다.

### 6. 💾 브라우저 로컬 영구 보존 & 1클릭 JSON 백업/복원
- 내가 푼 문제 수, 정답률, 연속 학습일(Streak), 단원별 레벨 마스터리가 브라우저 `localStorage`에 영구 보존됩니다.
- PC ↔ 모바일 기기 간 이동이나 백업을 위한 **1클릭 JSON 내보내기/불러오기**를 지원합니다.

---

## 🛠️ 기술 스택

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Math Engine**: KaTeX (`katex`)
- **Icons**: Lucide React (`lucide-react`)
- **Effects**: Canvas Confetti (`canvas-confetti`)
- **PWA**: Web App Manifest (`manifest.webmanifest`), Standalone App 모드 지원

---

## 🚀 시작하기

### 개발 서버 실행
```bash
pnpm install
pnpm dev
```
브라우저에서 `http://localhost:3000`으로 접속합니다.

### 프로덕션 빌드 & 실행
```bash
pnpm build
pnpm start
```

---

## 📂 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx         # KaTeX CSS 및 PWA 메타데이터 설정
│   ├── page.tsx           # 메인 쉘 (로드맵 / 드릴 / 통계 뷰 제어)
│   ├── manifest.ts        # PWA 설치 매니페스트
│   └── globals.css        # Tailwind v4 스타일
├── components/
│   ├── curriculum/
│   │   ├── RoadmapView.tsx    # 단원별 로드맵 및 진도 카드
│   │   └── LessonReader.tsx   # 교재형 개념 해설 및 공식 유도
│   ├── drill/
│   │   ├── DrillView.tsx      # 무한 알고리즘 연습 드릴 인터페이스
│   │   ├── MultipleChoice.tsx # 4지선다 선택형 컴포넌트
│   │   └── StepSolution.tsx   # 단계별 수식 풀이 해설창
│   ├── diagnostic/
│   │   └── DiagnosticModal.tsx# 5분 레벨 진단 평가 모달
│   ├── stats/
│   │   └── BackupModal.tsx    # JSON 백업 및 복원 모달
│   └── ui/
│       ├── MathRenderer.tsx   # KaTeX 수식 렌더러
│       ├── MathKeypad.tsx     # 분수/부호 수학 가상 키패드
│       └── InteractiveGraph.tsx# 슬라이더 조절 2D 함수 시각화
└── lib/
    ├── storage.ts             # LocalStorage 및 백업 매니저
    ├── curriculum-data.ts     # 단원별 개념서 데이터
    └── generators/            # 100% DB-less 수학 문제 알고리즘 생성기
        ├── arithmetic.ts      # 분수 덧셈, 혼합 연산
        ├── integers-prealgebra.ts # 음수 연산, 지수법칙
        ├── linear-equations.ts# 일차방정식
        ├── linear-functions.ts# 기울기, 절편
        ├── quadratics.ts      # 인수분해, 이차방정식
        └── index.ts           # 생성기 레지스트리
```
