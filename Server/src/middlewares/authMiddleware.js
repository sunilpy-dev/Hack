import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // Unauthenticated, let requireAuth check it
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'assetflow-jwt-secure-secret-key-99'
    );
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    next();
  }
};

export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication token is missing or invalid. Please login.'));
  }
  next();
};

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication token is missing or invalid.'));
    }
    
    const hasPermission = req.user.permissions && req.user.permissions.includes(permission);
    if (!hasPermission && req.user.role !== 'Admin') { // Admin override as super-user
      return next(new ForbiddenError('You do not have the required permissions to perform this action.'));
    }
    next();
  };
};

export default authMiddleware;
