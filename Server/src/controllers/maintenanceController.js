import maintenanceService from '../services/maintenanceService.js';

class MaintenanceController {
  async getAll(req, res, next) {
    try {
      const { priority } = req.query;
      const data = await maintenanceService.getAllWorkOrders({ priority });
      res.status(200).json({
        success: true,
        message: 'Work orders retrieved successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = await maintenanceService.createWorkOrder(req.body);
      res.status(201).json({
        success: true,
        message: 'Work order created successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async move(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const data = await maintenanceService.moveWorkOrder(id, status);
      res.status(200).json({
        success: true,
        message: 'Work order status updated successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async generate(req, res, next) {
    try {
      const data = await maintenanceService.generatePreventativeWorkOrders();
      res.status(201).json({
        success: true,
        message: 'Generated 12 preventative work orders',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async getTechnicians(req, res, next) {
    try {
      const data = await maintenanceService.getTechnicians();
      res.status(200).json({
        success: true,
        message: 'Technicians retrieved successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new MaintenanceController();
