import assetService from '../services/assetService.js';

class AssetController {
  async getAll(req, res, next) {
    try {
      const { search, category, status, location, health } = req.query;
      const data = await assetService.getAllAssets({ search, category, status, location, health });
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
