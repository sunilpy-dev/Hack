import { AppError } from '../utils/errors.js';

export default (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log the raw technical error internally for auditing
  console.error(`[ERROR] ${req.method} ${req.url} - Status: ${statusCode} - Message: ${err.message}`);
  if (statusCode === 500) {
    console.error(err.stack);
  }

  // Consistent, user-friendly response format
  let friendlyMessage = err.message || 'Internal Server Error';

  // Sanitize PostgreSQL internal database errors from reaching the user interface
  if (statusCode === 500 || !err.statusCode) {
    friendlyMessage = 'An unexpected internal server error occurred. Please contact your system administrator.';

    if (err.message) {
      const msg = err.message.toLowerCase();
      if (msg.includes('violates foreign key') || msg.includes('violates check constraint') || err.code === '23503' || err.code === '23514') {
        friendlyMessage = 'Unable to complete employee provisioning because notification configuration is incomplete. Please contact your administrator.';
      } else if (msg.includes('duplicate key') || err.code === '23505') {
        friendlyMessage = 'A record with the specified unique values already exists in the system.';
      }
    }
  }

  return res.status(statusCode).json({
    success: false,
    message: friendlyMessage
  });
};
