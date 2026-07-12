import auditService from '../services/auditService.js';

class AuditController {
  async getAll(req, res, next) {
    try {
      const data = await auditService.getAllAudits();
      res.status(200).json({
        success: true,
        message: 'Audits retrieved successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async getDiscrepancies(req, res, next) {
    try {
      const data = await auditService.getDiscrepancies();
      res.status(200).json({
        success: true,
        message: 'Discrepancies retrieved successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async getDiscrepancyCount(req, res, next) {
    try {
      const count = await auditService.getDiscrepancyCount();
      res.status(200).json({
        success: true,
        message: 'Discrepancy count retrieved successfully',
        data: { count }
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuditController();
