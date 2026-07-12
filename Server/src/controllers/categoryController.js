import categoryService from '../services/categoryService.js';

class CategoryController {
  async getAll(req, res, next) {
    try {
      const data = await categoryService.getAllCategories();
      res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new CategoryController();
