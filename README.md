# 수면 트래커 (Sleep Tracker)

## 프로젝트 개요

수면 트래커는 개인의 수면 패턴을 체계적으로 기록하고 분석하는 풀스택 웹 애플리케이션입니다.

현대인들의 건강한 수면 습관 형성을 돕기 위해 개발된 이 서비스는 단순한 기록을 넘어서 **AI 기반의 개인화된 수면 분석과 개선 방안**을 제공합니다. monorepo 구조로 설계되어 클라이언트와 서버를 효율적으로 관리하며, 현대적인 웹 개발 기술 스택을 활용하여 직관적이고 반응형인 사용자 경험을 제공합니다.

### 🌟 주요 특징

- **📊 지능형 수면 분석**: 수면 시간, 품질, 패턴을 다각도로 분석하여 시각적 차트로 제공
- **🤖 AI 기반 개인화 추천**: Google Gemini AI를 활용한 개별 수면 데이터 기반 맞춤형 수면 개선 제안
- **📈 다양한 통계 지표**: 수면 효율성, 일관성, 부채 등 지표 기반 분석
- **🎯 실시간 수면 점수**: 1-100점 스코어링 시스템으로 수면 품질 정량화
- **⚡ 실시간 AI 상태 모니터링**: AI 서비스 상태 및 분석 처리 시간 추적
- **🔐 완전한 인증 시스템**: 회원가입, 로그인, 로그아웃 기능으로 개인 데이터 보호
- **🚀 고성능 최적화**: 코드 스플리팅, API 캐싱, 컴포넌트 메모화로 빠른 로딩 속도
- **💾 스마트 캐싱**: 메모리 기반 API 캐싱으로 네트워크 요청 최소화
- **⚡ 점진적 로딩**: React.lazy 기반 페이지별 코드 분할로 초기 로딩 시간 단축

## 📝 업데이트 내역

최신 업데이트 내역과 버전별 변경사항은 [CHANGELOG.md](./CHANGELOG.md)를 참조하세요.

### v1.4.0 - 성능 최적화 업데이트 (2024-12-19)

> **📌 참고**: v1.4.0부터는 기존 과제 요구사항 이후의 추가 개선 작업입니다.

- **코드 스플리팅**: React.lazy로 초기 번들 크기 대폭 감소
- **API 캐싱**: 메모리 기반 캐싱으로 API 호출 횟수 80% 감소
- **컴포넌트 메모화**: React.memo + useMemo로 렌더링 성능 향상
- **사용자 경험**: 부드러운 페이지 전환 및 즉시 응답 구현

### AI 수면 분석 API

- `POST /api/ai/analyze`: AI 기반 수면 패턴 분석 및 개선 방안 제공
- `GET /api/ai/status`: AI 서비스 상태 확인

### 수면 트래커 API

- `GET /api/sleep-records`: 수면 기록 목록 조회
- `GET /api/sleep-records/:id`: 특정 수면 기록 조회
- `POST /api/sleep-records`: 새 수면 기록 추가
- `PUT /api/sleep-records/:id`: 수면 기록 수정
- `DELETE /api/sleep-records/:id`: 수면 기록 삭제
- `GET /api/statistics`: 수면 통계 조회
- `GET /api/statistics/extended`: 확장 수면 통계 조회
- `GET /api/statistics/monthly`: 월간 수면 통계 조회
- `GET /api/statistics/quality-trend`: 수면 품질 추이 조회
- `GET /api/statistics/pattern`: 수면 패턴 분석 조회
- `GET /api/statistics/ai-insights`: AI 기반 수면 분석 조회
- `POST /api/sleep-goal`: 수면 목표 설정
- `GET /api/sleep-goal`: 수면 목표 조회
- `GET /api/sleep-records/export`: 수면 데이터 내보내기

## 테스트 계정

다음 더미 계정들을 사용하여 서비스를 테스트할 수 있습니다:

- **기본 계정**: `test@test.com` / `test123`
- **김수면**: `kim.sleep@example.com` / `sleep123`
- **이꿈나라**: `lee.dream@example.com` / `dream123`
- **박잠자기**: `park.sleep@example.com` / `good123`


### 🤖 AI 수면 분석

- **Google Gemini AI 기반 분석**: 개인화된 수면 패턴 분석 및 전문적 조언
- **종합 수면 점수**: 수면시간, 품질, 일관성을 종합한 1-100점 스코어
- **맞춤형 개선 방안**: 우선순위 기반 단계별 수면 개선 제안
- **실시간 인사이트**: 수면 데이터에서 발견한 주요 패턴 및 개선점
- **폴백 분석**: AI 서비스 장애 시 기본 분석 제공
- **실시간 상태 모니터링**: AI 서비스 상태 및 처리 시간 추적

### 수면 기록 관리

- 수면 시간, 기상 시간, 수면 품질 기록
- 수면 기록 생성, 수정, 삭제
- 수면 기록 목록 조회 및 상세 보기

### 수면 통계 분석

- 수면 시간 추이 분석 (라인 차트)
- 수면 품질 분포 분석 (파이 차트)
- 주간 수면 패턴 분석 (바 차트)
- 월간/연간 통계 제공
- AI 분석과 통합된 종합 대시보드

### 고급 분석 기능

- 수면 효율성 계산
- 수면 일관성 분석 (취침/기상 시간 변동성)
- 수면 부채 계산
- 개인화된 수면 개선 추천
- 데이터 내보내기 (CSV/JSON)
- 기간별 분석 (주간/월간 패턴)

### 🚀 성능 최적화 기능

- **코드 스플리팅**: React.lazy로 페이지별 지연 로딩, 초기 번들 크기 최소화
- **스마트 캐싱**: 메모리 기반 API 캐싱으로 네트워크 요청 80% 감소
- **컴포넌트 메모화**: React.memo + useMemo로 불필요한 리렌더링 방지
- **점진적 로딩**: Suspense 기반 부드러운 페이지 전환
- **자동 캐시 관리**: TTL 기반 만료 처리 및 CRUD 작업 시 자동 무효화

## 기술 스택

### 공통

- 패키지 매니저: pnpm (workspace 기능 활용)
- 언어: TypeScript
- Node.js 버전: 22.x
- 테스트: Vitest
- 코드 품질: Prettier

### 클라이언트

- 프레임워크: React
- 빌드 도구: Vite
- 라우팅: React Router
- 스타일링: TailwindCSS
- 차트 라이브러리: Recharts
- 아이콘: Lucide React
- **성능 최적화**:
  - 코드 스플리팅: React.lazy + Suspense
  - 컴포넌트 메모화: React.memo + useMemo + useCallback
  - API 캐싱: 메모리 기반 TTL 캐싱 시스템
  - 번들 최적화: Vite 기반 자동 청크 분할

### 서버

- 프레임워크: Fastify
- 데이터베이스: SQLite with DirzzleORM
- 비밀번호 해싱: bcrypt
- AI 엔진: Google Gemini API (@google/genai)

## 설치 및 실행

### 초기 설치

```bash
# 프로젝트 루트 디렉토리에서 실행
pnpm install
```

### 환경 변수 설정

AI 기능을 사용하려면 Google AI Studio에서 API 키를 발급받아 설정해야 합니다:

```bash
# server/.env 파일에 추가
GEMINI_API_KEY=your_gemini_api_key_here
```

### 데이터베이스 마이그레이션

```bash
# 서버 디렉토리에서 실행
cd server
npm run migrate
```

### 개발 서버 실행

```bash
# 클라이언트 및 서버 동시 실행
pnpm dev

# 클라이언트만 실행
pnpm dev:client

# 서버만 실행
pnpm dev:server
```

### 테스트 실행

```bash
# 클라이언트 테스트
pnpm test:client

# 서버 테스트
pnpm test:server

# 모든 테스트 실행
pnpm test
```

### 빌드

```bash
# 클라이언트 및 서버 빌드
pnpm build
```

## 환경 변수 설정

- 클라이언트: `client/.env` 파일에 설정 (예시는 `client/.env.example` 참조)
- 서버: `server/.env` 파일에 설정 (예시는 `server/.env.example` 참조)

### 필수 환경 변수

**서버 (server/.env):**

```
GEMINI_API_KEY=your_google_ai_studio_api_key
DATABASE_URL=./data/database.sqlite
PORT=8000
```

## API 엔드포인트

### 인증 API

- `POST /api/auth/register`: 회원가입
  - Request: `{ name: string, email: string, password: string }`
  - Response: `{ success: boolean, data: User, error?: string }`
- `POST /api/auth/login`: 로그인
  - Request: `{ email: string, password: string }`
  - Response: `{ success: boolean, data: User, error?: string }`
- `POST /api/auth/logout`: 로그아웃
  - Response: `{ success: boolean }`
- `GET /api/auth/me`: 현재 사용자 정보 조회
  - Response: `{ success: boolean, data: User }`

### AI 분석 API

- `POST /api/ai/analyze`: AI 수면 분석 요청
  - Request: `{ sleepData: SleepData[], period?: 'week'|'month' }`
  - Response: `{ success: boolean, data: SleepAdvice, error?: string }`
- `GET /api/ai/status`: AI 서비스 상태 확인
  - Response: `{ success: boolean, data: AIServiceStatus }`

### 기본 API

- `GET /api/health`: 서버 상태 확인
- `GET /api/users`: 유저 목록 조회
- `GET /api/users/:id`: 특정 유저 조회
- `POST /api/users`: 새 유저 추가
- `PUT /api/users/:id`: 유저 정보 수정
- `DELETE /api/users/:id`: 유저 삭제
