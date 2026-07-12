import { AppError } from '../utils/errors.js';

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error internally for auditing
  console.error(`[ERROR] ${req.method} ${req.url} - Status: ${err.statusCode} - Message: ${err.message}`);
  if (err.statusCode === 500) {
    console.error(err.stack);
  }

  // Consistent response format
  return res.status(err.statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};
