# Google Analytics 통합

Google Analytics 4 (GA4)를 애플리케이션에 통합하기 위한 모듈입니다.

## 파일 구조

```
google-analytics/
├── GoogleAnalyticsEnhanced.tsx  # React 컴포넌트
├── analytics.ts                 # 추적 함수들
├── config.ts                    # 설정 및 상수
└── README.md                    # 이 문서
```

## 설정 방법

### 1. Google Analytics 계정 생성

1. [Google Analytics](https://analytics.google.com/)에 접속
2. 새 속성 만들기
3. Google Analytics 4 속성 선택
4. 측정 ID (G-XXXXXXXXXX) 복사

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```env
# Google Analytics Measurement ID
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

또는 `.env.local` (Git에 커밋되지 않음):

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. 컴포넌트 통합

#### App.tsx에 추가

```tsx
import GoogleAnalyticsEnhanced from './integrations/google-analytics/GoogleAnalyticsEnhanced';

function App() {
  return (
    <>
      <GoogleAnalyticsEnhanced />
      {/* 나머지 앱 컴포넌트 */}
    </>
  );
}
```

## 사용 방법

### 기본 이벤트 추적

```tsx
import { trackEvent } from './integrations/google-analytics/analytics';

// 버튼 클릭 추적
<button onClick={() => trackEvent('button_click', { button_name: 'Calculate' })}>
  Calculate
</button>
```

### 계산기 사용 추적

```tsx
import { trackCalculatorUsage } from './integrations/google-analytics/analytics';

const onCalculate = () => {
  // 계산 로직...

  // 사용 추적
  trackCalculatorUsage({
    positionType: 'long',
    leverage: 10,
    hasProfit: netPnl > 0,
  });
};
```

### 버튼 클릭 추적

```tsx
import { trackButtonClick } from './integrations/google-analytics/analytics';

<button onClick={() => {
  trackButtonClick('Reset', 'calculator');
  resetFields();
}}>
  Reset
</button>
```

### 추천 링크 클릭 추적

```tsx
import { trackReferralClick } from './integrations/google-analytics/analytics';

<a
  href="https://binance.com/ref/..."
  onClick={() => trackReferralClick('binance')}
>
  Binance
</a>
```

### 언어 변경 추적

```tsx
import { trackLanguageChange } from './integrations/google-analytics/analytics';

const handleLanguageChange = (lang: string) => {
  setLanguage(lang);
  trackLanguageChange(lang);
};
```

### 에러 추적

```tsx
import { trackError } from './integrations/google-analytics/analytics';

try {
  // 위험한 작업...
} catch (error) {
  trackError(error as Error, 'calculator');
}
```

### 성능 측정

```tsx
import { trackTiming } from './integrations/google-analytics/analytics';

const startTime = performance.now();
// 작업 수행...
const duration = performance.now() - startTime;

trackTiming('Calculator', 'calculation_time', duration);
```

### 사용자 속성 설정

```tsx
import { setUserProperties } from './integrations/google-analytics/analytics';

setUserProperties({
  user_type: 'premium',
  preferred_language: 'ko',
});
```

### 쿠키 동의 관리

```tsx
import { setAnalyticsConsent } from './integrations/google-analytics/analytics';

// 사용자가 동의한 경우
setAnalyticsConsent(true);

// 사용자가 거부한 경우
setAnalyticsConsent(false);
```

## 추적되는 주요 이벤트

### 자동 추적
- ✅ 페이지 뷰 (초기 로드)
- ✅ 페이지 가시성 변경
- ✅ 페이지 제목

### 수동 추적 (구현 필요)
- 계산기 사용 (`calculator_used`)
- 계산기 리셋 (`calculator_reset`)
- 버튼 클릭 (`button_click`)
- 추천 링크 클릭 (`referral_click`)
- 언어 변경 (`language_change`)
- 광고 노출 (`ad_impression`)
- 광고 클릭 (`ad_click`)
- 에러 발생 (`exception`)

## 이벤트 명명 규칙

### 이벤트 이름
- 소문자 사용
- 단어는 언더스코어로 구분 (`snake_case`)
- 동사 + 명사 형태 (예: `click_button`, `view_page`)

### 파라미터
- 소문자 사용
- 단어는 언더스코어로 구분
- 의미 있는 이름 사용

```tsx
// Good
trackEvent('calculator_used', {
  position_type: 'long',
  leverage: 10,
});

// Bad
trackEvent('CalculatorUsed', {
  posType: 'long',
  lev: 10,
});
```

## Google Analytics 대시보드 설정

### 1. 맞춤 이벤트 확인

1. GA4 대시보드 → 보고서 → 이벤트
2. 추적된 이벤트 확인

### 2. 맞춤 보고서 만들기

**계산기 사용 보고서:**
1. 탐색 → 자유 형식 탐색
2. 측정기준: `position_type`, `leverage`
3. 측정항목: `이벤트 수`
4. 필터: `event_name = calculator_used`

### 3. 전환 설정

1. 관리 → 이벤트 → 전환 만들기
2. 중요 이벤트 선택:
   - `referral_click` (추천 링크 클릭)
   - `calculator_used` (계산기 사용)

### 4. 대시보드 템플릿

```
📊 주요 지표
├── 활성 사용자 (실시간)
├── 페이지 뷰
├── 세션 수
└── 평균 참여 시간

📈 계산기 사용
├── 총 계산 횟수
├── Long/Short 비율
├── 평균 레버리지
└── 수익 계산 vs 손실 계산 비율

🔗 추천 링크
├── 클릭 수 (플랫폼별)
├── 전환율
└── 가장 인기 있는 플랫폼

🌍 언어별 통계
├── 사용자 수 (언어별)
├── 세션 수 (언어별)
└── 참여 시간 (언어별)
```

## 디버깅

### 개발 환경에서 테스트

```tsx
// config.ts의 debug 모드 확인
export const analyticsConfig = {
  debug: import.meta.env.DEV,  // 개발 환경에서 true
  // ...
};
```

브라우저 콘솔에서 이벤트 확인:

```javascript
// 모든 gtag 이벤트 로깅
window.dataLayer
```

### Chrome 확장 프로그램

1. **Google Analytics Debugger**
   - [설치 링크](https://chrome.google.com/webstore/detail/google-analytics-debugger)
   - 콘솔에 상세한 GA 로그 출력

2. **GA4 Debug View**
   - GA4 대시보드 → 관리 → DebugView
   - 실시간 이벤트 스트림 확인

### 일반적인 문제

#### 이벤트가 표시되지 않음

```bash
# 1. 환경 변수 확인
echo $VITE_GA_MEASUREMENT_ID

# 2. 빌드 후 테스트
npm run build
npm run preview
```

#### Measurement ID 형식 오류

```tsx
// ✅ 올바른 형식
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

// ❌ 잘못된 형식
VITE_GA_MEASUREMENT_ID=UA-XXXXXXXX-X  // 구 버전 (Universal Analytics)
VITE_GA_MEASUREMENT_ID=GTM-XXXXXXX    // Google Tag Manager
```

#### 광고 차단기 문제

```javascript
// analytics.ts에서 로딩 확인
if (!window.gtag) {
  console.warn('Google Analytics가 차단되었습니다');
}
```

## 성능 최적화

### 스크립트 지연 로딩

```tsx
// analytics.ts
const script = document.createElement('script');
script.async = true;  // 비동기 로딩
```

### 이벤트 배칭

```tsx
// 여러 이벤트를 한 번에 전송
const events = [];

events.push({ name: 'event1', params: {} });
events.push({ name: 'event2', params: {} });

events.forEach(event => trackEvent(event.name, event.params));
```

### 조건부 로딩

```tsx
// 프로덕션 환경에서만 로드
if (import.meta.env.PROD) {
  initAnalytics();
}
```

## 개인정보 보호

### GDPR 준수

```tsx
// 쿠키 동의 전까지 추적 비활성화
window.gtag?.('consent', 'default', {
  analytics_storage: 'denied',
});

// 사용자 동의 후
setAnalyticsConsent(true);
```

### IP 익명화

GA4는 기본적으로 IP를 익명화합니다.

### 민감한 데이터 필터링

```tsx
// ❌ 나쁜 예: 개인정보 전송
trackEvent('user_data', {
  email: 'user@example.com',  // 절대 금지!
});

// ✅ 좋은 예: 익명 데이터만
trackEvent('user_action', {
  action_type: 'calculate',
});
```

## Cloud Run 배포 시 주의사항

### 환경 변수 설정

```bash
# Cloud Run에 환경 변수 설정
gcloud run deploy coin-profit-calculator \
  --set-env-vars VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 빌드 시점 주입

```dockerfile
# Dockerfile에서
ARG VITE_GA_MEASUREMENT_ID
ENV VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID
```

## 다음 단계

- [ ] 모든 버튼에 추적 코드 추가
- [ ] 계산 결과에 따른 이벤트 추적
- [ ] 사용자 플로우 분석 설정
- [ ] A/B 테스트 통합
- [ ] 맞춤 대시보드 구성

## 참고 자료

- [Google Analytics 4 공식 문서](https://support.google.com/analytics/answer/9304153)
- [gtag.js 참조](https://developers.google.com/tag-platform/gtagjs/reference)
- [이벤트 측정](https://developers.google.com/analytics/devguides/collection/gtagjs/events)
- [맞춤 측정기준](https://support.google.com/analytics/answer/10075209)
