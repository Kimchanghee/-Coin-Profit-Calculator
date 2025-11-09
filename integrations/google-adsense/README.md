# Google AdSense 통합

Google AdSense를 React 애플리케이션에 통합하기 위한 모듈입니다.

## 파일 구조

```
google-adsense/
├── AdUnitEnhanced.tsx   # React 광고 컴포넌트
├── config.ts            # AdSense 설정 및 슬롯 ID
├── adsense-utils.ts     # 유틸리티 함수들
└── README.md            # 이 문서
```

## 설정 방법

### 1. Google AdSense 계정 생성 및 승인

1. [Google AdSense](https://www.google.com/adsense/) 접속
2. 계정 생성 및 사이트 등록
3. 사이트 승인 대기 (보통 1-2주 소요)
4. 승인 후 광고 단위 생성

### 2. 광고 단위 생성

AdSense 대시보드에서:

1. **광고 → 광고 단위 → 새 광고 단위**
2. 광고 유형 선택:
   - **디스플레이 광고** (가장 일반적)
   - **인피드 광고** (콘텐츠 사이)
   - **인아티클 광고** (기사 내부)

3. 각 위치별 광고 생성:
   - Sidebar Top (세로형)
   - Sidebar Bottom (세로형)
   - Header Banner (가로형)
   - Footer Banner (가로형)

4. 각 광고 단위의 **슬롯 ID** 복사 (예: 1234567890)

### 3. 환경 변수 설정

`.env` 파일 생성:

```env
# Google AdSense Publisher ID (ca-pub- 형식)
VITE_ADSENSE_CLIENT_ID=ca-pub-1234567890123456

# 광고 슬롯 ID들
VITE_ADSENSE_SLOT_SIDEBAR_TOP=1234567890
VITE_ADSENSE_SLOT_SIDEBAR_BOTTOM=0987654321
VITE_ADSENSE_SLOT_HEADER_BANNER=1122334455
VITE_ADSENSE_SLOT_FOOTER_BANNER=5544332211
VITE_ADSENSE_SLOT_IN_ARTICLE=6677889900
```

### 4. HTML에 AdSense 코드 추가 (선택사항)

`index.html`의 `<head>` 태그에 추가:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"></script>
```

## 사용 방법

### 기본 사용

```tsx
import AdUnitEnhanced from './integrations/google-adsense/AdUnitEnhanced';

function Sidebar() {
  return (
    <aside>
      {/* 사이드바 상단 광고 */}
      <AdUnitEnhanced slotKey="sidebarTop" />

      {/* 사이드바 하단 광고 */}
      <AdUnitEnhanced slotKey="sidebarBottom" />
    </aside>
  );
}
```

### 커스텀 스타일

```tsx
<AdUnitEnhanced
  slotKey="sidebarTop"
  className="my-4 shadow-lg"
  minHeight="300px"
/>
```

### 광고 형식 지정

```tsx
<AdUnitEnhanced
  slotKey="headerBanner"
  format="horizontal"
  minHeight="90px"
/>
```

지원되는 형식:
- `auto` (기본값, 반응형)
- `rectangle` (직사각형)
- `horizontal` (가로형 배너)
- `vertical` (세로형 배너)

### 플레이스홀더 숨기기

```tsx
<AdUnitEnhanced
  slotKey="sidebarTop"
  showPlaceholder={false}  // 광고 없을 때 아무것도 표시 안 함
/>
```

## 고급 기능

### 1. 자동 광고 (Auto Ads)

```tsx
import { initAutoAds } from './integrations/google-adsense/adsense-utils';

// App 초기화 시 한 번만 호출
useEffect(() => {
  initAutoAds();
}, []);
```

### 2. 광고 새로고침

```tsx
import { refreshAds } from './integrations/google-adsense/adsense-utils';

// 동적 콘텐츠 변경 후 광고 새로고침
const loadMoreContent = () => {
  // 콘텐츠 로드...
  refreshAds();
};
```

### 3. 광고 차단기 감지

```tsx
import { detectAdBlocker } from './integrations/google-adsense/adsense-utils';

useEffect(() => {
  detectAdBlocker().then(isBlocked => {
    if (isBlocked) {
      console.log('광고 차단기가 감지되었습니다');
      // 사용자에게 메시지 표시
    }
  });
}, []);
```

### 4. 광고 성능 추적

```tsx
import { trackAdImpression, trackAdClick } from './integrations/google-adsense/adsense-utils';

// 광고 노출 추적
trackAdImpression('1234567890', 'sidebarTop');

// 광고 클릭 추적
trackAdClick('1234567890', 'sidebarTop');
```

### 5. Lazy Loading (지연 로딩)

```tsx
import { setupLazyAdLoading } from './integrations/google-adsense/adsense-utils';

useEffect(() => {
  // 뷰포트에 들어올 때만 광고 로드
  setupLazyAdLoading();
}, []);
```

## 광고 배치 권장사항

### 최적 위치

```tsx
function App() {
  return (
    <>
      {/* 헤더 - 가로형 배너 */}
      <header>
        <AdUnitEnhanced slotKey="headerBanner" format="horizontal" minHeight="90px" />
      </header>

      <main className="grid grid-cols-3 gap-8">
        {/* 메인 콘텐츠 */}
        <div className="col-span-2">
          <Content />

          {/* 콘텐츠 중간에 인아티클 광고 */}
          <AdUnitEnhanced slotKey="inArticle" format="auto" />
        </div>

        {/* 사이드바 - 세로형 광고들 */}
        <aside className="col-span-1 space-y-8">
          <AdUnitEnhanced slotKey="sidebarTop" format="vertical" />
          <AdUnitEnhanced slotKey="sidebarBottom" format="vertical" />
        </aside>
      </main>

      {/* 푸터 - 가로형 배너 */}
      <footer>
        <AdUnitEnhanced slotKey="footerBanner" format="horizontal" minHeight="90px" />
      </footer>
    </>
  );
}
```

### 광고 밀도 규칙

Google AdSense 정책:
- ✅ 콘텐츠보다 광고가 많으면 안 됨
- ✅ 스크롤 없이 보이는 영역에 광고 3개 이하 권장
- ✅ 광고 간 충분한 간격 유지
- ❌ 클릭 유도 문구 금지 ("여기를 클릭" 등)
- ❌ 콘텐츠와 혼동되는 배치 금지

## AdSense 정책 준수

### 허용되는 것
- ✅ 적절한 광고 밀도
- ✅ 명확한 광고 표시
- ✅ 사용자 친화적 배치
- ✅ 반응형 광고

### 금지되는 것
- ❌ 광고 클릭 유도
- ❌ 오해의 소지가 있는 배치
- ❌ 자동 클릭 스크립트
- ❌ 무효 트래픽 생성

### 콘텐츠 정책
- ✅ 원본 콘텐츠
- ❌ 성인 콘텐츠
- ❌ 불법 콘텐츠
- ❌ 저작권 침해

## 수익 최적화

### 1. 광고 위치 최적화

```tsx
// A/B 테스트를 위한 광고 배치
const adPositions = {
  variant_a: ['sidebarTop', 'sidebarBottom'],
  variant_b: ['headerBanner', 'sidebarTop', 'footerBanner'],
};

const variant = Math.random() > 0.5 ? 'variant_a' : 'variant_b';
```

### 2. 광고 형식 실험

```tsx
// 다양한 광고 형식 테스트
<AdUnitEnhanced slotKey="sidebarTop" format="auto" />
<AdUnitEnhanced slotKey="sidebarTop" format="vertical" />
```

### 3. 로딩 시간 최적화

```tsx
// Lazy loading으로 초기 로딩 속도 개선
import { setupLazyAdLoading } from './integrations/google-adsense/adsense-utils';

useEffect(() => {
  setupLazyAdLoading();
}, []);
```

### 4. 광고 차단기 대응

```tsx
const [adBlockerDetected, setAdBlockerDetected] = useState(false);

useEffect(() => {
  detectAdBlocker().then(setAdBlockerDetected);
}, []);

if (adBlockerDetected) {
  return (
    <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
      광고 차단기를 비활성화하여 무료 서비스를 지원해주세요!
    </div>
  );
}
```

## 수익 예측

```tsx
import { estimateRevenue } from './integrations/google-adsense/adsense-utils';

// 일일 1000 페이지뷰 기준
const dailyRevenue = estimateRevenue({
  impressions: 1000,
  ctr: 0.01,  // 1% CTR
  cpc: 0.5,   // $0.50 CPC
});

console.log(`예상 일일 수익: $${dailyRevenue.toFixed(2)}`);
// 예상 일일 수익: $5.00
```

## 문제 해결

### 광고가 표시되지 않음

**1. 환경 변수 확인**
```bash
echo $VITE_ADSENSE_CLIENT_ID
# ca-pub-XXXXXXXXXXXXXXXX 형식이어야 함
```

**2. 콘솔 에러 확인**
```javascript
// 브라우저 개발자 도구에서
console.log(window.adsbygoogle);
```

**3. AdSense 승인 상태 확인**
- AdSense 대시보드에서 승인 상태 확인
- 승인 전에는 광고가 표시되지 않음

**4. 광고 차단기 확인**
- 광고 차단기 비활성화 후 테스트
- 시크릿 모드에서 테스트

### 광고가 느리게 로딩됨

```tsx
// Lazy loading 활성화
import { setupLazyAdLoading } from './integrations/google-adsense/adsense-utils';

useEffect(() => {
  setupLazyAdLoading();
}, []);
```

### 수익이 낮음

**개선 방법:**
1. 광고 위치 최적화 (Above the fold)
2. 광고 형식 실험 (auto vs. specific)
3. 콘텐츠 품질 향상
4. 트래픽 증가

## Cloud Run 배포

### 환경 변수 설정

```bash
gcloud run deploy coin-profit-calculator \
  --set-env-vars VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX,VITE_ADSENSE_SLOT_SIDEBAR_TOP=XXXXXXXXXX
```

### ads.txt 파일 추가

`public/ads.txt` 파일 생성:

```
google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
```

이 파일은 루트 도메인에서 접근 가능해야 합니다:
```
https://your-domain.com/ads.txt
```

## 성능 모니터링

### AdSense 대시보드

1. **보고서 → 개요**
   - 예상 수익
   - 페이지뷰
   - 클릭 수
   - CTR (클릭률)
   - CPC (클릭당 비용)

2. **보고서 → 광고 단위별**
   - 각 광고 슬롯 성능 확인
   - 저성과 슬롯 최적화

3. **최적화 → 권장사항**
   - Google의 최적화 제안 확인
   - 자동 최적화 활성화

### Google Analytics 통합

```tsx
import { trackAdImpression } from './integrations/google-adsense/adsense-utils';

// AdSense 이벤트를 GA로 전송
trackAdImpression('1234567890', 'sidebarTop');
```

## 참고 자료

- [AdSense 시작 가이드](https://support.google.com/adsense/answer/6242051)
- [AdSense 정책](https://support.google.com/adsense/answer/48182)
- [광고 배치 정책](https://support.google.com/adsense/answer/1346295)
- [ads.txt 가이드](https://support.google.com/adsense/answer/7532444)
- [AdSense API](https://developers.google.com/adsense/management/)

## 추가 기능 (향후)

- [ ] AdSense Management API 통합
- [ ] 실시간 수익 대시보드
- [ ] A/B 테스트 자동화
- [ ] 광고 차단기 우회 전략
- [ ] 네이티브 광고 통합
