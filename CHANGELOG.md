# 📝 CHANGELOG

## [1.2.0] - 2024-12-19

### 🎉 Major Features

- **수면 분석 대시보드 완전 구현**
  - 통계 페이지(`StatisticsPage`) 신규 생성
  - 3가지 차트 컴포넌트 구현: `SleepTrendChart`, `SleepQualityChart`, `WeeklyPatternChart`
  - 기간별 필터링 기능 (7일, 30일, 60일, 90일)
  - AI 기반 개인화된 수면 분석 및 추천 시스템

### 🔧 Backend Enhancements

- **통계 API 엔드포인트 8개 신규 추가**
  - 기본 통계, 확장 통계, 월간 통계 API
  - 수면 품질 추이, 패턴 분석 API
  - AI 인사이트 및 데이터 내보내기 API
  - 수면 목표 설정/조회 API

### 🎨 Frontend Improvements

- **sleepService 통계 기능 대폭 확장**
  - 8개 새로운 API 호출 함수 추가
  - `sleepUtils` 클라이언트 유틸리티 모듈 신규 생성
  - 수면 효율성, 일관성, 패턴 분석 등 고급 분석 함수 구현
  - 개인화된 수면 추천 알고리즘 구현

### 🚀 Navigation & UX

- **라우팅 및 네비게이션 시스템 구축**
  - `/statistics` 라우트 추가 및 보호된 라우트 구조에 통합
  - 메인 네비게이션에 분석 링크 추가
  - 현재 페이지 활성화 상태 표시 기능 구현
  - 수면 기록 페이지에서 분석 페이지로의 접근 경로 개선

### 📊 Data & Visualization

- **차트 라이브러리 통합**
  - Recharts 라이브러리 설치 및 설정
  - 반응형 차트 컴포넌트 3개 구현
  - 다양한 수면 패턴 시각화 지원

### 🛠️ Database & Migration

- **더미 데이터 생성 시스템 구축**
  - 다양한 패턴의 수면 데이터 60-90일분 생성
  - 4개 더미 사용자 계정 추가
  - 현실적인 수면 패턴 시뮬레이션

### 🔐 Authentication Fixes

- **로그인 시스템 개선**
  - 더미 계정 비밀번호 해싱 문제 해결
  - 로그인 페이지에 더미 계정 정보 및 빠른 로그인 버튼 추가
  - bcrypt 기반 비밀번호 해싱 시스템 완전 구현
  - 401/등록되지 않은 이메일 에러 해결

### 📚 Documentation

- **README.md 대폭 업데이트**
  - 수면 트래커 서비스 전용 문서화
  - API 엔드포인트 전체 목록 추가
  - 테스트 계정 정보 제공
  - 서비스 기능 상세 설명 추가

### 🧪 Testing & Development

- **개발 환경 개선**
  - 마이그레이션 스크립트 패키지에 추가
  - 비밀번호 수정 유틸리티 스크립트 개발
  - 타입 안전성을 위한 새로운 인터페이스 5개 추가

## [1.1.0] - 2024-12-18

### 🎯 Initial Sleep Tracker Implementation

- 수면 기록 CRUD 기능 구현
- 기본 사용자 인증 시스템 구축
- SQLite 데이터베이스 스키마 설계
- React 기반 프론트엔드 구조 설정

## [1.0.0] - 2024-12-17

### 🚀 Initial Release

- 풀스택 보일러플레이트 기본 구조 구축
- Fastify 백엔드 프레임워크 설정
- React + Vite 프론트엔드 설정
- TypeScript 기반 개발 환경 구축
- TailwindCSS 스타일링 시스템 적용
