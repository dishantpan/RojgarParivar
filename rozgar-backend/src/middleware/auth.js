const jwt = require('jsonwebtoken');
const Worker = require('../models/Worker');
const Hirer  = require('../models/Hirer');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. Please login.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user in either Worker or Hirer collection
    if (decoded.role === 'worker') {
      req.user = await Worker.findById(decoded.id);
    } else if (decoded.role === 'hirer') {
      req.user = await Hirer.findById(decoded.id);
    } else if (decoded.role === 'admin') {
      req.user = { id: 'admin', role: 'admin' };
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired. Please login again.' });
  }
};

// Only allow specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `Access denied. ${req.user.role} cannot do this.` });
    }
    next();
  };
};

module.exports = { protect, authorize };
