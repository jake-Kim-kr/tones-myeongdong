const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

// ─── GET /column/rss.xml ────────────────────────────────────
// Must be defined before /:slug to avoid conflict
router.get('/rss.xml', (req, res) => {
  const db = getDb();
  const columns = db.prepare(`
    SELECT c.*, cat.name as category_name
    FROM columns c
    LEFT JOIN categories cat ON c.category_id = cat.id
    WHERE c.status = 'published'
    ORDER BY c.created_at DESC
    LIMIT 50
  `).all();

  res.set('Content-Type', 'application/rss+xml; charset=utf-8');
  res.render('column/rss', { columns });
});

// ─── GET /column/ ───────────────────────────────────────────
router.get('/', (req, res) => {
  const db = getDb();
  const page = parseInt(req.query.page) || 1;
  const limit = 12;
  const offset = (page - 1) * limit;

  const categories = db.prepare('SELECT * FROM categories ORDER BY id').all();

  const countRow = db.prepare(
    "SELECT COUNT(*) as total FROM columns WHERE status = 'published'"
  ).get();

  const columns = db.prepare(`
    SELECT c.*, cat.name as category_name, cat.slug as category_slug
    FROM columns c
    LEFT JOIN categories cat ON c.category_id = cat.id
    WHERE c.status = 'published'
    ORDER BY c.created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset);

  const totalPages = Math.ceil(countRow.total / limit);

  res.render('column/list', {
    columns,
    categories,
    currentCategory: null,
    pagination: { page, totalPages, total: countRow.total }
  });
});

// ─── GET /column/category/:slug ─────────────────────────────
router.get('/category/:slug', (req, res) => {
  const db = getDb();
  const page = parseInt(req.query.page) || 1;
  const limit = 12;
  const offset = (page - 1) * limit;

  const categories = db.prepare('SELECT * FROM categories ORDER BY id').all();
  const currentCategory = db.prepare('SELECT * FROM categories WHERE slug = ?').get(req.params.slug);

  if (!currentCategory) {
    return res.redirect('/column/');
  }

  const countRow = db.prepare(
    "SELECT COUNT(*) as total FROM columns WHERE status = 'published' AND category_id = ?"
  ).get(currentCategory.id);

  const columns = db.prepare(`
    SELECT c.*, cat.name as category_name, cat.slug as category_slug
    FROM columns c
    LEFT JOIN categories cat ON c.category_id = cat.id
    WHERE c.status = 'published' AND c.category_id = ?
    ORDER BY c.created_at DESC
    LIMIT ? OFFSET ?
  `).all(currentCategory.id, limit, offset);

  const totalPages = Math.ceil(countRow.total / limit);

  res.render('column/list', {
    columns,
    categories,
    currentCategory,
    pagination: { page, totalPages, total: countRow.total }
  });
});

// ─── GET /column/:slug ──────────────────────────────────────
router.get('/:slug', (req, res, next) => {
  // Skip static file requests
  if (req.params.slug.includes('.')) {
    return next();
  }
  const db = getDb();
  const column = db.prepare(`
    SELECT c.*, cat.name as category_name, cat.slug as category_slug
    FROM columns c
    LEFT JOIN categories cat ON c.category_id = cat.id
    WHERE c.slug = ? AND c.status = 'published'
  `).get(req.params.slug);

  if (!column) {
    return res.status(404).render('column/detail', { column: null, related: [] });
  }

  // Get related columns (same category, excluding current)
  const related = db.prepare(`
    SELECT c.*, cat.name as category_name, cat.slug as category_slug
    FROM columns c
    LEFT JOIN categories cat ON c.category_id = cat.id
    WHERE c.status = 'published' AND c.id != ? AND c.category_id = ?
    ORDER BY c.created_at DESC
    LIMIT 3
  `).all(column.id, column.category_id);

  res.render('column/detail', { column, related });
});

module.exports = router;
