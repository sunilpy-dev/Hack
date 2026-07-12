import db from '../config/db.js';

class EmployeeRepository {
  async findAll() {
    const { rows } = await db.query(
      `SELECT id, employee_number, first_name, last_name, email, phone, designation, status 
       FROM org.employees 
       WHERE is_deleted = FALSE 
       ORDER BY first_name ASC, last_name ASC`
    );
    return rows;
  }

  async findByName(firstName, lastName) {
    const { rows } = await db.query(
      `SELECT * FROM org.employees 
       WHERE first_name ILIKE $1 AND last_name ILIKE $2 AND is_deleted = FALSE`,
      [firstName, lastName]
    );
    return rows[0];
  }

  async findById(id) {
    const { rows } = await db.query(
      `SELECT * FROM org.employees WHERE id = $1 AND is_deleted = FALSE`,
      [id]
    );
    return rows[0];
  }

  async getDepartments() {
    const { rows } = await db.query(
      `SELECT id, code, name FROM org.departments ORDER BY name ASC`
    );
    return rows;
  }
}

export default new EmployeeRepository();
