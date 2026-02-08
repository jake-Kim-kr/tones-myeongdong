const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getDb } = require('../db/database');

// ─── GET /admin ─────────────────────────────────────────────
router.get('/', (req, res) => {
  // Check if user has a valid token cookie
  const token = req.cookies && req.cookies.token;
  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const jwt = require('jsonwebtoken');
    const { JWT_SECRET } = require('../middleware/auth');
    jwt.verify(token, JWT_SECRET);
    return res.redirect('/admin/columns');
  } catch {
    return res.redirect('/admin/login');
  }
});

// ─── GET /admin/login ───────────────────────────────────────
router.get('/login', (req, res) => {
  res.render('admin/login');
});

// ─── GET /admin/columns ─────────────────────────────────────
router.get('/columns', authMiddleware, (req, res) => {
  const db = getDb();
  const columns = db.prepare(`
    SELECT c.*, cat.name as category_name
    FROM columns c
    LEFT JOIN categories cat ON c.category_id = cat.id
    ORDER BY c.created_at DESC
  `).all();

  res.render('admin/columns', { columns });
});

// ─── GET /admin/columns/new ─────────────────────────────────
router.get('/columns/new', authMiddleware, (req, res) => {
  const db = getDb();
  const categories = db.prepare('SELECT * FROM categories ORDER BY id').all();
  res.render('admin/editor', { column: null, categories });
});

// ─── GET /admin/columns/edit/:id ────────────────────────────
router.get('/columns/edit/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const column = db.prepare('SELECT * FROM columns WHERE id = ?').get(req.params.id);
  if (!column) {
    return res.redirect('/admin/columns');
  }
  const categories = db.prepare('SELECT * FROM categories ORDER BY id').all();
  res.render('admin/editor', { column, categories });
});

// ─── GET /admin/images ──────────────────────────────────────
router.get('/images', authMiddleware, (req, res) => {
  const db = getDb();
  const images = db.prepare('SELECT * FROM site_images ORDER BY id').all();
  res.render('admin/images', { images });
});

// ─── GET /admin/results ─────────────────────────────────────
router.get('/results', authMiddleware, (req, res) => {
  const db = getDb();
  const results = db.prepare('SELECT * FROM results ORDER BY display_order ASC, created_at DESC').all();
  res.render('admin/results', { results });
});

// ─── GET /admin/treatment-images ─────────────────────────────
router.get('/treatment-images', authMiddleware, (req, res) => {
  const db = getDb();
  const images = db.prepare('SELECT * FROM treatment_images ORDER BY page, id').all();
  // Group by page
  const grouped = {};
  images.forEach(img => {
    if (!grouped[img.page]) grouped[img.page] = [];
    grouped[img.page].push(img);
  });
  res.render('admin/treatment-images', { grouped });
});

// ─── GET /admin/treatments ──────────────────────────────────
router.get('/treatments', authMiddleware, (req, res) => {
  const db = getDb();
  const pages = db.prepare('SELECT * FROM treatment_pages ORDER BY id').all();
  res.render('admin/treatments', { pages });
});

// ─── GET /admin/treatments/edit/:page ───────────────────────
router.get('/treatments/edit/:page(*)', authMiddleware, (req, res) => {
  const db = getDb();
  const page = db.prepare('SELECT * FROM treatment_pages WHERE page = ?').get(req.params.page);
  if (!page) {
    return res.redirect('/admin/treatments');
  }
  res.render('admin/treatment-editor', { page });
});

// ─── GET /admin/settings ────────────────────────────────────
router.get('/settings', authMiddleware, (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM site_settings').all();
  const settings = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  res.render('admin/settings', { settings });
});

// ═══════════════════════════════════════════════════════════
// PAGE CONTENT CMS ADMIN ROUTES
// ═══════════════════════════════════════════════════════════

// Page metadata
const PAGE_INFO = {
  home: { label: '홈', path: '/' },
  about: { label: '소개', path: '/about.html' },
  results: { label: '전후사진', path: '/results.html' },
  location: { label: '오시는 길', path: '/location.html' },
  reservation: { label: '예약', path: '/reservation.html' }
};

// Section type metadata
const SECTION_TYPES = {
  hero: { label: '히어로 배너', icon: '🎯' },
  about: { label: '소개', icon: '📝' },
  treatments: { label: '시술안내', icon: '💉' },
  trust: { label: '신뢰 지표', icon: '📊' },
  results: { label: '전후사진', icon: '📸' },
  column: { label: '칼럼', icon: '📰' },
  promo: { label: '프로모션', icon: '🎁' },
  location: { label: '오시는 길', icon: '📍' },
  cta: { label: 'CTA 배너', icon: '📢' },
  custom: { label: '커스텀', icon: '⚙️' }
};

// ─── GET /admin/pages ────────────────────────────────────────
router.get('/pages', authMiddleware, (req, res) => {
  const db = getDb();

  // Get section counts per page
  const counts = db.prepare(`
    SELECT page_slug, COUNT(*) as section_count
    FROM page_content
    GROUP BY page_slug
  `).all();

  const countMap = {};
  counts.forEach(c => { countMap[c.page_slug] = c.section_count; });

  // Build pages list
  const pages = Object.keys(PAGE_INFO).map(slug => ({
    slug,
    label: PAGE_INFO[slug].label,
    path: PAGE_INFO[slug].path,
    section_count: countMap[slug] || 0
  }));

  res.render('admin/pages', { pages, PAGE_INFO });
});

// ─── GET /admin/pages/:page ──────────────────────────────────
router.get('/pages/:page', authMiddleware, (req, res) => {
  const db = getDb();
  const { page } = req.params;

  if (!PAGE_INFO[page]) {
    return res.redirect('/admin/pages');
  }

  const sections = db.prepare(`
    SELECT * FROM page_content
    WHERE page_slug = ?
    ORDER BY display_order ASC
  `).all(page);

  res.render('admin/page-sections', {
    page,
    pageInfo: PAGE_INFO[page],
    sections,
    SECTION_TYPES,
    PAGE_INFO
  });
});

// ─── GET /admin/pages/:page/section/new ──────────────────────
router.get('/pages/:page/section/new', authMiddleware, (req, res) => {
  const { page } = req.params;

  if (!PAGE_INFO[page]) {
    return res.redirect('/admin/pages');
  }

  res.render('admin/section-editor', {
    page,
    pageInfo: PAGE_INFO[page],
    section: null,
    isNew: true,
    SECTION_TYPES,
    PAGE_INFO
  });
});

// ─── GET /admin/pages/:page/section/:id ──────────────────────
router.get('/pages/:page/section/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const { page, id } = req.params;

  if (!PAGE_INFO[page]) {
    return res.redirect('/admin/pages');
  }

  const section = db.prepare('SELECT * FROM page_content WHERE id = ? AND page_slug = ?').get(id, page);
  if (!section) {
    return res.redirect(`/admin/pages/${page}`);
  }

  res.render('admin/section-editor', {
    page,
    pageInfo: PAGE_INFO[page],
    section,
    isNew: false,
    SECTION_TYPES,
    PAGE_INFO
  });
});

module.exports = router;
