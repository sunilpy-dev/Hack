import categoryRepository from '../repositories/categoryRepository.js';

class CategoryService {
  async getAllCategories() {
    const cats = await categoryRepository.findAll();
    return cats.map(c => c.name === 'Monitors' ? 'Displays' : c.name);
  }
}

export default new CategoryService();
