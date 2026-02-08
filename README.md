# TONE's CLINIC 명동점 홈페이지

프리미엄 피부과 클리닉 홈페이지 + 관리자 시스템

---

## 필수 환경

- **Node.js** 18 이상 (https://nodejs.org)
- macOS / Windows / Linux

---

## 설치 및 실행

### 1. 프로젝트 다운로드 후 서버 폴더로 이동

```bash
cd server
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 서버 실행

```bash
npm start
```

### 4. 브라우저에서 접속

| 페이지 | 주소 |
|--------|------|
| 메인 사이트 | http://localhost:3000 |
| 관리자 페이지 | http://localhost:3000/admin |
| 칼럼 페이지 | http://localhost:3000/column |

---

## 관리자 로그인

- **아이디:** `admin`
- **비밀번호:** `admin1234`

> 처음 실행 시 자동으로 DB와 기본 데이터가 생성됩니다.

---

## 관리자 기능

| 메뉴 | 경로 | 기능 |
|------|------|------|
| 시술 콘텐츠 | `/admin/treatments` | 시술 페이지 텍스트 편집 (제목, 설명, FAQ 등) |
| 칼럼 관리 | `/admin/columns` | 블로그/칼럼 작성, 수정, 삭제 |
| 사이트 이미지 | `/admin/images` | 메인 페이지 이미지 9개 교체 |
| 시술 이미지 | `/admin/treatment-images` | 시술 페이지 장비/카테고리 이미지 관리 |
| 전후사진 | `/admin/results` | 전후사진 추가/삭제 (Before/After) |
| 테마 설정 | `/admin/settings` | 사이트 전체 테마 색상 변경 (HEX 코드 입력) |

---

## 테마 색상 변경

1. 관리자 > **테마 설정** 접속
2. 원하는 색상 코드 입력 (예: `#5C2A2E`)
3. **테마 적용** 클릭
4. 사이트 새로고침하면 전체 색상 반영

---

## 폴더 구조

```
da-myeongdong/
├── index.html              # 메인 페이지
├── about.html              # 클리닉 소개
├── results.html            # 전후사진
├── reservation.html        # 예약
├── location.html           # 오시는 길
├── pricing.html            # 비급여항목안내
├── privacy.html            # 개인정보처리방침
├── terms.html              # 이용약관
├── css/
│   └── style.css           # 메인 스타일시트 (CSS 변수 기반)
├── js/
│   └── main.js             # 메인 JS (테마/이미지 동적 로딩 포함)
├── images/                 # 사이트 이미지 (관리자에서 교체 가능)
├── column/
│   └── index.html          # 칼럼 목록 (정적)
├── treatments/
│   ├── lifting.html        # 리프팅 카테고리
│   ├── skincare.html       # 피부관리 카테고리
│   ├── injection.html      # 주사시술 카테고리
│   ├── body.html           # 체형관리 카테고리
│   ├── lifting/            # 리프팅 세부 (울쎄라, 써마지, HIFU, 소프트웨이브)
│   ├── skincare/           # 피부관리 세부 (BBL, 레이저토닝, 스킨부스터)
│   ├── injection/          # 주사시술 세부 (보톡스, 필러, 물광주사)
│   └── body/               # 체형관리 세부 (바디컨투어링, 바디리프팅)
└── server/
    ├── server.js            # Express 서버
    ├── package.json         # 의존성 목록
    ├── db/
    │   ├── database.js      # DB 초기화 + 마이그레이션
    │   ├── schema.sql       # 스키마 정의
    │   └── data.db          # SQLite DB (자동 생성)
    ├── routes/
    │   ├── api.js           # REST API
    │   ├── admin.js         # 관리자 라우트
    │   └── column.js        # 칼럼 라우트
    ├── middleware/
    │   └── auth.js          # JWT 인증
    ├── views/
    │   ├── admin/           # 관리자 EJS 템플릿
    │   └── column/          # 칼럼 EJS 템플릿
    └── public/
        └── uploads/         # 업로드 이미지 저장 (자동 생성)
```

---

## API 엔드포인트

| Method | 경로 | 설명 | 인증 |
|--------|------|------|------|
| POST | `/api/login` | 관리자 로그인 | - |
| GET | `/api/site-images` | 사이트 이미지 목록 | - |
| PUT | `/api/site-images/:slot` | 사이트 이미지 변경 | 필요 |
| GET | `/api/treatment-images` | 시술 이미지 목록 | - |
| PUT | `/api/treatment-images/:id` | 시술 이미지 변경 | 필요 |
| GET | `/api/treatment-pages` | 시술 콘텐츠 목록 | - |
| GET | `/api/treatment-pages/:page` | 시술 콘텐츠 조회 | - |
| PUT | `/api/treatment-pages/:page` | 시술 콘텐츠 수정 | 필요 |
| GET | `/api/results` | 전후사진 목록 | - |
| POST | `/api/results` | 전후사진 추가 | 필요 |
| DELETE | `/api/results/:id` | 전후사진 삭제 | 필요 |
| GET | `/api/columns` | 칼럼 목록 | - |
| POST | `/api/columns` | 칼럼 작성 | 필요 |
| PUT | `/api/columns/:id` | 칼럼 수정 | 필요 |
| DELETE | `/api/columns/:id` | 칼럼 삭제 | 필요 |
| POST | `/api/upload` | 이미지 업로드 (WebP 변환) | 필요 |
| GET | `/api/settings` | 사이트 설정 조회 | - |
| PUT | `/api/settings` | 사이트 설정 변경 (테마 등) | 필요 |

---

## 커스터마이징

### 브랜드명 변경
- 모든 HTML 파일에서 `TONE'S CLINIC` 텍스트 검색/치환
- `MYEONGDONG` 부분도 지점명에 맞게 변경

### 도메인 변경
- 모든 HTML의 `tones-myeongdong.com` 검색/치환
- `sitemap.xml`, `robots.txt` 업데이트

### 연락처 변경
- `02-XXXX-XXXX` 검색/치환
- `서울특별시 중구 명동길 [상세주소]` 검색/치환

---

## 기술 스택

- **프론트엔드:** HTML, CSS (CSS Variables), Vanilla JS
- **백엔드:** Node.js, Express.js
- **데이터베이스:** SQLite (better-sqlite3)
- **템플릿:** EJS
- **이미지 처리:** Sharp (WebP 자동 변환)
- **인증:** JWT + bcrypt
