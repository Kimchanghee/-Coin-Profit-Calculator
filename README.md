<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Coin Profit Calculator

암호화폐 선물 거래 수익률 계산기 - 레버리지를 활용한 손익 계산 도구

View your app in AI Studio: https://ai.studio/apps/drive/11qeskxhB7UkSO-t6BweSVn-1H1ttTYzg

## 주요 기능

- 롱/숏 포지션 수익률 계산
- 레버리지 지원
- 수수료 계산
- 추천인 페이백 계산
- 다국어 지원
- 반응형 디자인

## 프로젝트 구조

```
├── components/           # 기본 React 컴포넌트
├── docker/              # Docker 및 Cloud Run 배포 설정
│   ├── Dockerfile
│   ├── nginx.conf
│   └── cloudbuild.yaml
├── integrations/        # 서드파티 통합
│   ├── google-analytics/  # Google Analytics 4 통합
│   └── google-adsense/    # Google AdSense 통합
├── ui-enhanced/         # 개선된 UI 컴포넌트
│   ├── AppEnhanced.tsx
│   └── CalculatorEnhanced.tsx
└── ...
```

## 로컬 실행

**필수 요구사항:** Node.js 20+

1. 의존성 설치:
   ```bash
   npm install
   ```

2. 환경 변수 설정 (`.env.local` 파일 생성):
   ```env
   # Gemini API (선택사항)
   GEMINI_API_KEY=your_gemini_api_key

   # Google Analytics (선택사항)
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

   # Google AdSense (선택사항)
   VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
   VITE_ADSENSE_SLOT_SIDEBAR_TOP=1234567890
   VITE_ADSENSE_SLOT_SIDEBAR_BOTTOM=0987654321
   ```

3. 개발 서버 실행:
   ```bash
   npm run dev
   ```

4. 브라우저에서 `http://localhost:5173` 접속

## 배포

### Google Cloud Run 배포

자세한 내용은 [docker/README.md](docker/README.md) 참조

```bash
# 빌드 및 배포
gcloud builds submit --config docker/cloudbuild.yaml

# 또는 간단하게
gcloud run deploy coin-profit-calculator \
  --source . \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated
```

### Docker로 로컬 테스트

```bash
# 이미지 빌드
docker build -f docker/Dockerfile -t coin-profit-calculator .

# 컨테이너 실행
docker run -p 8080:8080 coin-profit-calculator
```

## 개선된 기능 사용

### UI 개선 버전 사용

자세한 내용은 [ui-enhanced/README.md](ui-enhanced/README.md) 참조

```tsx
// index.tsx에서
import AppEnhanced from './ui-enhanced/AppEnhanced';

// 기존 App 대신 AppEnhanced 사용
```

### Google Analytics 통합

자세한 내용은 [integrations/google-analytics/README.md](integrations/google-analytics/README.md) 참조

```tsx
import GoogleAnalyticsEnhanced from './integrations/google-analytics/GoogleAnalyticsEnhanced';
import { trackEvent } from './integrations/google-analytics/analytics';
```

### Google AdSense 통합

자세한 내용은 [integrations/google-adsense/README.md](integrations/google-adsense/README.md) 참조

```tsx
import AdUnitEnhanced from './integrations/google-adsense/AdUnitEnhanced';

<AdUnitEnhanced slotKey="sidebarTop" />
```

## 개발 가이드

### 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

### 프리뷰

```bash
npm run preview
```

프로덕션 빌드를 로컬에서 미리 확인할 수 있습니다.

## 문서

각 모듈별 상세 문서:

- [Docker 배포 가이드](docker/README.md)
- [UI 개선 가이드](ui-enhanced/README.md)
- [Google Analytics 통합](integrations/google-analytics/README.md)
- [Google AdSense 통합](integrations/google-adsense/README.md)

## 기술 스택

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **Deployment**: Google Cloud Run, Docker, Nginx
- **Analytics**: Google Analytics 4
- **Monetization**: Google AdSense

## 라이센스

MIT
