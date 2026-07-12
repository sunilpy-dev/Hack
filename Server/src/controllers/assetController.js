import assetService from '../services/assetService.js';
import { ForbiddenError } from '../utils/errors.js';

class AssetController {
  async getAll(req, res, next) {
    try {
      const { search, category, status, location, health } = req.query;
      const filters = { search, category, status, location, health };
      
      // If user is a regular employee, restrict query to their checked-out assets
      if (req.user && req.user.role === 'Employee') {
        filters.employee_id = req.user.employeeId;
      }
      
      const data = await assetService.getAllAssets(filters);
      res.status(200).json({
        success: true,
        message: 'Assets retrieved successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await assetService.getAssetById(id);

      // If user is a regular employee, verify they own the checked-out asset
      if (req.user && req.user.role === 'Employee') {
        if (data.employeeId !== req.user.employeeId) {
          throw new ForbiddenError('You are not authorized to view this asset profile.');
        }
      }

      res.status(200).json({
        success: true,
        message: 'Asset retrieved successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = await assetService.createAsset(req.body);
      res.status(201).json({
        success: true,
        message: 'Asset created successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = await assetService.updateAsset(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Asset updated successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await assetService.deleteAsset(id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new AssetController();
