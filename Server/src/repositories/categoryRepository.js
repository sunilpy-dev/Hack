import db from '../config/db.js';

class CategoryRepository {
  async findAll() {
    const { rows } = await db.query(
      `SELECT * FROM asset.categories WHERE is_deleted = FALSE ORDER BY name ASC`
    );
    return rows;
  }

  async findByName(name) {
    const { rows } = await db.query(
      `SELECT * FROM asset.categories WHERE name = $1 AND is_deleted = FALSE`,
      [name]
    );
    return rows[0];
  }
}

export default new CategoryRepository();
