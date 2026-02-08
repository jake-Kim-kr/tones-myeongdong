const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');
const { getDb } = require('../db/database');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

// Upload directory
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config - use disk storage for large video files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const rand = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${rand}-temp${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1.5 * 1024 * 1024 * 1024 }, // 1.5GB (for video)
  fileFilter: (req, file, cb) => {
    const imageTypes = /jpeg|jpg|png|gif|webp|bmp/;
    const videoTypes = /mp4|mov|webm|avi/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const isImage = imageTypes.test(ext);
    const isVideo = videoTypes.test(ext) || file.mimetype.startsWith('video/');
    if (isImage || isVideo) {
      cb(null, true);
    } else {
      cb(new Error('이미지 또는 동영상 파일만 업로드 가능합니다.'));
    }
  }
});

// ─── POST /api/login ────────────────────────────────────────
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: '아이디와 비밀번호를 입력해주세요.' });
    }

    const db = getDb();
    const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
    if (!user) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── GET /api/columns ───────────────────────────────────────
router.get('/columns', (req, res) => {
  try {
    const db = getDb();
    const { status, category, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = [];
    let params = [];

    if (status) {
      where.push('c.status = ?');
      params.push(status);
    }
    if (category) {
      where.push('cat.slug = ?');
      params.push(category);
    }

    const whereClause = where.length > 0 ? 'WHERE ' + where.join(' AND ') : '';

    const countRow = db.prepare(`
      SELECT COUNT(*) as total FROM columns c
      LEFT JOIN categories cat ON c.category_id = cat.id
      ${whereClause}
    `).get(...params);

    const columns = db.prepare(`
      SELECT c.*, cat.name as category_name, cat.slug as category_slug
      FROM columns c
      LEFT JOIN categories cat ON c.category_id = cat.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    res.json({
      columns,
      pagination: {
        total: countRow.total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countRow.total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Get columns error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── GET /api/columns/:slug ─────────────────────────────────
router.get('/columns/:slug', (req, res) => {
  try {
    const db = getDb();
    const column = db.prepare(`
      SELECT c.*, cat.name as category_name, cat.slug as category_slug
      FROM columns c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.slug = ?
    `).get(req.params.slug);

    if (!column) {
      return res.status(404).json({ error: '칼럼을 찾을 수 없습니다.' });
    }

    res.json(column);
  } catch (err) {
    console.error('Get column error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── POST /api/columns ──────────────────────────────────────
router.post('/columns', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const { title, category_id, content, thumbnail, seo_title, seo_desc, author, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: '제목을 입력해주세요.' });
    }

    // Generate slug from title
    let slug = slugify(title, { lower: true, strict: true });
    if (!slug) {
      slug = 'column-' + Date.now();
    }

    // Ensure unique slug
    const existing = db.prepare('SELECT id FROM columns WHERE slug = ?').get(slug);
    if (existing) {
      slug = slug + '-' + Date.now();
    }

    const result = db.prepare(`
      INSERT INTO columns (title, slug, category_id, content, thumbnail, seo_title, seo_desc, author, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title,
      slug,
      category_id || null,
      content || '',
      thumbnail || null,
      seo_title || title,
      seo_desc || '',
      author || 'OOO 원장',
      status || 'draft'
    );

    const newColumn = db.prepare('SELECT * FROM columns WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newColumn);
  } catch (err) {
    console.error('Create column error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── PUT /api/columns/:id ───────────────────────────────────
router.put('/columns/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const { title, category_id, content, thumbnail, seo_title, seo_desc, author, status } = req.body;
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM columns WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: '칼럼을 찾을 수 없습니다.' });
    }

    db.prepare(`
      UPDATE columns
      SET title = ?, category_id = ?, content = ?, thumbnail = ?,
          seo_title = ?, seo_desc = ?, author = ?, status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title || existing.title,
      category_id !== undefined ? category_id : existing.category_id,
      content !== undefined ? content : existing.content,
      thumbnail !== undefined ? thumbnail : existing.thumbnail,
      seo_title || existing.seo_title,
      seo_desc !== undefined ? seo_desc : existing.seo_desc,
      author || existing.author,
      status || existing.status,
      id
    );

    const updated = db.prepare(`
      SELECT c.*, cat.name as category_name, cat.slug as category_slug
      FROM columns c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.id = ?
    `).get(id);

    res.json(updated);
  } catch (err) {
    console.error('Update column error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── DELETE /api/columns/:id ────────────────────────────────
router.delete('/columns/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM columns WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: '칼럼을 찾을 수 없습니다.' });
    }

    db.prepare('DELETE FROM columns WHERE id = ?').run(id);
    res.json({ message: '칼럼이 삭제되었습니다.' });
  } catch (err) {
    console.error('Delete column error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── GET /api/categories ────────────────────────────────────
router.get('/categories', (req, res) => {
  try {
    const db = getDb();
    const categories = db.prepare('SELECT * FROM categories ORDER BY id').all();
    res.json(categories);
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── POST /api/upload ───────────────────────────────────────
router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '파일을 선택해주세요.' });
    }

    const isVideo = req.file.mimetype.startsWith('video/');
    const tempPath = req.file.path; // diskStorage saves file here
    const origExt = path.extname(req.file.originalname).toLowerCase();
    const baseName = path.basename(tempPath, path.extname(tempPath)).replace('-temp', '');

    if (isVideo) {
      const filename = `${baseName}.mp4`;
      const outputPath = path.join(uploadDir, filename);

      if (origExt === '.mp4') {
        // Already MP4, just rename
        fs.renameSync(tempPath, outputPath);
        const url = `/uploads/${filename}`;
        res.json({ url, filename, type: 'video' });
      } else {
        // Convert MOV/etc to MP4 using ffmpeg
        const { execSync } = require('child_process');
        try {
          execSync(`ffmpeg -i "${tempPath}" -c:v libx264 -preset fast -crf 23 -c:a aac -movflags +faststart -y "${outputPath}"`, { timeout: 300000 });
          fs.unlinkSync(tempPath); // Remove temp file
          const url = `/uploads/${filename}`;
          res.json({ url, filename, type: 'video' });
        } catch (convErr) {
          console.error('Video conversion error:', convErr.message);
          // Fallback: serve original file as-is
          const fallbackName = `${baseName}${origExt}`;
          const fallbackPath = path.join(uploadDir, fallbackName);
          fs.renameSync(tempPath, fallbackPath);
          const url = `/uploads/${fallbackName}`;
          res.json({ url, filename: fallbackName, type: 'video' });
        }
      }
    } else {
      // Convert image to webp
      const filename = `${baseName}.webp`;
      const outputPath = path.join(uploadDir, filename);
      await sharp(tempPath)
        .resize(1200, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
      fs.unlinkSync(tempPath); // Remove temp file
      const url = `/uploads/${filename}`;
      res.json({ url, filename, type: 'image' });
    }
  } catch (err) {
    console.error('Upload error:', err);
    // Clean up temp file if exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: '업로드에 실패했습니다.' });
  }
});

// ─── GET /api/site-images ────────────────────────────────────
router.get('/site-images', (req, res) => {
  try {
    const db = getDb();
    const images = db.prepare('SELECT * FROM site_images ORDER BY id').all();
    res.json(images);
  } catch (err) {
    console.error('Get site images error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── PUT /api/site-images/:slot ─────────────────────────────
router.put('/site-images/:slot', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const { slot } = req.params;
    const { image_url, media_type } = req.body;

    const existing = db.prepare('SELECT * FROM site_images WHERE slot = ?').get(slot);
    if (!existing) {
      return res.status(404).json({ error: '이미지 슬롯을 찾을 수 없습니다.' });
    }

    db.prepare('UPDATE site_images SET image_url = ?, media_type = ?, updated_at = CURRENT_TIMESTAMP WHERE slot = ?')
      .run(image_url, media_type || 'image', slot);
    const updated = db.prepare('SELECT * FROM site_images WHERE slot = ?').get(slot);
    res.json(updated);
  } catch (err) {
    console.error('Update site image error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── GET /api/results ───────────────────────────────────────
router.get('/results', (req, res) => {
  try {
    const db = getDb();
    const { category } = req.query;
    let query = 'SELECT * FROM results';
    let params = [];

    if (category && category !== 'all') {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY display_order ASC, created_at DESC';
    const results = db.prepare(query).all(...params);
    res.json(results);
  } catch (err) {
    console.error('Get results error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── POST /api/results ──────────────────────────────────────
router.post('/results', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const { category, treatment_name, before_image, after_image, display_order } = req.body;

    if (!category || !treatment_name) {
      return res.status(400).json({ error: '카테고리와 시술명을 입력해주세요.' });
    }

    const result = db.prepare(`
      INSERT INTO results (category, treatment_name, before_image, after_image, display_order)
      VALUES (?, ?, ?, ?, ?)
    `).run(category, treatment_name, before_image || null, after_image || null, display_order || 0);

    const newResult = db.prepare('SELECT * FROM results WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newResult);
  } catch (err) {
    console.error('Create result error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── PUT /api/results/:id ───────────────────────────────────
router.put('/results/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { category, treatment_name, before_image, after_image, display_order, is_visible } = req.body;

    const existing = db.prepare('SELECT * FROM results WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: '전후사진을 찾을 수 없습니다.' });
    }

    db.prepare(`
      UPDATE results SET category = ?, treatment_name = ?, before_image = ?, after_image = ?,
      display_order = ?, is_visible = ? WHERE id = ?
    `).run(
      category || existing.category,
      treatment_name || existing.treatment_name,
      before_image !== undefined ? before_image : existing.before_image,
      after_image !== undefined ? after_image : existing.after_image,
      display_order !== undefined ? display_order : existing.display_order,
      is_visible !== undefined ? is_visible : existing.is_visible,
      id
    );

    const updated = db.prepare('SELECT * FROM results WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    console.error('Update result error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── DELETE /api/results/:id ────────────────────────────────
router.delete('/results/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM results WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: '전후사진을 찾을 수 없습니다.' });
    }

    db.prepare('DELETE FROM results WHERE id = ?').run(id);
    res.json({ message: '전후사진이 삭제되었습니다.' });
  } catch (err) {
    console.error('Delete result error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── GET /api/treatment-images ───────────────────────────────
router.get('/treatment-images', (req, res) => {
  try {
    const db = getDb();
    const { page } = req.query;
    let images;
    if (page) {
      images = db.prepare('SELECT * FROM treatment_images WHERE page = ? ORDER BY id').all(page);
    } else {
      images = db.prepare('SELECT * FROM treatment_images ORDER BY page, id').all();
    }
    res.json(images);
  } catch (err) {
    console.error('Get treatment images error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── PUT /api/treatment-images/:id ──────────────────────────
router.put('/treatment-images/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { image_url } = req.body;

    const existing = db.prepare('SELECT * FROM treatment_images WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: '이미지 슬롯을 찾을 수 없습니다.' });
    }

    db.prepare('UPDATE treatment_images SET image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(image_url, id);
    const updated = db.prepare('SELECT * FROM treatment_images WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    console.error('Update treatment image error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── GET /api/treatment-pages ────────────────────────────────
router.get('/treatment-pages', (req, res) => {
  try {
    const db = getDb();
    const pages = db.prepare('SELECT * FROM treatment_pages ORDER BY id').all();
    res.json(pages);
  } catch (err) {
    console.error('Get treatment pages error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── GET /api/treatment-pages/:page ─────────────────────────
router.get('/treatment-pages/:page(*)', (req, res) => {
  try {
    const db = getDb();
    const page = db.prepare('SELECT * FROM treatment_pages WHERE page = ?').get(req.params.page);
    if (!page) {
      return res.status(404).json({ error: '페이지를 찾을 수 없습니다.' });
    }
    res.json(page);
  } catch (err) {
    console.error('Get treatment page error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── PUT /api/treatment-pages/:page ─────────────────────────
router.put('/treatment-pages/:page(*)', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const { page } = req.params;
    const { content_json } = req.body;

    const existing = db.prepare('SELECT * FROM treatment_pages WHERE page = ?').get(page);
    if (!existing) {
      return res.status(404).json({ error: '페이지를 찾을 수 없습니다.' });
    }

    db.prepare('UPDATE treatment_pages SET content_json = ?, updated_at = CURRENT_TIMESTAMP WHERE page = ?')
      .run(typeof content_json === 'string' ? content_json : JSON.stringify(content_json), page);

    const updated = db.prepare('SELECT * FROM treatment_pages WHERE page = ?').get(page);
    res.json(updated);
  } catch (err) {
    console.error('Update treatment page error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── GET /api/settings ──────────────────────────────────────
router.get('/settings', (req, res) => {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM site_settings').all();
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    res.json(settings);
  } catch (err) {
    console.error('Get settings error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── PUT /api/settings ──────────────────────────────────────
router.put('/settings', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const updates = req.body; // { key: value, ... }

    const upsert = db.prepare('INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP');
    Object.keys(updates).forEach(key => {
      upsert.run(key, updates[key], updates[key]);
    });

    const rows = db.prepare('SELECT * FROM site_settings').all();
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    res.json(settings);
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ═══════════════════════════════════════════════════════════
// PAGE CONTENT CMS API
// ═══════════════════════════════════════════════════════════

// ─── GET /api/page-content/:page ─────────────────────────────
// Get all sections for a page (with optional language)
router.get('/page-content/:page', (req, res) => {
  try {
    const db = getDb();
    const { page } = req.params;
    const { lang = 'ko' } = req.query;

    const sections = db.prepare(`
      SELECT id, page_slug, section_type, section_key,
             content_ko, content_ja, content_zh_cn, content_zh_tw,
             display_order, is_visible, created_at, updated_at
      FROM page_content
      WHERE page_slug = ?
      ORDER BY display_order ASC
    `).all(page);

    // Map content based on language
    const langMap = { ko: 'content_ko', ja: 'content_ja', 'zh-cn': 'content_zh_cn', 'zh-tw': 'content_zh_tw' };
    const contentField = langMap[lang] || 'content_ko';

    const result = sections.map(s => {
      let content = null;
      try {
        const rawContent = s[contentField] || s.content_ko;
        content = rawContent ? JSON.parse(rawContent) : null;
      } catch (e) {
        content = null;
      }
      return {
        id: s.id,
        page_slug: s.page_slug,
        section_type: s.section_type,
        section_key: s.section_key,
        content,
        display_order: s.display_order,
        is_visible: s.is_visible,
        created_at: s.created_at,
        updated_at: s.updated_at
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Get page content error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── GET /api/page-content/:page/:section_key ────────────────
// Get a specific section
router.get('/page-content/:page/:section_key', (req, res) => {
  try {
    const db = getDb();
    const { page, section_key } = req.params;
    const { lang = 'ko' } = req.query;

    const section = db.prepare(`
      SELECT * FROM page_content
      WHERE page_slug = ? AND section_key = ?
    `).get(page, section_key);

    if (!section) {
      return res.status(404).json({ error: '섹션을 찾을 수 없습니다.' });
    }

    const langMap = { ko: 'content_ko', ja: 'content_ja', 'zh-cn': 'content_zh_cn', 'zh-tw': 'content_zh_tw' };
    const contentField = langMap[lang] || 'content_ko';

    let content = null;
    try {
      const rawContent = section[contentField] || section.content_ko;
      content = rawContent ? JSON.parse(rawContent) : null;
    } catch (e) {
      content = null;
    }

    res.json({
      id: section.id,
      page_slug: section.page_slug,
      section_type: section.section_type,
      section_key: section.section_key,
      content,
      content_ko: section.content_ko,
      content_ja: section.content_ja,
      content_zh_cn: section.content_zh_cn,
      content_zh_tw: section.content_zh_tw,
      display_order: section.display_order,
      is_visible: section.is_visible
    });
  } catch (err) {
    console.error('Get section error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── GET /api/page-content-by-id/:id ─────────────────────────
// Get section by ID (for admin editing)
router.get('/page-content-by-id/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const section = db.prepare('SELECT * FROM page_content WHERE id = ?').get(id);
    if (!section) {
      return res.status(404).json({ error: '섹션을 찾을 수 없습니다.' });
    }

    res.json(section);
  } catch (err) {
    console.error('Get section by id error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── POST /api/page-content ──────────────────────────────────
// Create a new section
router.post('/page-content', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const { page_slug, section_type, section_key, content_ko, content_ja, content_zh_cn, content_zh_tw, display_order, is_visible } = req.body;

    if (!page_slug || !section_type || !section_key) {
      return res.status(400).json({ error: 'page_slug, section_type, section_key는 필수입니다.' });
    }

    // Get max display_order for this page
    const maxOrder = db.prepare('SELECT MAX(display_order) as max_order FROM page_content WHERE page_slug = ?').get(page_slug);
    const order = display_order !== undefined ? display_order : (maxOrder.max_order || 0) + 1;

    const result = db.prepare(`
      INSERT INTO page_content (page_slug, section_type, section_key, content_ko, content_ja, content_zh_cn, content_zh_tw, display_order, is_visible)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      page_slug,
      section_type,
      section_key,
      typeof content_ko === 'string' ? content_ko : JSON.stringify(content_ko || {}),
      typeof content_ja === 'string' ? content_ja : JSON.stringify(content_ja || null),
      typeof content_zh_cn === 'string' ? content_zh_cn : JSON.stringify(content_zh_cn || null),
      typeof content_zh_tw === 'string' ? content_zh_tw : JSON.stringify(content_zh_tw || null),
      order,
      is_visible !== undefined ? is_visible : 1
    );

    const newSection = db.prepare('SELECT * FROM page_content WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newSection);
  } catch (err) {
    console.error('Create section error:', err);
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: '이미 동일한 section_key가 존재합니다.' });
    }
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── PUT /api/page-content/:id ───────────────────────────────
// Update a section
router.put('/page-content/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { section_type, content_ko, content_ja, content_zh_cn, content_zh_tw, display_order, is_visible } = req.body;

    const existing = db.prepare('SELECT * FROM page_content WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: '섹션을 찾을 수 없습니다.' });
    }

    db.prepare(`
      UPDATE page_content
      SET section_type = ?,
          content_ko = ?,
          content_ja = ?,
          content_zh_cn = ?,
          content_zh_tw = ?,
          display_order = ?,
          is_visible = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      section_type !== undefined ? section_type : existing.section_type,
      content_ko !== undefined ? (typeof content_ko === 'string' ? content_ko : JSON.stringify(content_ko)) : existing.content_ko,
      content_ja !== undefined ? (typeof content_ja === 'string' ? content_ja : JSON.stringify(content_ja)) : existing.content_ja,
      content_zh_cn !== undefined ? (typeof content_zh_cn === 'string' ? content_zh_cn : JSON.stringify(content_zh_cn)) : existing.content_zh_cn,
      content_zh_tw !== undefined ? (typeof content_zh_tw === 'string' ? content_zh_tw : JSON.stringify(content_zh_tw)) : existing.content_zh_tw,
      display_order !== undefined ? display_order : existing.display_order,
      is_visible !== undefined ? is_visible : existing.is_visible,
      id
    );

    const updated = db.prepare('SELECT * FROM page_content WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    console.error('Update section error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── DELETE /api/page-content/:id ────────────────────────────
// Delete a section
router.delete('/page-content/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM page_content WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: '섹션을 찾을 수 없습니다.' });
    }

    db.prepare('DELETE FROM page_content WHERE id = ?').run(id);
    res.json({ message: '섹션이 삭제되었습니다.' });
  } catch (err) {
    console.error('Delete section error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── PUT /api/page-content/reorder ───────────────────────────
// Reorder sections
router.put('/page-content-reorder', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const { items } = req.body; // [{ id, display_order }, ...]

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'items 배열이 필요합니다.' });
    }

    const updateStmt = db.prepare('UPDATE page_content SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');

    const transaction = db.transaction(() => {
      items.forEach(item => {
        updateStmt.run(item.display_order, item.id);
      });
    });

    transaction();

    res.json({ message: '순서가 변경되었습니다.' });
  } catch (err) {
    console.error('Reorder sections error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// ─── GET /api/pages ──────────────────────────────────────────
// Get list of all pages with section counts
router.get('/pages', (req, res) => {
  try {
    const db = getDb();
    const pages = db.prepare(`
      SELECT page_slug, COUNT(*) as section_count
      FROM page_content
      GROUP BY page_slug
      ORDER BY page_slug
    `).all();

    // Define page metadata
    const pageInfo = {
      home: { label: '홈', path: '/' },
      about: { label: '소개', path: '/about.html' },
      results: { label: '전후사진', path: '/results.html' },
      location: { label: '오시는 길', path: '/location.html' },
      reservation: { label: '예약', path: '/reservation.html' }
    };

    const result = pages.map(p => ({
      slug: p.page_slug,
      label: pageInfo[p.page_slug]?.label || p.page_slug,
      path: pageInfo[p.page_slug]?.path || `/${p.page_slug}.html`,
      section_count: p.section_count
    }));

    // Add pages that might not have any sections yet
    Object.keys(pageInfo).forEach(slug => {
      if (!result.find(r => r.slug === slug)) {
        result.push({
          slug,
          label: pageInfo[slug].label,
          path: pageInfo[slug].path,
          section_count: 0
        });
      }
    });

    res.json(result);
  } catch (err) {
    console.error('Get pages error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
