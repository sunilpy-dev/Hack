import db from '../config/db.js';

class AssetRepository {
  async findAll({ search, category, status, location, health, employee_id }) {
    let queryText = `SELECT * FROM asset.v_asset_details WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (search) {
      queryText += ` AND (asset_name ILIKE $${paramIndex} OR serial_number ILIKE $${paramIndex} OR employee_name ILIKE $${paramIndex} OR asset_tag ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (category && category !== 'All') {
      // Map frontend 'Displays' to DB 'Monitors'
      const dbCategory = category === 'Displays' ? 'Monitors' : category;
      queryText += ` AND category_name = $${paramIndex}`;
      params.push(dbCategory);
      paramIndex++;
    }

    if (location && location !== 'All') {
      queryText += ` AND location = $${paramIndex}`;
      params.push(location);
      paramIndex++;
    }

    // Filter by DB status after status mapping
    if (status && status !== 'All') {
      if (status === 'ACTIVE') {
        queryText += ` AND current_status IN ('available', 'allocated', 'reserved')`;
      } else if (status === 'IN REPAIR') {
        queryText += ` AND current_status = 'under_maintenance'`;
      } else if (status === 'DECOMMISSIONED') {
        queryText += ` AND current_status IN ('lost', 'retired', 'disposed')`;
      }
    }

    if (employee_id) {
      queryText += ` AND employee_id = $${paramIndex}`;
      params.push(employee_id);
      paramIndex++;
    }

    queryText += ` ORDER BY asset_name ASC`;

    const { rows } = await db.query(queryText, params);
    return rows;
  }

  async findById(id) {
    const { rows } = await db.query(
      `SELECT * FROM asset.v_asset_details WHERE asset_id = $1`,
      [id]
    );
    return rows[0];
  }

  async findBySerialNumber(sn) {
    const { rows } = await db.query(
      `SELECT * FROM asset.v_asset_details WHERE serial_number = $1`,
      [sn]
    );
    return rows[0];
  }

  async create({ category_id, name, asset_tag, serial_number, qr_code, purchase_cost, purchase_date, warranty_expiry_date, condition, current_status, location }) {
    const queryText = `
      INSERT INTO asset.assets (
        category_id, name, asset_tag, serial_number, qr_code, 
        purchase_cost, purchase_date, warranty_expiry_date, 
        condition, current_status, location
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const params = [
      category_id, name, asset_tag, serial_number, qr_code,
      purchase_cost, purchase_date, warranty_expiry_date,
      condition, current_status, location
    ];
    const { rows } = await db.query(queryText, params);
    return rows[0];
  }

  async update(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return this.findById(id);

    const setClause = keys.map((key, idx) => `"${key}" = $${idx + 2}`).join(', ');
    const params = [id, ...Object.values(fields)];

    const queryText = `
      UPDATE asset.assets 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND is_deleted = FALSE
      RETURNING *
    `;
    const { rows } = await db.query(queryText, params);
    return rows[0];
  }

  async softDelete(id) {
    const queryText = `
      UPDATE asset.assets 
      SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP, current_status = 'retired'
      WHERE id = $1 AND is_deleted = FALSE
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [id]);
    return rows[0];
  }

  // Create allocation
  async allocateAsset(assetId, employeeId, approvedByEmployeeId, expectedReturnDate) {
    // Check if there is an active allocation
    await db.query(
      `UPDATE allocation.asset_allocations SET status = 'returned', returned_date = CURRENT_TIMESTAMP, condition_at_return = 'good' WHERE asset_id = $1 AND status = 'active'`,
      [assetId]
    );

    const { rows } = await db.query(
      `INSERT INTO allocation.asset_allocations (asset_id, employee_id, approved_by_employee_id, expected_return_date, status)
       VALUES ($1, $2, $3, $4, 'active') RETURNING *`,
      [assetId, employeeId, approvedByEmployeeId, expectedReturnDate]
    );
    return rows[0];
  }

  // Return allocation
  async deallocateAsset(assetId, condition) {
    const dbCondition = condition || 'good';
    const { rows } = await db.query(
      `UPDATE allocation.asset_allocations 
       SET status = 'returned', returned_date = CURRENT_TIMESTAMP, condition_at_return = $2
       WHERE asset_id = $1 AND status = 'active'
       RETURNING *`,
      [assetId, dbCondition]
    );
    return rows[0];
  }
}

export default new AssetRepository();
