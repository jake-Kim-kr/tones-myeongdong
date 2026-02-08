const jwt = require('jsonwebtoken');

const JWT_SECRET = 'da-myeongdong-secret-key';

function authMiddleware(req, res, next) {
  let token = null;

  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }

  // Fallback to cookie
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    // For API routes, return JSON error
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({ error: '인증이 필요합니다.' });
    }
    // For admin pages, redirect to login
    return res.redirect('/admin/login');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    }
    return res.redirect('/admin/login');
  }
}

module.exports = { authMiddleware, JWT_SECRET };
