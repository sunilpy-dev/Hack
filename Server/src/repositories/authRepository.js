import db from '../config/db.js';

class AuthRepository {
  async findByEmail(email) {
    const queryText = `
      SELECT u.id, u.email, u.password_hash, u.is_active, 
             u.failed_login_attempts, u.locked_until, 
             u.password_reset_required, u.password_changed_at,
             r.name AS role_name, r.id AS role_id,
             COALESCE(
               ARRAY_REMOVE(ARRAY_AGG(p.name), NULL), 
               '{}'
             ) AS permissions
      FROM auth.users u
      LEFT JOIN auth.user_roles ur ON u.id = ur.user_id
      LEFT JOIN auth.roles r ON ur.role_id = r.id
      LEFT JOIN auth.role_permissions rp ON r.id = rp.role_id
      LEFT JOIN auth.permissions p ON rp.permission_id = p.id
      WHERE u.email = $1 AND u.is_deleted = FALSE
      GROUP BY u.id, r.id
    `;
    const { rows } = await db.query(queryText, [email]);
    return rows[0];
  }

  async findById(id) {
    const queryText = `
      SELECT u.id, u.email, u.is_active, 
             u.failed_login_attempts, u.locked_until, 
             u.password_reset_required, u.password_changed_at,
             r.name AS role_name, r.id AS role_id,
             COALESCE(
               ARRAY_REMOVE(ARRAY_AGG(p.name), NULL), 
               '{}'
             ) AS permissions
      FROM auth.users u
      LEFT JOIN auth.user_roles ur ON u.id = ur.user_id
      LEFT JOIN auth.roles r ON ur.role_id = r.id
      LEFT JOIN auth.role_permissions rp ON r.id = rp.role_id
      LEFT JOIN auth.permissions p ON rp.permission_id = p.id
      WHERE u.id = $1 AND u.is_deleted = FALSE
      GROUP BY u.id, r.id
    `;
    const { rows } = await db.query(queryText, [id]);
    return rows[0];
  }

  async findRoleByName(roleName) {
    const queryText = `SELECT * FROM auth.roles WHERE name = $1`;
    const { rows } = await db.query(queryText, [roleName]);
    return rows[0];
  }

  async incrementFailedAttempts(userId, lockedUntil = null) {
    const queryText = `
      UPDATE auth.users 
      SET failed_login_attempts = failed_login_attempts + 1,
          locked_until = COALESCE($2, locked_until)
      WHERE id = $1
      RETURNING failed_login_attempts, locked_until
    `;
    const { rows } = await db.query(queryText, [userId, lockedUntil]);
    return rows[0];
  }

  async resetFailedAttempts(userId) {
    const queryText = `
      UPDATE auth.users 
      SET failed_login_attempts = 0,
          locked_until = NULL
      WHERE id = $1
    `;
    await db.query(queryText, [userId]);
  }

  async updatePassword(userId, passwordHash, passwordResetRequired = false, client = db) {
    const queryText = `
      UPDATE auth.users 
      SET password_hash = $2,
          password_reset_required = $3,
          password_changed_at = CURRENT_TIMESTAMP,
          failed_login_attempts = 0,
          locked_until = NULL
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await client.query(queryText, [userId, passwordHash, passwordResetRequired]);
    return rows[0];
  }

  async getPasswordHistory(userId, limit = 3) {
    const queryText = `
      SELECT password_hash FROM auth.password_history 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `;
    const { rows } = await db.query(queryText, [userId, limit]);
    return rows.map(r => r.password_hash);
  }

  async addPasswordHistory(userId, passwordHash, client = db) {
    const queryText = `
      INSERT INTO auth.password_history (user_id, password_hash)
      VALUES ($1, $2)
    `;
    await client.query(queryText, [userId, passwordHash]);
  }

  async createUser(email, passwordHash, passwordResetRequired = true, client = db) {
    const queryText = `
      INSERT INTO auth.users (email, password_hash, password_reset_required)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await client.query(queryText, [email, passwordHash, passwordResetRequired]);
    return rows[0];
  }

  async assignRole(userId, roleId, client = db) {
    const queryText = `
      INSERT INTO auth.user_roles (user_id, role_id)
      VALUES ($1, $2)
    `;
    await client.query(queryText, [userId, roleId]);
  }

  async createEmployeeProfile(userId, departmentId, employeeNumber, firstName, lastName, email, designation, client = db) {
    const queryText = `
      INSERT INTO org.employees (user_id, department_id, employee_number, first_name, last_name, email, designation, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
      RETURNING *
    `;
    const params = [userId, departmentId, employeeNumber, firstName, lastName, email, designation];
    const { rows } = await client.query(queryText, params);
    return rows[0];
  }

  async findNotificationTypeByName(typeName) {
    const queryText = `SELECT * FROM notification.notification_types WHERE name = $1`;
    const { rows } = await db.query(queryText, [typeName]);
    return rows[0];
  }

  async createNotification(typeId, title, body, priority, linkUrl, client = db) {
    const queryText = `
      INSERT INTO notification.notifications (type_id, title, body, priority, link_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const { rows } = await client.query(queryText, [typeId, title, body, priority, linkUrl]);
    return rows[0];
  }

  async createRecipient(notificationId, employeeId, client = db) {
    const queryText = `
      INSERT INTO notification.recipients (notification_id, employee_id, is_read)
      VALUES ($1, $2, FALSE)
    `;
    await client.query(queryText, [notificationId, employeeId]);
  }

  async getEmployeeByUserId(userId) {
    const queryText = `SELECT * FROM org.employees WHERE user_id = $1 AND is_deleted = FALSE`;
    const { rows } = await db.query(queryText, [userId]);
    return rows[0];
  }

  async findDepartmentById(deptId) {
    const queryText = `SELECT * FROM org.departments WHERE id = $1 AND is_deleted = FALSE`;
    const { rows } = await db.query(queryText, [deptId]);
    return rows[0];
  }

  async findEmployeeByEmail(email) {
    const queryText = `SELECT * FROM org.employees WHERE email = $1 AND is_deleted = FALSE`;
    const { rows } = await db.query(queryText, [email]);
    return rows[0];
  }

  async findEmployeeByPhone(phone) {
    const queryText = `SELECT * FROM org.employees WHERE phone = $1 AND is_deleted = FALSE`;
    const { rows } = await db.query(queryText, [phone]);
    return rows[0];
  }
}

export default new AuthRepository();
