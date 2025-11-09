# Docker 배포 설정

Google Cloud Run에 배포하기 위한 Docker 설정 파일들입니다.

## 파일 구조

- `Dockerfile` - Multi-stage Docker 이미지 빌드 설정
- `nginx.conf` - Nginx 웹 서버 설정
- `.dockerignore` - Docker 빌드에서 제외할 파일 목록
- `cloudbuild.yaml` - Google Cloud Build 자동 배포 설정

## 로컬에서 Docker 이미지 빌드

```bash
# 프로젝트 루트에서 실행
docker build -f docker/Dockerfile -t coin-profit-calculator .
```

## 로컬에서 컨테이너 실행

```bash
docker run -p 8080:8080 coin-profit-calculator
```

브라우저에서 `http://localhost:8080` 접속

## Google Cloud Run 배포

### 1. 수동 배포

```bash
# Google Cloud 프로젝트 설정
gcloud config set project YOUR_PROJECT_ID

# 이미지 빌드 및 푸시
gcloud builds submit --config docker/cloudbuild.yaml

# 또는 간단하게
gcloud run deploy coin-profit-calculator \
  --source . \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated
```

### 2. 자동 배포 (Cloud Build 트리거)

1. Google Cloud Console에서 Cloud Build 트리거 생성
2. GitHub 저장소 연결
3. 빌드 구성 파일: `docker/cloudbuild.yaml`
4. 트리거 조건 설정 (예: main 브랜치에 push)

### 환경 변수 설정

배포 시 환경 변수가 필요한 경우:

```bash
gcloud run deploy coin-profit-calculator \
  --image gcr.io/YOUR_PROJECT_ID/coin-profit-calculator:latest \
  --set-env-vars VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX,VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXX
```

## 주요 특징

- **Multi-stage 빌드**: Node.js로 빌드 후 Nginx에서 서빙하여 이미지 크기 최소화
- **포트 8080**: Cloud Run 기본 포트 사용
- **Gzip 압축**: 정적 파일 압축으로 전송 속도 향상
- **캐싱**: 정적 자산 1년 캐싱 설정
- **보안 헤더**: XSS, Clickjacking 등 방어
- **Health Check**: 컨테이너 상태 모니터링
- **SPA 라우팅**: React Router 지원

## 문제 해결

### 빌드 실패 시

```bash
# 빌드 로그 확인
gcloud builds list
gcloud builds log [BUILD_ID]
```

### 배포 후 접속 안 될 때

```bash
# 서비스 로그 확인
gcloud run services logs tail coin-profit-calculator --region asia-northeast3
```

### 환경 변수 확인

```bash
gcloud run services describe coin-profit-calculator --region asia-northeast3
```
