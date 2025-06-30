const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  console.log('auth middleware called, headers:', req.headers);
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    console.log('No token, authorization denied');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Token is not valid:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 