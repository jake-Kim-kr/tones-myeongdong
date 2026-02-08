const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { initDatabase } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Initialize Database ────────────────────────────────────
initDatabase();

// ─── Middleware ──────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ─── View Engine ─────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Static Files ────────────────────────────────────────────
// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Serve main site static files from parent directory
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'js')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

// ─── Routes ─────────────────────────────────────────────────
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');
const columnRoutes = require('./routes/column');

app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/column', columnRoutes);

// Serve main site HTML files
app.use(express.static(path.join(__dirname, '..'), {
  extensions: ['html']
}));

// ─── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head><meta charset="UTF-8"><title>404 - 페이지를 찾을 수 없습니다</title>
    <style>body{font-family:'Noto Sans KR',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#FAFAF9;color:#172617;}
    .wrap{text-align:center}.wrap h1{font-size:72px;margin:0;opacity:0.3}.wrap p{margin:16px 0;color:#666}
    .wrap a{color:#172617;text-decoration:underline}</style></head>
    <body><div class="wrap"><h1>404</h1><p>페이지를 찾을 수 없습니다.</p><a href="/">홈으로 돌아가기</a></div></body>
    </html>
  `);
});

// ─── Error Handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
});

// ─── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`DA피부과 명동점 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`메인 사이트: http://localhost:${PORT}`);
  console.log(`관리자 페이지: http://localhost:${PORT}/admin`);
  console.log(`칼럼 페이지: http://localhost:${PORT}/column`);
});
