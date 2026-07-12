import db from '../config/db.js';

class MaintenanceRepository {
  async findAll({ priority } = {}) {
    let queryText = `
      SELECT r.id, r.asset_id, r.requested_by_employee_id, r.technician_id,
             r.priority, r.status, r.description, r.resolution_notes, r.cost,
             r.scheduled_start_date, r.created_at,
             a.name AS asset_name, a.asset_tag, a.serial_number,
             (req.first_name || ' ' || req.last_name) AS requested_by,
             (tech_emp.first_name || ' ' || tech_emp.last_name) AS technician_name
      FROM maintenance.requests r
      JOIN asset.assets a ON r.asset_id = a.id
      JOIN org.employees req ON r.requested_by_employee_id = req.id
      LEFT JOIN maintenance.technicians tech ON r.technician_id = tech.id
      LEFT JOIN org.employees tech_emp ON tech.employee_id = tech_emp.id
      WHERE 1=1
    `;
    const params = [];
    if (priority && priority !== 'All') {
      queryText += ` AND r.priority = $1`;
      params.push(priority.toLowerCase()); // DB uses lowercase enums: 'low', 'medium', 'high', 'critical'
    }

    queryText += ` ORDER BY r.created_at DESC`;

    const { rows } = await db.query(queryText, params);
    return rows;
  }

  async findById(id) {
    const queryText = `
      SELECT r.*, a.name AS asset_name, a.asset_tag, a.serial_number,
             (req.first_name || ' ' || req.last_name) AS requested_by,
             (tech_emp.first_name || ' ' || tech_emp.last_name) AS technician_name
      FROM maintenance.requests r
      JOIN asset.assets a ON r.asset_id = a.id
      JOIN org.employees req ON r.requested_by_employee_id = req.id
      LEFT JOIN maintenance.technicians tech ON r.technician_id = tech.id
      LEFT JOIN org.employees tech_emp ON tech.employee_id = tech_emp.id
      WHERE r.id = $1
    `;
    const { rows } = await db.query(queryText, [id]);
    return rows[0];
  }

  async create({ asset_id, requested_by_employee_id, technician_id, priority, status, description, cost, scheduled_start_date }) {
    const queryText = `
      INSERT INTO maintenance.requests (
        asset_id, requested_by_employee_id, technician_id, 
        priority, status, description, cost, scheduled_start_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const params = [
      asset_id, requested_by_employee_id, technician_id,
      priority, status, description, cost, scheduled_start_date
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
      UPDATE maintenance.requests 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await db.query(queryText, params);
    return rows[0];
  }

  async findTechnicians() {
    const queryText = `
      SELECT t.id, t.specialization, t.employee_id,
             (e.first_name || ' ' || e.last_name) AS name
      FROM maintenance.technicians t
      JOIN org.employees e ON t.employee_id = e.id
      WHERE t.is_active = TRUE
      ORDER BY e.first_name ASC
    `;
    const { rows } = await db.query(queryText);
    return rows;
  }
}

export default new MaintenanceRepository();
