const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🔒 Authentication middleware for protected routes
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ message: 'Authorization header missing' });

    // Format: "Bearer <token>"
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token)
      return res.status(401).json({ message: 'Malformed or missing token' });

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default_jwt_secret'
    );

    // Fetch the user
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user)
      return res.status(401).json({ message: 'User not found or removed' });

    // Attach user to request object
    req.user = user;

    next();
  } catch (err) {
    console.error('❌ JWT Auth Error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
