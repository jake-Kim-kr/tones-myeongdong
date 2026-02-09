# TONE'S CLINIC 명동점 홈페이지 프로젝트 구조 문서

> 프리미엄 피부과 클리닉을 위한 풀스택 웹사이트 + CMS 관리 시스템
>
> **기술 스택**: HTML5 / CSS3 / Vanilla JS / Node.js / Express / SQLite
> **다국어 지원**: 한국어, 日本語, 简体中文, 繁體中文

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [디렉토리 구조](#2-디렉토리-구조)
3. [프론트엔드 아키텍처](#3-프론트엔드-아키텍처)
4. [백엔드 아키텍처](#4-백엔드-아키텍처)
5. [데이터베이스 스키마](#5-데이터베이스-스키마)
6. [CSS Design System](#6-css-design-system)
7. [JavaScript 모듈](#7-javascript-모듈)
8. [API 엔드포인트 명세](#8-api-엔드포인트-명세)
9. [관리자 시스템](#9-관리자-시스템)
10. [다국어 시스템](#10-다국어-시스템)
11. [SEO 최적화](#11-seo-최적화)
12. [보안](#12-보안)
13. [배포 및 운영](#13-배포-및-운영)
14. [개발 가이드](#14-개발-가이드)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 목적
TONE'S CLINIC 명동점의 공식 웹사이트로, 다음 기능을 제공합니다:
- 클리닉 및 시술 정보 안내
- 전후사진 갤러리
- 의료진 칼럼/블로그
- 온라인 예약 시스템
- 다국어 지원 (한/일/중간체/중번체)
- CMS 기반 콘텐츠 관리

### 1.2 핵심 특징

| 특징 | 설명 |
|------|------|
| **정적 + 동적 하이브리드** | 프론트엔드는 정적 HTML, 백엔드는 Node.js API |
| **프레임워크 없음** | Vanilla JS로 구현, 빌드 과정 없음 |
| **SQLite 기반** | 가볍고 배포가 쉬운 파일 기반 DB |
| **CMS 내장** | 관리자 페이지에서 모든 콘텐츠 편집 가능 |
| **다국어 지원** | 4개 언어별 정적 페이지 생성 |
| **SEO 최적화** | 구조화된 데이터, 사이트맵, 메타 태그 |

### 1.3 브랜드 컬러 팔레트

```
Primary (Olive Green)
├── --green: #333F27         메인 색상
├── --green-light: #5C6552   밝은 버전
└── --green-dark: #212919    어두운 버전

Secondary (Cream Beige)
├── --beige: #DDCDBB         보조 색상
├── --beige-light: #E8DED0   밝은 버전
└── --beige-dark: #C4B49E    어두운 버전

Accent
├── --gold: #C1A78A          골드 액센트
├── --brown: #7C7559         브라운 텍스트
└── --brown-light: #9A9274   밝은 브라운
```

---

## 2. 디렉토리 구조

```
tones-myeongdong/
│
├── 📄 index.html                    # 메인 홈페이지 (한국어)
├── 📄 about.html                    # 클리닉 소개
├── 📄 story.html                    # 브랜딩 스토리
├── 📄 gallery.html                  # 갤러리/둘러보기
├── 📄 equipment.html                # 시술 장비 소개
├── 📄 schedule.html                 # 진료일정
├── 📄 results.html                  # 전후사진 전체보기
├── 📄 reservation.html              # 예약 페이지
├── 📄 location.html                 # 오시는 길
├── 📄 pricing.html                  # 비급여항목안내
├── 📄 privacy.html                  # 개인정보처리방침
├── 📄 terms.html                    # 이용약관
├── 📄 robots.txt                    # 검색엔진 크롤러 설정
├── 📄 sitemap.xml                   # XML 사이트맵
├── 📄 README.md                     # 프로젝트 설명
│
├── 📁 css/
│   └── style.css                    # 메인 스타일시트 (2,575줄)
│
├── 📁 js/
│   ├── main.js                      # 메인 JavaScript (551줄)
│   └── cms-render.js                # CMS 콘텐츠 동적 렌더링
│
├── 📁 images/
│   ├── hero-bg.mp4                  # 히어로 배경 비디오
│   ├── hero-bg.jpg                  # 히어로 배경 폴백 이미지
│   ├── doctor.jpg                   # 의료진 이미지
│   ├── about-clinic.jpg             # 클리닉 소개 이미지
│   ├── treatment-lifting.jpg        # 시술 카드 - 리프팅
│   ├── treatment-skincare.jpg       # 시술 카드 - 피부관리
│   ├── treatment-injection.jpg      # 시술 카드 - 주사시술
│   ├── treatment-body.jpg           # 시술 카드 - 체형관리
│   ├── column-editorial.jpg         # 칼럼 섹션 이미지
│   ├── page-hero-bg.jpg             # 서브페이지 히어로 배경
│   ├── clinic-interior.jpg          # 클리닉 인테리어
│   └── result-*-before/after.webp   # 전후사진 이미지들
│
├── 📁 treatments/                   # 시술 안내 페이지
│   ├── index.html                   # 시술 카테고리 목록
│   ├── lifting.html                 # 리프팅 카테고리
│   ├── skincare.html                # 피부관리 카테고리
│   ├── injection.html               # 주사시술 카테고리
│   ├── body.html                    # 체형관리 카테고리
│   │
│   ├── 📁 lifting/                  # 리프팅 세부 시술
│   │   ├── ulthera.html             # 울쎄라
│   │   ├── thermage.html            # 써마지
│   │   ├── hifu.html                # HIFU
│   │   └── softwave.html            # 소프트웨이브
│   │
│   ├── 📁 skincare/                 # 피부관리 세부 시술
│   │   ├── bbl.html                 # BBL
│   │   ├── laser-toning.html        # 레이저토닝
│   │   └── skin-booster.html        # 스킨부스터
│   │
│   ├── 📁 injection/                # 주사시술 세부
│   │   ├── botox.html               # 보톡스
│   │   ├── filler.html              # 필러
│   │   └── mulgwang.html            # 물광주사
│   │
│   └── 📁 body/                     # 체형관리 세부
│       ├── body-contouring.html     # 바디 컨투어링
│       └── body-lifting.html        # 바디 리프팅
│
├── 📁 column/                       # 블로그/칼럼 (정적 진입점)
│   └── index.html                   # 칼럼 목록 페이지
│
├── 📁 ja/                           # 일본어 버전
│   ├── index.html
│   ├── about.html
│   ├── story.html
│   ├── gallery.html
│   ├── equipment.html
│   ├── schedule.html
│   ├── results.html
│   ├── reservation.html
│   ├── location.html
│   ├── pricing.html
│   ├── privacy.html
│   ├── terms.html
│   └── 📁 treatments/
│       ├── lifting.html
│       ├── skincare.html
│       ├── injection.html
│       ├── body.html
│       └── 📁 lifting/, skincare/, injection/, body/
│
├── 📁 zh-cn/                        # 간체중문 버전
│   └── (ja/와 동일한 구조)
│
├── 📁 zh-tw/                        # 번체중문 버전
│   └── (ja/와 동일한 구조)
│
└── 📁 server/                       # 백엔드 (Node.js)
    ├── 📄 server.js                 # Express 서버 진입점 (82줄)
    ├── 📄 package.json              # NPM 의존성 정의
    ├── 📄 package-lock.json         # 의존성 잠금 파일
    │
    ├── 📁 db/
    │   ├── database.js              # DB 초기화 + 마이그레이션 (587줄)
    │   ├── schema.sql               # 초기 스키마 정의 (73줄)
    │   └── data.db                  # SQLite 데이터베이스 파일
    │
    ├── 📁 middleware/
    │   └── auth.js                  # JWT 인증 미들웨어 (41줄)
    │
    ├── 📁 routes/
    │   ├── api.js                   # REST API 라우트 (888줄)
    │   ├── admin.js                 # 관리자 페이지 라우트
    │   └── column.js                # 블로그/칼럼 라우트
    │
    ├── 📁 views/
    │   ├── 📁 admin/                # 관리자 EJS 템플릿
    │   │   ├── login.ejs            # 로그인 페이지
    │   │   ├── columns.ejs          # 칼럼 목록 관리
    │   │   ├── editor.ejs           # 칼럼 에디터
    │   │   ├── images.ejs           # 사이트 이미지 관리
    │   │   ├── results.ejs          # 전후사진 관리
    │   │   ├── treatment-images.ejs # 시술 이미지 관리
    │   │   ├── treatments.ejs       # 시술 콘텐츠 목록
    │   │   ├── treatment-editor.ejs # 시술 콘텐츠 에디터
    │   │   ├── settings.ejs         # 테마/사이트 설정
    │   │   ├── pages.ejs            # 페이지 목록
    │   │   ├── page-sections.ejs    # 페이지 섹션 관리
    │   │   └── section-editor.ejs   # 섹션 콘텐츠 에디터
    │   │
    │   └── 📁 column/               # 블로그 EJS 템플릿
    │       ├── list.ejs             # 칼럼 목록 페이지
    │       ├── detail.ejs           # 칼럼 상세 페이지
    │       └── rss.ejs              # RSS 피드
    │
    ├── 📁 public/
    │   └── 📁 uploads/              # 업로드된 이미지 저장
    │       └── *.webp               # WebP 변환된 이미지들
    │
    └── 📁 node_modules/             # NPM 패키지 (자동 생성)
```

---

## 3. 프론트엔드 아키텍처

### 3.1 HTML 구조 (index.html 기준)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <!-- 메타 태그: charset, viewport, SEO -->
  <!-- Open Graph 태그 -->
  <!-- 폰트: Google Fonts (Noto Sans KR, Cormorant Garamond, Inter) -->
  <!-- CSS: style.css -->
  <!-- 구조화된 데이터: schema.org/MedicalClinic -->
</head>
<body>
  <!-- HEADER: 고정 네비게이션 -->
  <header class="header" id="header">
    <!-- 로고 + 메뉴 + 언어선택 + CTA 버튼 + 햄버거 -->
  </header>

  <!-- MOBILE DRAWER: 모바일 메뉴 -->
  <div class="drawer" id="drawer">
    <!-- 오버레이 + 패널 + 링크들 -->
  </div>

  <!-- HERO: 풀스크린 히어로 섹션 -->
  <section class="hero" id="hero">
    <!-- 배경 비디오 + 오버레이 + 타이틀 + 스크롤 인디케이터 -->
  </section>

  <!-- ABOUT: 클리닉 소개 -->
  <section class="about" id="about">
    <!-- 2컬럼 그리드: 텍스트 + 이미지 -->
  </section>

  <!-- TREATMENTS: 시술 카테고리 카드 -->
  <section class="treatments" id="treatments">
    <!-- 4개 시술 카드 그리드 -->
  </section>

  <!-- TRUST: 신뢰 지표 (숫자 강조) -->
  <section class="trust" id="trust">
    <!-- 3개 신뢰 카드 -->
  </section>

  <!-- RESULTS: 전후사진 -->
  <section class="results" id="results">
    <!-- 탭 필터 + 결과 카드 그리드 -->
  </section>

  <!-- TRANSPARENCY: 투명 진료 -->
  <section class="transparency" id="transparency">
    <!-- 3개 특징 카드 -->
  </section>

  <!-- REVIEWS: 고객 후기 -->
  <section class="reviews" id="reviews">
    <!-- 가로 스크롤 리뷰 카드 -->
  </section>

  <!-- CEO MESSAGE: 원장 메시지 -->
  <section class="ceo-message" id="ceo-message">
    <!-- 인용문 스타일 메시지 -->
  </section>

  <!-- COLUMN: 블로그/칼럼 -->
  <section class="column" id="column">
    <!-- 3개 칼럼 카드 그리드 -->
  </section>

  <!-- PROMO: 프로모션/이벤트 -->
  <section class="promo" id="promo">
    <!-- 3개 프로모션 카드 -->
  </section>

  <!-- INSTAGRAM: 인스타그램 피드 -->
  <section class="instagram" id="instagram">
    <!-- 6개 인스타 그리드 -->
  </section>

  <!-- LOCATION: 오시는 길 -->
  <section class="location" id="location">
    <!-- 지도 임베드 + 상세 정보 -->
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <!-- 브랜드 + 링크 + 소셜 + 진료시간 + 법적 고지 -->
  </footer>

  <!-- FLOATING SIDEBAR -->
  <div class="floating" id="floating">
    <!-- 네이버예약 + 카톡 + 전화 + 상담 + 맨위로 -->
  </div>

  <!-- MOBILE BOTTOM TAB -->
  <nav class="mobile-tab" id="mobileTab">
    <!-- 홈 + 예약 + 전화 + 카톡 + 위치 -->
  </nav>

  <!-- JavaScript -->
  <script src="js/main.js"></script>
  <script src="js/cms-render.js"></script>
</body>
</html>
```

### 3.2 반응형 브레이크포인트

```css
/* Desktop First 접근법 */

/* 태블릿 (1023px 이하) */
@media (max-width: 1023px) {
  .header__nav { display: none; }
  .header__hamburger { display: flex; }
  .treatments__grid { grid-template-columns: 1fr 1fr; }
  .column__grid { grid-template-columns: 1fr 1fr; }
}

/* 모바일 (599px 이하) */
@media (max-width: 599px) {
  :root { --header-h: 56px; --sp-section: 56px; }
  .treatments__grid { grid-template-columns: 1fr; }
  .column__grid { grid-template-columns: 1fr; }
  .mobile-tab { display: flex; }
}
```

### 3.3 페이지별 역할

| 페이지 | 파일 | 설명 |
|--------|------|------|
| 메인 | `index.html` | 클리닉 전체 소개, 모든 섹션 포함 |
| 클리닉 소개 | `about.html` | 클리닉 철학, 의료진, 시설 안내 |
| 브랜딩 스토리 | `story.html` | 브랜드 가치와 비전 |
| 갤러리 | `gallery.html` | 클리닉 내부 사진 갤러리 |
| 시술 장비 | `equipment.html` | 보유 장비 소개 |
| 시술 카테고리 | `treatments/*.html` | 4개 카테고리별 시술 목록 |
| 시술 상세 | `treatments/**/*.html` | 개별 시술 상세 정보 |
| 전후사진 | `results.html` | 시술 전후 비교 갤러리 |
| 진료일정 | `schedule.html` | 진료 시간 및 휴무일 안내 |
| 예약 | `reservation.html` | 온라인 예약 폼 |
| 오시는 길 | `location.html` | 지도 및 교통 정보 |
| 비급여안내 | `pricing.html` | 시술 가격표 |
| 개인정보 | `privacy.html` | 개인정보처리방침 |
| 이용약관 | `terms.html` | 서비스 이용약관 |

---

## 4. 백엔드 아키텍처

### 4.1 기술 스택

```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js 4.21.0",
  "database": "better-sqlite3 11.0.0",
  "auth": {
    "password": "bcryptjs 2.4.3",
    "token": "jsonwebtoken 9.0.2"
  },
  "template": "EJS 3.1.10",
  "upload": {
    "handler": "multer 1.4.5-lts.1",
    "processor": "sharp 0.33.0"
  },
  "utils": {
    "cookie": "cookie-parser 1.4.7",
    "slug": "slugify 1.6.6"
  }
}
```

### 4.2 서버 구조 (server.js)

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// ─── 데이터베이스 초기화 ─────────────────────────
initDatabase();  // SQLite 초기화 + 마이그레이션

// ─── 미들웨어 ────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());  // CORS 헤더

// ─── 뷰 엔진 ─────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── 정적 파일 ────────────────────────────────────
app.use('/uploads', express.static('public/uploads'));
app.use('/css', express.static('../css'));
app.use('/js', express.static('../js'));
app.use('/images', express.static('../images'));

// ─── 라우트 ──────────────────────────────────────
app.use('/api', apiRoutes);     // REST API
app.use('/admin', adminRoutes); // 관리자 페이지
app.use('/column', columnRoutes); // 블로그

// ─── 정적 HTML 서빙 ───────────────────────────────
app.use(express.static('..', { extensions: ['html'] }));

// ─── 에러 핸들링 ──────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT);
```

### 4.3 라우트 구조

```
/api
├── POST   /login                    # 로그인
├── GET    /columns                  # 칼럼 목록
├── GET    /columns/:slug            # 칼럼 상세
├── POST   /columns                  # 칼럼 생성 (인증)
├── PUT    /columns/:id              # 칼럼 수정 (인증)
├── DELETE /columns/:id              # 칼럼 삭제 (인증)
├── GET    /categories               # 카테고리 목록
├── POST   /upload                   # 이미지 업로드 (인증)
├── GET    /site-images              # 사이트 이미지 목록
├── PUT    /site-images/:slot        # 사이트 이미지 변경 (인증)
├── GET    /results                  # 전후사진 목록
├── POST   /results                  # 전후사진 추가 (인증)
├── PUT    /results/:id              # 전후사진 수정 (인증)
├── DELETE /results/:id              # 전후사진 삭제 (인증)
├── GET    /treatment-images         # 시술 이미지 목록
├── PUT    /treatment-images/:id     # 시술 이미지 변경 (인증)
├── GET    /treatment-pages          # 시술 페이지 목록
├── GET    /treatment-pages/:page    # 시술 페이지 상세
├── PUT    /treatment-pages/:page    # 시술 페이지 수정 (인증)
├── GET    /settings                 # 사이트 설정
├── PUT    /settings                 # 사이트 설정 변경 (인증)
├── GET    /pages                    # CMS 페이지 목록
├── GET    /page-content/:page       # 페이지 섹션 목록
├── POST   /page-content             # 섹션 생성 (인증)
├── PUT    /page-content/:id         # 섹션 수정 (인증)
└── DELETE /page-content/:id         # 섹션 삭제 (인증)

/admin
├── GET    /login                    # 로그인 페이지
├── GET    /                         # 대시보드 (리다이렉트)
├── GET    /columns                  # 칼럼 관리
├── GET    /columns/new              # 칼럼 작성
├── GET    /columns/edit/:id         # 칼럼 수정
├── GET    /images                   # 사이트 이미지 관리
├── GET    /results                  # 전후사진 관리
├── GET    /treatment-images         # 시술 이미지 관리
├── GET    /treatments               # 시술 콘텐츠 관리
├── GET    /treatments/edit/:page    # 시술 콘텐츠 편집
├── GET    /settings                 # 테마/설정 관리
├── GET    /pages                    # 페이지 목록
├── GET    /page-sections/:slug      # 페이지 섹션 관리
└── GET    /section-editor/:id       # 섹션 편집

/column
├── GET    /                         # 칼럼 목록
├── GET    /category/:slug           # 카테고리별 칼럼
├── GET    /rss.xml                  # RSS 피드
└── GET    /:slug                    # 칼럼 상세
```

---

## 5. 데이터베이스 스키마

### 5.1 테이블 구조

```sql
-- ═══════════════════════════════════════════════════════════
-- 1. 관리자 계정
-- ═══════════════════════════════════════════════════════════
CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,          -- 로그인 ID
  password_hash TEXT NOT NULL,            -- bcrypt 해시
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 기본 계정: admin / admin1234
INSERT INTO admin_users (username, password_hash) VALUES
('admin', '$2a$10$Bz9PLHPraywuOI4wWYGWyewNP1/jI27yhQwI3nBOgVsu/Nl.Gcobm');

-- ═══════════════════════════════════════════════════════════
-- 2. 카테고리 (칼럼용)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,                     -- 표시 이름
  slug TEXT UNIQUE NOT NULL               -- URL용 슬러그
);

-- 기본 카테고리
INSERT INTO categories (name, slug) VALUES
('리프팅', 'lifting'),
('피부관리', 'skincare'),
('주사시술', 'injection'),
('체형관리', 'body'),
('진료철학', 'philosophy');

-- ═══════════════════════════════════════════════════════════
-- 3. 칼럼 (블로그 글)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE columns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,                    -- 제목
  slug TEXT UNIQUE NOT NULL,              -- URL 슬러그
  category_id INTEGER REFERENCES categories(id),
  content TEXT,                           -- 본문 (마크다운)
  thumbnail TEXT,                         -- 썸네일 URL
  seo_title TEXT,                         -- SEO 제목
  seo_desc TEXT,                          -- SEO 설명
  author TEXT DEFAULT 'OOO 원장',         -- 작성자
  status TEXT DEFAULT 'draft'             -- 'draft' | 'published'
    CHECK(status IN ('draft', 'published')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════
-- 4. 사이트 이미지 (관리자에서 변경 가능)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE site_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slot TEXT UNIQUE NOT NULL,              -- 슬롯 식별자
  label TEXT NOT NULL,                    -- 표시 이름
  image_url TEXT,                         -- 이미지 URL
  media_type TEXT DEFAULT 'image',        -- 'image' | 'video'
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 기본 슬롯 9개
INSERT INTO site_images (slot, label, image_url) VALUES
('hero-bg', '히어로 배경', '/images/hero-bg.jpg'),
('about-clinic', '소개 섹션', '/images/about-clinic.jpg'),
('treatment-lifting', '시술카드 - 리프팅', '/images/treatment-lifting.jpg'),
('treatment-skincare', '시술카드 - 피부관리', '/images/treatment-skincare.jpg'),
('treatment-injection', '시술카드 - 주사시술', '/images/treatment-injection.jpg'),
('treatment-body', '시술카드 - 체형관리', '/images/treatment-body.jpg'),
('column-editorial', '칼럼 에디토리얼', '/images/column-editorial.jpg'),
('page-hero-bg', '서브페이지 히어로', '/images/page-hero-bg.jpg'),
('clinic-interior', '클리닉 인테리어', '/images/clinic-interior.jpg');

-- ═══════════════════════════════════════════════════════════
-- 5. 전후사진
-- ═══════════════════════════════════════════════════════════
CREATE TABLE results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,                 -- 'lifting' | 'skin' | 'injection' | 'body'
  treatment_name TEXT NOT NULL,           -- 시술명
  before_image TEXT,                      -- Before 이미지 URL
  after_image TEXT,                       -- After 이미지 URL
  display_order INTEGER DEFAULT 0,        -- 표시 순서
  is_visible INTEGER DEFAULT 1,           -- 노출 여부
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════
-- 6. 시술 페이지 이미지
-- ═══════════════════════════════════════════════════════════
CREATE TABLE treatment_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page TEXT NOT NULL,                     -- 페이지 경로 (예: 'lifting/ulthera')
  slot TEXT NOT NULL,                     -- 슬롯 (예: 'equipment')
  label TEXT NOT NULL,                    -- 표시 이름
  image_url TEXT,                         -- 이미지 URL
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(page, slot)
);

-- ═══════════════════════════════════════════════════════════
-- 7. 시술 페이지 콘텐츠
-- ═══════════════════════════════════════════════════════════
CREATE TABLE treatment_pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page TEXT UNIQUE NOT NULL,              -- 페이지 경로
  page_label TEXT NOT NULL,               -- 표시 이름
  content_json TEXT DEFAULT '{}',         -- JSON 콘텐츠
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════
-- 8. 사이트 설정 (테마 등)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,                   -- 설정 키
  value TEXT,                             -- 설정 값
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 기본 테마 설정
INSERT INTO site_settings (key, value) VALUES
('theme_primary', '#333F27'),
('theme_primary_light', '#5C6552'),
('theme_primary_dark', '#212919');

-- ═══════════════════════════════════════════════════════════
-- 9. 페이지 콘텐츠 CMS (다국어)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE page_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_slug TEXT NOT NULL,                -- 페이지 식별자 (예: 'home')
  section_type TEXT NOT NULL,             -- 섹션 타입 (예: 'hero', 'about')
  section_key TEXT NOT NULL,              -- 고유 키 (예: 'home_hero')
  content_ko TEXT,                        -- 한국어 콘텐츠 (JSON)
  content_ja TEXT,                        -- 일본어 콘텐츠 (JSON)
  content_zh_cn TEXT,                     -- 간체중문 콘텐츠 (JSON)
  content_zh_tw TEXT,                     -- 번체중문 콘텐츠 (JSON)
  display_order INTEGER DEFAULT 0,        -- 표시 순서
  is_visible INTEGER DEFAULT 1,           -- 노출 여부
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(page_slug, section_key)
);

CREATE INDEX idx_page_content_slug ON page_content(page_slug);
CREATE INDEX idx_page_content_order ON page_content(page_slug, display_order);
```

### 5.2 마이그레이션 시스템

`database.js`에서 자동 마이그레이션 수행:

```javascript
function initDatabase() {
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');  // 성능 최적화
  db.pragma('foreign_keys = ON');

  // 1. 초기 스키마 적용
  if (!tableExists('admin_users')) {
    db.exec(schema);
  }

  // 2. 마이그레이션 체크 및 적용
  if (!tableExists('site_images')) {
    // Migration 1: 사이트 이미지 + 전후사진
  }
  if (!tableExists('treatment_images')) {
    // Migration 2: 시술 이미지
  }
  if (!tableExists('treatment_pages')) {
    // Migration 3: 시술 페이지 콘텐츠
  }
  if (!tableExists('site_settings')) {
    // Migration 4: 테마 설정
  }
  if (!columnExists('site_images', 'media_type')) {
    // Migration 5: 비디오 지원
  }
  if (!tableExists('page_content')) {
    // Migration 6: CMS 다국어 콘텐츠
  }
}
```

---

## 6. CSS Design System

### 6.1 CSS Variables 전체

```css
:root {
  /* ═══════════════════════════════════════════════════════ */
  /* COLOR PALETTE                                           */
  /* ═══════════════════════════════════════════════════════ */

  /* Primary (Olive Green) */
  --green: #333F27;
  --green-rgb: 51, 63, 39;
  --green-light: #5C6552;
  --green-dark: #212919;
  --green-dark-rgb: 33, 41, 25;

  /* Secondary (Cream Beige) */
  --beige: #DDCDBB;
  --beige-light: #E8DED0;
  --beige-dark: #C4B49E;

  /* Accent */
  --gold: #C1A78A;
  --brown: #7C7559;
  --brown-light: #9A9274;
  --brown-dark: #5E5940;

  /* Neutral */
  --white: #FFFFFF;
  --cream: #FAFAF9;
  --gray-50: #F9F9F9;
  --gray-100: #F0F0F0;
  --gray-200: #E5E5E5;
  --gray-300: #C8C8C8;
  --gray-400: #999999;
  --gray-500: #666666;
  --gray-600: #3A3A3A;
  --gray-700: #212121;
  --gray-800: #111111;

  /* Feedback */
  --success: #4CAF50;
  --warning: #FF9800;
  --error: #F44336;
  --info: #2196F3;

  /* ═══════════════════════════════════════════════════════ */
  /* TYPOGRAPHY                                              */
  /* ═══════════════════════════════════════════════════════ */

  --font-display: 'Cormorant Garamond', Georgia, serif;  /* 영문 Display */
  --font-en: 'Inter', 'Noto Sans KR', sans-serif;        /* 영문 Body */
  --font-kr: 'Noto Sans KR', 'Inter', sans-serif;        /* 한글 */

  /* ═══════════════════════════════════════════════════════ */
  /* SPACING (8px Grid)                                      */
  /* ═══════════════════════════════════════════════════════ */

  --sp-xs: 4px;      /* 0.5 단위 */
  --sp-sm: 8px;      /* 1 단위 */
  --sp-md: 16px;     /* 2 단위 */
  --sp-lg: 24px;     /* 3 단위 */
  --sp-xl: 32px;     /* 4 단위 */
  --sp-2xl: 48px;    /* 6 단위 */
  --sp-3xl: 64px;    /* 8 단위 */
  --sp-4xl: 96px;    /* 12 단위 */
  --sp-section: 80px; /* 섹션 간격 */

  /* ═══════════════════════════════════════════════════════ */
  /* LAYOUT                                                  */
  /* ═══════════════════════════════════════════════════════ */

  --container: 1200px;  /* 최대 컨테이너 너비 */
  --header-h: 60px;     /* 헤더 높이 */

  /* ═══════════════════════════════════════════════════════ */
  /* ANIMATION                                               */
  /* ═══════════════════════════════════════════════════════ */

  --ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);      /* 기본 이징 */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);        /* 아웃 이징 */
  --dur: 0.3s;        /* 기본 지속시간 */
  --dur-slow: 0.6s;   /* 느린 지속시간 */

  /* ═══════════════════════════════════════════════════════ */
  /* SHADOW                                                  */
  /* ═══════════════════════════════════════════════════════ */

  --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 24px rgba(var(--green-rgb),0.18);

  /* ═══════════════════════════════════════════════════════ */
  /* BORDER RADIUS                                           */
  /* ═══════════════════════════════════════════════════════ */

  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-full: 50%;
}
```

### 6.2 주요 컴포넌트 클래스

```css
/* ─── 버튼 ─────────────────────────────────────────────── */
.btn { /* 기본 버튼 스타일 */ }
.btn--primary { /* 주 버튼 (green 배경) */ }
.btn--outline { /* 아웃라인 버튼 */ }
.btn--gold { /* 골드 아웃라인 (다크 배경용) */ }

/* ─── 타이포그래피 ─────────────────────────────────────── */
.section-label { /* 섹션 라벨 (대문자, 작은 크기) */ }
.section-label--light { /* 밝은 배경용 */ }
.section-title { /* 섹션 제목 */ }
.section-title em { /* 강조 텍스트 (green) */ }
.section-title--light { /* 다크 배경용 */ }

/* ─── 헤더 ─────────────────────────────────────────────── */
.header { /* 고정 헤더 */ }
.header--scrolled { /* 스크롤 시 변화 */ }
.header--light { /* 서브페이지용 밝은 헤더 */ }
.header__logo { /* 로고 영역 */ }
.header__nav { /* 네비게이션 */ }
.header__link { /* 메뉴 링크 */ }
.header__link.active { /* 활성 메뉴 */ }
.header__dropdown { /* 드롭다운 메뉴 */ }
.header__cta { /* CTA 버튼 */ }
.header__lang { /* 언어 선택 */ }
.header__hamburger { /* 모바일 햄버거 */ }

/* ─── 모바일 드로어 ────────────────────────────────────── */
.drawer { /* 모바일 메뉴 컨테이너 */ }
.drawer.active { /* 열린 상태 */ }
.drawer__overlay { /* 배경 오버레이 */ }
.drawer__panel { /* 메뉴 패널 */ }
.drawer__link { /* 메뉴 링크 */ }

/* ─── 히어로 ───────────────────────────────────────────── */
.hero { /* 히어로 섹션 (100vh) */ }
.hero__bg { /* 배경 (이미지/비디오) */ }
.hero__overlay { /* 그라데이션 오버레이 */ }
.hero__content { /* 콘텐츠 영역 */ }
.hero__title { /* 타이틀 */ }
.hero__scroll { /* 스크롤 인디케이터 */ }

/* ─── 카드 ─────────────────────────────────────────────── */
.treatment-card { /* 시술 카드 */ }
.column-card { /* 칼럼 카드 */ }
.result-card { /* 전후사진 카드 */ }
.promo-card { /* 프로모션 카드 */ }
.review-card { /* 리뷰 카드 */ }

/* ─── 그리드 ───────────────────────────────────────────── */
.treatments__grid { /* 4열 그리드 */ }
.results__grid { /* 3열 그리드 */ }
.column__grid { /* 3열 그리드 */ }
.trust__grid { /* 3열 그리드 */ }
.promo__grid { /* 3열 그리드 */ }

/* ─── 애니메이션 ───────────────────────────────────────── */
.reveal { /* 스크롤 애니메이션 기본 */ }
.reveal.visible { /* 보이는 상태 */ }

/* ─── 플로팅 ───────────────────────────────────────────── */
.floating { /* 플로팅 사이드바 */ }
.floating.visible { /* 보이는 상태 */ }
.floating__btn { /* 플로팅 버튼 */ }
.floating__btn--naver { /* 네이버 (초록) */ }
.floating__btn--kakao { /* 카카오 (노랑) */ }

/* ─── 모바일 탭 ────────────────────────────────────────── */
.mobile-tab { /* 모바일 하단 탭바 */ }
.mobile-tab__item { /* 탭 아이템 */ }
.mobile-tab__item.active { /* 활성 탭 */ }
```

### 6.3 BEM 네이밍 컨벤션

```css
/* Block */
.treatment-card { }

/* Element */
.treatment-card__image { }
.treatment-card__content { }
.treatment-card__title { }
.treatment-card__desc { }

/* Modifier */
.treatment-card--featured { }
.treatment-card--disabled { }
```

---

## 7. JavaScript 모듈

### 7.1 main.js 구조 (551줄)

```javascript
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════ */
  /* DOM REFERENCES                                          */
  /* ═══════════════════════════════════════════════════════ */
  var header = document.getElementById('header');
  var hamburger = document.getElementById('hamburger');
  var drawer = document.getElementById('drawer');
  var floating = document.getElementById('floating');
  // ... 기타 요소들

  /* ═══════════════════════════════════════════════════════ */
  /* UTILITY FUNCTIONS                                       */
  /* ═══════════════════════════════════════════════════════ */
  function debounce(fn, ms) { /* 디바운스 */ }

  /* ═══════════════════════════════════════════════════════ */
  /* 1. SCROLL REVEAL (IntersectionObserver)                 */
  /* ═══════════════════════════════════════════════════════ */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  /* ═══════════════════════════════════════════════════════ */
  /* 2. HEADER SCROLL STATE                                  */
  /* ═══════════════════════════════════════════════════════ */
  function handleHeaderScroll() {
    var scrollY = window.pageYOffset;
    if (scrollY > 80) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  /* ═══════════════════════════════════════════════════════ */
  /* 3. FLOATING SIDEBAR                                     */
  /* ═══════════════════════════════════════════════════════ */
  function handleFloating() {
    var scrollY = window.pageYOffset;
    if (scrollY > 300) floating.classList.add('visible');
    else floating.classList.remove('visible');
  }

  /* ═══════════════════════════════════════════════════════ */
  /* 4. MOBILE DRAWER                                        */
  /* ═══════════════════════════════════════════════════════ */
  function openDrawer() { drawer.classList.add('active'); }
  function closeDrawer() { drawer.classList.remove('active'); }

  /* ═══════════════════════════════════════════════════════ */
  /* 5. SCROLL TO TOP                                        */
  /* ═══════════════════════════════════════════════════════ */
  scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ═══════════════════════════════════════════════════════ */
  /* 6. SMOOTH SCROLL FOR ANCHOR LINKS                       */
  /* ═══════════════════════════════════════════════════════ */
  function initSmoothScroll() {
    // 앵커 링크 클릭 시 부드러운 스크롤
  }

  /* ═══════════════════════════════════════════════════════ */
  /* 7. ACTIVE NAV TRACKING                                  */
  /* ═══════════════════════════════════════════════════════ */
  function updateActiveNav() {
    // 스크롤 위치에 따른 네비게이션 활성화
  }

  /* ═══════════════════════════════════════════════════════ */
  /* 8. BEFORE/AFTER TAB FILTER                              */
  /* ═══════════════════════════════════════════════════════ */
  function initTabFilter() {
    // 탭 클릭 시 카테고리 필터링 + 애니메이션
  }

  /* ═══════════════════════════════════════════════════════ */
  /* 9. HEADER DROPDOWN                                      */
  /* ═══════════════════════════════════════════════════════ */
  function initDropdowns() {
    // 드롭다운 메뉴 토글
  }

  /* ═══════════════════════════════════════════════════════ */
  /* 10. PARALLAX EFFECT (Hero)                              */
  /* ═══════════════════════════════════════════════════════ */
  function handleParallax() {
    // 히어로 패럴렉스 효과
  }

  /* ═══════════════════════════════════════════════════════ */
  /* 11. STAGGERED REVEAL FOR GRIDS                          */
  /* ═══════════════════════════════════════════════════════ */
  function initStaggeredReveal() {
    // 그리드 아이템 순차 애니메이션
  }

  /* ═══════════════════════════════════════════════════════ */
  /* 12. FAQ ACCORDION                                       */
  /* ═══════════════════════════════════════════════════════ */
  function initFaqAccordion() {
    // FAQ 아코디언 토글
  }

  /* ═══════════════════════════════════════════════════════ */
  /* 13. RESERVATION FORM                                    */
  /* ═══════════════════════════════════════════════════════ */
  function initReservationForm() {
    // 예약 폼 유효성 검사 + 제출
    var treatments = {
      lifting: ['울쎄라', '써마지', 'HIFU', '소프트웨이브'],
      skincare: ['BBL', '레이저토닝', '스킨부스터'],
      injection: ['보톡스', '필러', '물광주사'],
      body: ['바디리프팅', '체형보정']
    };
  }

  /* ═══════════════════════════════════════════════════════ */
  /* DYNAMIC SITE IMAGES (from API)                          */
  /* ═══════════════════════════════════════════════════════ */
  function loadSiteImages() {
    fetch('/api/site-images')
      .then(res => res.json())
      .then(images => {
        // 각 슬롯에 이미지/비디오 적용
      });
  }

  /* ═══════════════════════════════════════════════════════ */
  /* DYNAMIC THEME COLOR (from API)                          */
  /* ═══════════════════════════════════════════════════════ */
  function loadThemeColor() {
    fetch('/api/settings')
      .then(res => res.json())
      .then(settings => {
        // CSS 변수 동적 업데이트
        document.documentElement.style.setProperty('--green', settings.theme_primary);
      });
  }

  /* ═══════════════════════════════════════════════════════ */
  /* LANGUAGE DROPDOWN                                       */
  /* ═══════════════════════════════════════════════════════ */
  function initLangDropdown() {
    // 언어 선택 드롭다운 토글
  }

  /* ═══════════════════════════════════════════════════════ */
  /* INITIALIZATION                                          */
  /* ═══════════════════════════════════════════════════════ */
  function init() {
    initReveal();
    initSmoothScroll();
    initTabFilter();
    initDropdowns();
    initStaggeredReveal();
    initFaqAccordion();
    initReservationForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      init();
      loadThemeColor();
      loadSiteImages();
      initLangDropdown();
    });
  } else {
    init();
    loadThemeColor();
    loadSiteImages();
    initLangDropdown();
  }
})();
```

### 7.2 주요 기능 설명

| 함수 | 기능 | 사용 요소 |
|------|------|----------|
| `initReveal()` | 스크롤 시 페이드인 애니메이션 | `.reveal` 클래스 |
| `handleHeaderScroll()` | 스크롤 시 헤더 스타일 변경 | `.header--scrolled` |
| `handleFloating()` | 플로팅 버튼 표시/숨김 | `.floating.visible` |
| `openDrawer()` / `closeDrawer()` | 모바일 메뉴 토글 | `.drawer.active` |
| `initSmoothScroll()` | 앵커 링크 부드러운 스크롤 | `a[href^="#"]` |
| `updateActiveNav()` | 현재 섹션 네비 활성화 | `.header__link.active` |
| `initTabFilter()` | 전후사진 카테고리 필터 | `.results__tab` |
| `initDropdowns()` | 헤더 드롭다운 메뉴 | `.header__dropdown` |
| `handleParallax()` | 히어로 패럴렉스 | `.hero__content` |
| `initStaggeredReveal()` | 그리드 아이템 순차 표시 | `*__grid` 클래스들 |
| `initFaqAccordion()` | FAQ 아코디언 | `.faq-item` |
| `initReservationForm()` | 예약 폼 검증 | `#reservationForm` |
| `loadSiteImages()` | API에서 이미지 로드 | 동적 배경 이미지 |
| `loadThemeColor()` | API에서 테마 색상 로드 | CSS 변수 |
| `initLangDropdown()` | 언어 선택 드롭다운 | `.header__lang` |

---

## 8. API 엔드포인트 명세

### 8.1 인증 API

#### POST /api/login
로그인하여 JWT 토큰을 발급받습니다.

**Request:**
```json
{
  "username": "admin",
  "password": "admin1234"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

**Error (401):**
```json
{
  "error": "아이디 또는 비밀번호가 올바르지 않습니다."
}
```

---

### 8.2 칼럼 API

#### GET /api/columns
칼럼 목록을 조회합니다.

**Query Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| status | string | 'draft' 또는 'published' |
| category | string | 카테고리 슬러그 |
| page | number | 페이지 번호 (기본: 1) |
| limit | number | 페이지당 개수 (기본: 10) |

**Response:**
```json
{
  "columns": [
    {
      "id": 1,
      "title": "울쎄라, 기대와 현실 사이",
      "slug": "ulthera-reality",
      "category_id": 1,
      "category_name": "리프팅",
      "category_slug": "lifting",
      "content": "...",
      "thumbnail": "/uploads/xxxx.webp",
      "author": "OOO 원장",
      "status": "published",
      "created_at": "2026-02-07T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

#### GET /api/columns/:slug
단일 칼럼을 조회합니다.

#### POST /api/columns (인증 필요)
새 칼럼을 생성합니다.

#### PUT /api/columns/:id (인증 필요)
칼럼을 수정합니다.

#### DELETE /api/columns/:id (인증 필요)
칼럼을 삭제합니다.

---

### 8.3 이미지 업로드 API

#### POST /api/upload (인증 필요)
이미지 또는 비디오를 업로드합니다.

**Request:**
- Content-Type: `multipart/form-data`
- Field: `image` (파일)

**처리:**
- 이미지: Sharp로 WebP 변환 (최대 1200px, 품질 80%)
- 비디오: MP4로 변환 (ffmpeg 사용) 또는 원본 유지

**Response:**
```json
{
  "url": "/uploads/1707321234-abc123.webp",
  "filename": "1707321234-abc123.webp",
  "type": "image"  // 또는 "video"
}
```

---

### 8.4 사이트 이미지 API

#### GET /api/site-images
모든 사이트 이미지 슬롯을 조회합니다.

**Response:**
```json
[
  {
    "id": 1,
    "slot": "hero-bg",
    "label": "히어로 배경",
    "image_url": "/uploads/hero.mp4",
    "media_type": "video",
    "updated_at": "2026-02-07T10:00:00.000Z"
  },
  {
    "id": 2,
    "slot": "about-clinic",
    "label": "소개 섹션",
    "image_url": "/images/doctor.jpg",
    "media_type": "image"
  }
]
```

#### PUT /api/site-images/:slot (인증 필요)
특정 슬롯의 이미지를 변경합니다.

**Request:**
```json
{
  "image_url": "/uploads/new-hero.webp",
  "media_type": "image"
}
```

---

### 8.5 전후사진 API

#### GET /api/results
전후사진 목록을 조회합니다.

**Query Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| category | string | 'lifting', 'skin', 'injection', 'body' |

**Response:**
```json
[
  {
    "id": 1,
    "category": "lifting",
    "treatment_name": "울쎄라",
    "before_image": "/uploads/result-1-before.webp",
    "after_image": "/uploads/result-1-after.webp",
    "display_order": 1,
    "is_visible": 1,
    "created_at": "2026-02-07T10:00:00.000Z"
  }
]
```

#### POST /api/results (인증 필요)
전후사진을 추가합니다.

#### PUT /api/results/:id (인증 필요)
전후사진을 수정합니다.

#### DELETE /api/results/:id (인증 필요)
전후사진을 삭제합니다.

---

### 8.6 설정 API

#### GET /api/settings
사이트 설정을 조회합니다.

**Response:**
```json
{
  "theme_primary": "#333F27",
  "theme_primary_light": "#5C6552",
  "theme_primary_dark": "#212919"
}
```

#### PUT /api/settings (인증 필요)
설정을 변경합니다.

**Request:**
```json
{
  "theme_primary": "#5C2A2E",
  "theme_primary_light": "#753840"
}
```

---

### 8.7 페이지 콘텐츠 CMS API

#### GET /api/page-content/:page
페이지의 모든 섹션을 조회합니다.

**Query Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| lang | string | 'ko', 'ja', 'zh-cn', 'zh-tw' (기본: 'ko') |

**Response:**
```json
[
  {
    "id": 1,
    "page_slug": "home",
    "section_type": "hero",
    "section_key": "home_hero",
    "content": {
      "label": "TONE'S CLINIC MYEONGDONG",
      "title_en": "Lifting Life",
      "title_kr": "프리미엄 신뢰의 경험, 맞춤 시술의 완성",
      "description": "명동의 프리미엄 피부 전문..."
    },
    "display_order": 1,
    "is_visible": 1
  }
]
```

#### POST /api/page-content (인증 필요)
새 섹션을 생성합니다.

#### PUT /api/page-content/:id (인증 필요)
섹션을 수정합니다.

#### DELETE /api/page-content/:id (인증 필요)
섹션을 삭제합니다.

---

## 9. 관리자 시스템

### 9.1 관리자 페이지 구조

```
/admin
├── /login              → 로그인 (미인증 시)
├── /columns            → 칼럼 목록
│   ├── /new            → 칼럼 작성
│   └── /edit/:id       → 칼럼 수정
├── /images             → 사이트 이미지 관리
├── /results            → 전후사진 관리
├── /treatment-images   → 시술 이미지 관리
├── /treatments         → 시술 콘텐츠 관리
│   └── /edit/:page     → 시술 페이지 편집
├── /settings           → 테마/사이트 설정
├── /pages              → 페이지 목록
├── /page-sections/:slug → 페이지 섹션 관리
└── /section-editor/:id  → 섹션 콘텐츠 편집
```

### 9.2 관리자 기능

| 기능 | 설명 |
|------|------|
| **칼럼 관리** | 블로그 글 작성/수정/삭제, 카테고리 분류, 발행 상태 관리 |
| **사이트 이미지** | 9개 슬롯 이미지 변경, 비디오 업로드 지원 |
| **전후사진** | Before/After 이미지 업로드, 순서 변경, 노출 토글 |
| **시술 이미지** | 시술 페이지별 이미지 관리 |
| **시술 콘텐츠** | JSON 기반 시술 페이지 텍스트 편집 |
| **테마 설정** | 메인 색상 HEX 코드 변경 |
| **페이지 CMS** | 다국어 섹션별 콘텐츠 편집 |

### 9.3 기본 계정

| 항목 | 값 |
|------|-----|
| ID | `admin` |
| 비밀번호 | `admin1234` |
| 암호화 | bcrypt (10 라운드) |
| 토큰 유효기간 | 24시간 |

---

## 10. 다국어 시스템

### 10.1 지원 언어

| 코드 | 언어 | 폴더 |
|------|------|------|
| `ko` | 한국어 | `/` (루트) |
| `ja` | 日本語 | `/ja/` |
| `zh-cn` | 简体中文 | `/zh-cn/` |
| `zh-tw` | 繁體中文 | `/zh-tw/` |

### 10.2 구현 방식

1. **정적 페이지 복제**: 각 언어별로 전체 HTML 파일 복사
2. **경로 기반 라우팅**: URL 경로로 언어 구분
3. **언어 선택 UI**: 헤더 드롭다운 및 모바일 드로어에서 전환

```html
<!-- 헤더 언어 선택 -->
<div class="header__lang">
  <span>KR</span>
  <div class="header__lang-dropdown">
    <a href="index.html" class="active">한국어</a>
    <a href="./ja/">日本語</a>
    <a href="./zh-cn/">简体中文</a>
    <a href="./zh-tw/">繁體中文</a>
  </div>
</div>
```

### 10.3 CMS 다국어 콘텐츠

`page_content` 테이블에서 언어별 JSON 콘텐츠 저장:

```sql
content_ko TEXT,      -- 한국어
content_ja TEXT,      -- 일본어
content_zh_cn TEXT,   -- 간체중문
content_zh_tw TEXT    -- 번체중문
```

API 호출 시 `?lang=ja` 파라미터로 언어 지정

---

## 11. SEO 최적화

### 11.1 메타 태그

```html
<title>TONE'S CLINIC 명동점 | 울쎄라·써마지·리프팅 전문</title>
<meta name="description" content="서울 중구 명동에 위치한 TONE'S CLINIC...">
<meta name="keywords" content="명동 피부과, 리프팅, 울쎄라, 써마지...">

<!-- Open Graph -->
<meta property="og:title" content="TONE'S CLINIC 명동점">
<meta property="og:description" content="명동의 프리미엄 피부과">
<meta property="og:type" content="website">
<meta property="og:url" content="https://tones-myeongdong.com/">

<!-- Canonical URL -->
<link rel="canonical" href="https://tones-myeongdong.com/">
```

### 11.2 구조화된 데이터 (Schema.org)

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "name": "TONE'S CLINIC 명동점",
  "url": "https://tones-myeongdong.com",
  "telephone": "02-XXXX-XXXX",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "서울특별시 중구 명동길",
    "addressLocality": "서울특별시",
    "addressRegion": "중구",
    "addressCountry": "KR"
  },
  "openingHours": [
    "Mo-Th 10:00-19:00",
    "Fr 10:00-21:00",
    "Sa 10:00-16:00"
  ],
  "medicalSpecialty": "Dermatology"
}
```

### 11.3 sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tones-myeongdong.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tones-myeongdong.com/about.html</loc>
    <priority>0.8</priority>
  </url>
  <!-- ... -->
</urlset>
```

### 11.4 robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /server/
Sitemap: https://tones-myeongdong.com/sitemap.xml
```

---

## 12. 보안

### 12.1 인증 시스템

| 구성요소 | 기술 |
|---------|------|
| 비밀번호 저장 | bcrypt (10 라운드) |
| 토큰 | JWT (HS256) |
| 토큰 저장 | HTTP-only 쿠키 또는 Authorization 헤더 |
| 토큰 유효기간 | 24시간 |

### 12.2 인증 미들웨어

```javascript
function authMiddleware(req, res, next) {
  let token = null;

  // 1. Authorization 헤더에서 토큰 추출
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }

  // 2. 쿠키에서 토큰 추출 (폴백)
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: '인증이 필요합니다.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }
}
```

### 12.3 보안 고려사항

- **SQL Injection**: better-sqlite3의 prepared statements 사용
- **XSS**: 사용자 입력 이스케이프 (EJS 자동)
- **CSRF**: 관리자 페이지는 토큰 기반 인증
- **파일 업로드**: 이미지/비디오만 허용, 확장자 검증
- **Rate Limiting**: 프로덕션에서 추가 권장

---

## 13. 배포 및 운영

### 13.1 로컬 개발

```bash
# 1. 프로젝트 클론
git clone <repository-url>
cd tones-myeongdong

# 2. 서버 의존성 설치
cd server
npm install

# 3. 서버 실행
npm start
# 또는
node server.js

# 4. 브라우저에서 접속
# 메인: http://localhost:3000
# 관리자: http://localhost:3000/admin
# 칼럼: http://localhost:3000/column
```

### 13.2 프로덕션 배포

**필수 요구사항:**
- Node.js 18+
- PM2 (프로세스 매니저)
- Nginx (리버스 프록시)
- SSL 인증서 (Let's Encrypt)

**PM2 설정 (ecosystem.config.js):**
```javascript
module.exports = {
  apps: [{
    name: 'tones-myeongdong',
    script: './server/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

**Nginx 설정:**
```nginx
server {
    listen 80;
    server_name tones-myeongdong.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tones-myeongdong.com;

    ssl_certificate /etc/letsencrypt/live/tones-myeongdong.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tones-myeongdong.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 정적 파일 캐싱
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|webp|mp4)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 13.3 백업

```bash
# 데이터베이스 백업
cp server/db/data.db backups/data_$(date +%Y%m%d).db

# 업로드 이미지 백업
tar -czvf backups/uploads_$(date +%Y%m%d).tar.gz server/public/uploads/
```

---

## 14. 개발 가이드

### 14.1 브랜드명 변경

```bash
# 모든 파일에서 검색/치환
"TONE'S CLINIC" → "새 브랜드명"
"TONE'S" → "새 브랜드명"
"톤즈클리닉" → "새 브랜드명"
```

### 14.2 도메인 변경

```bash
"tones-myeongdong.com" → "새도메인.com"
```

**변경 파일:**
- `index.html` (canonical, og:url)
- `sitemap.xml`
- `robots.txt`
- 각 언어별 index.html

### 14.3 색상 변경

**방법 1: 관리자 페이지**
1. `/admin/settings` 접속
2. 테마 색상 HEX 코드 입력
3. 저장

**방법 2: CSS 직접 수정**
```css
:root {
  --green: #새색상;
  --green-light: #밝은버전;
  --green-dark: #어두운버전;
}
```

### 14.4 새 페이지 추가

1. **HTML 파일 생성**: 루트에 `새페이지.html` 생성
2. **헤더 메뉴 추가**: `index.html`의 `.header__menu`에 링크 추가
3. **모바일 메뉴 추가**: `.drawer__nav`에 링크 추가
4. **푸터 링크 추가**: `.footer__col`에 링크 추가
5. **다국어 버전**: `/ja/`, `/zh-cn/`, `/zh-tw/`에 번역본 생성
6. **sitemap.xml 업데이트**

### 14.5 새 시술 추가

1. `treatments/` 폴더에 HTML 파일 생성
2. `database.js`에서 마이그레이션 추가:
   - `treatment_images` 테이블에 슬롯 추가
   - `treatment_pages` 테이블에 페이지 추가
3. 카테고리 페이지에서 새 시술 링크 추가
4. 다국어 버전 생성

---

## 15. 파일 크기 요약

| 파일 | 줄 수 | 크기 |
|------|-------|------|
| `css/style.css` | 2,575줄 | ~75KB |
| `js/main.js` | 551줄 | ~16KB |
| `index.html` | 861줄 | ~50KB |
| `server/server.js` | 82줄 | ~2KB |
| `server/routes/api.js` | 888줄 | ~28KB |
| `server/db/database.js` | 587줄 | ~25KB |
| `server/db/schema.sql` | 73줄 | ~3KB |
| `server/middleware/auth.js` | 41줄 | ~1KB |

---

## 16. Git 커밋 히스토리

```
498bfb1 Change TONE's to TONE'S across all files
05db93a Fix missing --gold CSS variable and update header navigation
92520bd Add new pages to mobile drawer menu
0c84f36 Add multilingual versions of new pages (ja, zh-cn, zh-tw)
6e23708 Add new pages: gallery, equipment, schedule, branding story
```

---

## 17. 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT BROWSER                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                      STATIC HTML PAGES                          │   │
│   ├─────────────────────────────────────────────────────────────────┤   │
│   │  index.html    about.html    treatments/*.html    results.html  │   │
│   │  /ja/*         /zh-cn/*      /zh-tw/*            location.html  │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│   ┌──────────────────────────┴──────────────────────────────────────┐   │
│   │                      ASSETS                                     │   │
│   ├─────────────────────────────────────────────────────────────────┤   │
│   │   css/style.css           (2,575줄, CSS Variables)              │   │
│   │   js/main.js              (551줄, Vanilla JS)                   │   │
│   │   js/cms-render.js        (동적 콘텐츠 렌더링)                  │   │
│   │   images/*                (정적 이미지/비디오)                  │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP Requests
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           NODE.JS SERVER                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐   │
│   │   server.js       │  │   Express.js      │  │   Middleware      │   │
│   │   (진입점)        │──│   (4.21.0)        │──│   - auth.js       │   │
│   │                   │  │                   │  │   - cookieParser  │   │
│   └───────────────────┘  └───────────────────┘  │   - multer        │   │
│                                                 └───────────────────┘   │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                        ROUTES                                   │   │
│   ├─────────────────────────────────────────────────────────────────┤   │
│   │   /api/*          REST API (888줄)                              │   │
│   │   /admin/*        관리자 페이지 (EJS)                           │   │
│   │   /column/*       블로그 페이지 (EJS)                           │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                        VIEWS (EJS)                              │   │
│   ├─────────────────────────────────────────────────────────────────┤   │
│   │   views/admin/*        관리자 템플릿 (12개 파일)                │   │
│   │   views/column/*       블로그 템플릿 (3개 파일)                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ SQL Queries
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          SQLITE DATABASE                                │
├─────────────────────────────────────────────────────────────────────────┤
│   db/data.db  (better-sqlite3, WAL Mode)                               │
│                                                                         │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│   │ admin_users │  │ categories  │  │  columns    │  │ site_images │   │
│   │ (관리자)    │  │ (카테고리)  │  │ (칼럼/블로그)│  │ (이미지9개) │   │
│   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                                         │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│   │   results   │  │ treatment_  │  │ treatment_  │  │ site_       │   │
│   │ (전후사진)  │  │ images      │  │ pages       │  │ settings    │   │
│   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                                         │
│   ┌───────────────────────────────────────────────────────────────┐     │
│   │                     page_content                              │     │
│   │  (CMS: 다국어 섹션 콘텐츠 저장)                               │     │
│   └───────────────────────────────────────────────────────────────┘     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ File Storage
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          FILE SYSTEM                                    │
├─────────────────────────────────────────────────────────────────────────┤
│   server/public/uploads/                                               │
│   ├── *.webp           (이미지: Sharp로 변환)                          │
│   └── *.mp4            (비디오: ffmpeg 변환 또는 원본)                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

*문서 생성일: 2026-02-09*
*프로젝트: TONE'S CLINIC 명동점 홈페이지*
