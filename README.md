# cesium-korean-service

VWorld(브이월드) 배경지도와 Cesium World Terrain을 사용하는 한국 중심 3D 지도 웹 애플리케이션입니다.

**데모:** https://cesium-korean-service.vercel.app

## 주요 기능

- **VWorld WMTS 배경지도** — 일반, 위성, 하이브리드, 회색, 미드나잇 5종 전환
- **Cesium World Terrain** — 3D 지형 on/off
- **레이어 패널** — 우측 UI에서 지도·오버레이 제어
- **한국 초기 뷰** — 경도 127.5°, 위도 36.2° (대한민국 중부) 기준 카메라

## 기술 스택

| 구분 | 사용 |
|------|------|
| 3D 지도 | [CesiumJS](https://cesium.com/platform/cesiumjs/) 1.141 |
| 빌드 | [Vite](https://vite.dev/) 8 |
| 배경지도 | [VWorld Open API](https://www.vworld.kr/) WMTS |
| 지형 | Cesium Ion World Terrain |
| 배포 | [Vercel](https://vercel.com/) |

## 사전 준비

### 1. VWorld API 키

1. [VWorld 오픈API](https://www.vworld.kr/dev/v4dv_2doverapi_s001.do)에서 인증키 발급
2. **서비스 URL**에 사용할 도메인 등록
   - 로컬: `http://localhost:5173`
   - 배포: `https://cesium-korean-service.vercel.app/` (또는 본인 도메인)
3. **WMTS / 2D 지도** API 사용 설정

### 2. Cesium Ion 액세스 토큰

1. [Cesium Ion](https://ion.cesium.com/) 가입 후 Access Token 발급
2. World Terrain 사용을 위해 토큰이 유효해야 합니다

## 로컬 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정 — 프로젝트 루트에 .env 파일 생성

# 개발 서버 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 환경 변수

프로젝트 루트에 `.env` 파일을 만들고 다음 값을 설정합니다.

```env
VITE_VWORLD_API_KEY=your-vworld-api-key
VITE_CESIUM_ION_TOKEN=your-cesium-ion-token
```

| 변수 | 설명 |
|------|------|
| `VITE_VWORLD_API_KEY` | VWorld Open API 인증키 |
| `VITE_CESIUM_ION_TOKEN` | Cesium Ion 액세스 토큰 |

> `VITE_` 접두사 변수는 **클라이언트 번들에 포함**됩니다. 공개 저장소에 실제 키를 커밋하지 마세요.

로컬 개발 시 VWorld 타일은 Vite dev 프록시(`/vworld` → `api.vworld.kr`)를 통해 요청됩니다. VWorld 인증키에 `http://localhost:5173`이 등록되어 있어야 합니다.

## 프로젝트 구조

```
cesium-korean-service/
├── index.html              # Cesium 컨테이너 + UI 마운트
├── vite.config.js          # Cesium 정적 자산 복사, VWorld dev 프록시
├── vercel.json             # Vercel 정적 배포 설정
├── public/                 # favicon 등
└── src/
    ├── main.js             # Viewer 초기화, 카메라, Ion/VWorld 설정
    ├── style.css           # 레이어 패널·배너 스타일
    ├── layers/
    │   ├── vworld.js       # VWorld WMTS ImageryProvider
    │   └── layerManager.js # 지도 전환, 3D 지형, 오버레이 정의
    └── ui/
        └── layerPanel.js   # 우측 레이어 패널 UI
```

## VWorld 타일 설정 참고

- **타일 URL 형식:** `https://api.vworld.kr/req/wmts/1.0.0/{KEY}/{Layer}/{z}/{y}/{x}.{format}`
- **좌표 순서:** `{z}/{y}/{x}` (Cesium `UrlTemplateImageryProvider` 기준)
- **지원 줌:** 6 ~ 19 (`minimumLevel: 6`)
- **제공 영역:** 한국 (`rectangle`으로 제한)

VWorld는 한국 영역·특정 줌 레벨만 제공하므로, 멀리서 볼 때는 낮은 해상도 타일이 늘어나 보일 수 있습니다.

## Vercel 배포

1. GitHub 등에 저장소 연결 후 Vercel에 import
2. **Environment Variables** (Production)에 등록:
   - `VITE_VWORLD_API_KEY`
   - `VITE_CESIUM_ION_TOKEN`
3. Deploy — `vercel.json`이 Vite 정적 빌드(`dist`)를 사용합니다

CLI 배포:

```bash
npx vercel --prod
```

배포 후 VWorld 인증키 **서비스 URL**에 Vercel 도메인을 반드시 추가하세요.

## 라이선스

- CesiumJS: [Apache 2.0](https://github.com/CesiumGS/cesium/blob/main/LICENSE.md)
- VWorld 지도 데이터: [VWorld 이용약관](https://www.vworld.kr/) 및 API 정책 준수
