import dashboardService from '../services/dashboardService.js';

class DashboardController {
  async getStats(req, res, next) {
    try {
      const data = await dashboardService.getStats();
      res.status(200).json({
        success: true,
        message: 'Dashboard stats retrieved successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async getLogs(req, res, next) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
      const data = await dashboardService.getRecentLogs(limit);
      res.status(200).json({
        success: true,
        message: 'Recent logs retrieved successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new DashboardController();
