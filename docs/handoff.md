# Mathtudy - Project Handoff Document

> **Last Updated**: 2026-11-03  
> **Repository**: [mathtudy](https://github.com/lelalela/mathtudy)  
> **Active PR**: [#1](https://github.com/lelalela/mathtudy/pull/1) (`feat/quickwins-difficulty-and-keypad` ➔ `main`)  
> **Commit Hash**: [`90175d4`](https://github.com/lelalela/mathtudy/commit/90175d4921d43c204c6453260435bfdb6d3b375a) (`feat(drill): add difficulty filter chips and physical keyboard bindings with extended keypad symbols`)

---

## 1. Project Overview & Core Philosophy

**Mathtudy**는 100% DB-less, Local-First, PWA 지원 성인 수학 독학 웹 애플리케이션입니다.
- **Tech Stack**: Next.js 16 (App Router / Turbopack), React 19, TypeScript 5, Tailwind CSS v4, Material Design 3 (MD3) Dark Mode, KaTeX 0.19.1.
- **100% DB-less & Local-First**: 서버 DB/호스팅 비용 0원. 브라우저 `localStorage`(`src/lib/storage.ts`)만으로 스트릭, 마스터리, 설정 유지.
- **Algorithmic Generators**: `src/lib/generators/*` 기반 클라이언트 동적 무한 문제 생성.

---

## 2. Recent Key Accomplishments (2026-11-03 Session)

### A. 기획자 세션 분석 보고서 도출
- 에듀테크 관점에서 서비스 결핍 요소(오답 복습 단절, 난이도 선택 부재, 키패드 PC 입력 미지원, 개념 진도 미체크 등) 도출.
- P0 과제로 Quick Win 2대 과제 선정 및 기능 개발자 워크트리 배정.

### B. Quick Win 2대 과제 구현 완료 및 PR #1 생성
1. **DrillView 난이도(Difficulty) 선택 UI 연동 (`src/components/drill/DrillView.tsx`)**:
   - `easy`, `medium`, `hard` MD3 Filter Chip 토글 UI 추가.
   - 난이도 변경 시 해당 난이도의 새 문제 즉시 생성 및 풀이 상태 리셋.
2. **가상 키패드 PC 물리 키보드 바인딩 & 기호 확충 (`src/components/ui/MathKeypad.tsx`)**:
   - `keydown` 이벤트 연동으로 숫자(0-9), 사칙연산 기호(+,-,*,/), 괄호, 백스페이스, 엔터(자동 제출) 입력 지원.
   - 키패드 버튼셋에 괄호 `(`, `)` 및 미지수 `y` 버튼 추가 (5열 그리드 확장).
   - MD3 컬러 토큰 적용 및 단축키 안내 힌트 칩 추가.
3. **GitHub PR 및 브랜치 푸시**:
   - 브랜치: `feat/quickwins-difficulty-and-keypad`
   - PR: [GitHub PR #1](https://github.com/lelalela/mathtudy/pull/1)
   - 자체 검증: `pnpm lint` 통과, `pnpm build` 통과

---

## 3. Next Tasks for New Developer (다음 투입 개발자 과제)

다음 개발자 투입 시 진행할 추천 과제 목록입니다:

1. **[P0] PR #1 머지 후 메인 브랜치 동기화 (`git pull origin main`)**
2. **[P1] 오답 노트 (Review Notebook) & 스냅샷 저장 아키텍처 구현**:
   - 틀린 문제 발생 시 당시의 수식, 선택지, 해설 스냅샷을 `localStorage`에 영구 보존.
   - 복습 전용 뷰/모달 또는 탭 구현.
3. **[P1] 개념서(LessonReader) 읽음 완료 체크 및 진도율 반영**:
   - 개념 완독 시 `storage.ts`에 기록하여 커리큘럼 로드맵 상의 진도율 시각화.
4. **[P1] 객관식 터치 실수 방지 인터랙션** (선택 후 제출 방식).
