-- DA피부과 명동점 Database Schema

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS columns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  content TEXT,
  thumbnail TEXT,
  seo_title TEXT,
  seo_desc TEXT,
  author TEXT DEFAULT 'OOO 원장',
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Default categories
INSERT OR IGNORE INTO categories (name, slug) VALUES ('리프팅', 'lifting');
INSERT OR IGNORE INTO categories (name, slug) VALUES ('피부관리', 'skincare');
INSERT OR IGNORE INTO categories (name, slug) VALUES ('주사시술', 'injection');
INSERT OR IGNORE INTO categories (name, slug) VALUES ('체형관리', 'body');
INSERT OR IGNORE INTO categories (name, slug) VALUES ('진료철학', 'philosophy');

-- Site images (manageable from admin)
CREATE TABLE IF NOT EXISTS site_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slot TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  image_url TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Before/After results
CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  treatment_name TEXT NOT NULL,
  before_image TEXT,
  after_image TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Default admin user (password: admin1234)
INSERT OR IGNORE INTO admin_users (username, password_hash)
VALUES ('admin', '$2a$10$Bz9PLHPraywuOI4wWYGWyewNP1/jI27yhQwI3nBOgVsu/Nl.Gcobm');

-- Default site image slots
INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('hero-bg', '히어로 배경', '/images/hero-bg.jpg');
INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('about-clinic', '소개 섹션', '/images/about-clinic.jpg');
INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('treatment-lifting', '시술카드 - 리프팅', '/images/treatment-lifting.jpg');
INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('treatment-skincare', '시술카드 - 피부관리', '/images/treatment-skincare.jpg');
INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('treatment-injection', '시술카드 - 주사시술', '/images/treatment-injection.jpg');
INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('treatment-body', '시술카드 - 체형관리', '/images/treatment-body.jpg');
INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('column-editorial', '칼럼 에디토리얼', '/images/column-editorial.jpg');
INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('page-hero-bg', '서브페이지 히어로', '/images/page-hero-bg.jpg');
INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('clinic-interior', '클리닉 인테리어', '/images/clinic-interior.jpg');
