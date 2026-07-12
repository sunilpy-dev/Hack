import authService from '../services/authService.js';

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      
      if (data.passwordResetRequired) {
        return res.status(200).json({
          success: true,
          message: 'Password reset is required on first login',
          data: {
            passwordResetRequired: true,
            userId: data.userId,
            email: data.email,
            token: data.token
          }
        });
      }

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req, res, next) {
    try {
      // Allow taking userId either from session (authenticated) or from body (if redirect reset)
      const userId = req.user ? req.user.userId : req.body.userId;
      const { oldPassword, newPassword } = req.body;
      
      const data = await authService.changePassword(userId, oldPassword, newPassword);
      res.status(200).json({
        success: true,
        message: 'Password updated successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async createEmployee(req, res, next) {
    try {
      const adminUserId = req.user.userId;
      const data = await authService.createEmployee(adminUserId, req.body);
      res.status(201).json({
        success: true,
        message: 'Employee account provisioned successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async me(req, res, next) {
    try {
      const userId = req.user.userId;
      const data = await authService.getCurrentUser(userId);
      res.status(200).json({
        success: true,
        message: 'Current user profile retrieved',
        data
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
