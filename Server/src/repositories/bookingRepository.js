import db from '../config/db.js';

class BookingRepository {
  async findAll(employeeId = null) {
    let queryText = `
      SELECT b.id, b.resource_id, b.employee_id, b.purpose, b.status,
             lower(b.booking_period) AS start_time,
             upper(b.booking_period) AS end_time,
             r.name AS resource_name,
             rt.name AS resource_type,
             r.location,
             (e.first_name || ' ' || e.last_name) AS employee_name
      FROM resource.bookings b
      JOIN resource.resources r ON b.resource_id = r.id AND r.is_deleted = FALSE
      JOIN resource.resource_types rt ON r.resource_type_id = rt.id
      JOIN org.employees e ON b.employee_id = e.id AND e.is_deleted = FALSE
    `;
    const params = [];
    if (employeeId) {
      queryText += ` WHERE b.employee_id = $1`;
      params.push(employeeId);
    }
    queryText += ` ORDER BY start_time ASC`;
    const { rows } = await db.query(queryText, params);
    return rows;
  }

  async findResources() {
    const queryText = `
      SELECT r.id, r.name, r.location, r.capacity, r.status, r.attributes,
             rt.name AS resource_type
      FROM resource.resources r
      JOIN resource.resource_types rt ON r.resource_type_id = rt.id
      WHERE r.is_deleted = FALSE
      ORDER BY r.name ASC
    `;
    const { rows } = await db.query(queryText);
    return rows;
  }

  async create({ resource_id, employee_id, start_time, end_time, purpose, status }) {
    const queryText = `
      INSERT INTO resource.bookings (
        resource_id, employee_id, booking_period, purpose, status
      ) VALUES ($1, $2, tstzrange($3, $4, '[)'), $5, $6)
      RETURNING id, resource_id, employee_id, purpose, status, 
                lower(booking_period) AS start_time, upper(booking_period) AS end_time
    `;
    const params = [resource_id, employee_id, start_time, end_time, purpose, status || 'confirmed'];
    const { rows } = await db.query(queryText, params);
    return rows[0];
  }

  async getSpaceUtilization() {
    // Get average load / capacity utilization of resources
    const queryText = `
      SELECT r.id, r.name, r.capacity, r.location,
             COALESCE(COUNT(b.id), 0) AS booking_count
      FROM resource.resources r
      LEFT JOIN resource.bookings b ON r.id = b.resource_id AND b.status = 'confirmed'
      WHERE r.is_deleted = FALSE
      GROUP BY r.id, r.name, r.capacity, r.location
      ORDER BY booking_count DESC
    `;
    const { rows } = await db.query(queryText);
    return rows;
  }
}

export default new BookingRepository();
