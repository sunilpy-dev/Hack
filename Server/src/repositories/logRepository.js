import db from '../config/db.js';

class LogRepository {
  async findRecent(limit = 10) {
    const queryText = `
      SELECT l.id, l.action_type, l.entity_name, l.entity_id, l.created_at,
             COALESCE(e.first_name || ' ' || e.last_name, 'System') AS operator
      FROM activity.logs l
      LEFT JOIN auth.users u ON l.performed_by_user_id = u.id
      LEFT JOIN org.employees e ON u.id = e.user_id
      ORDER BY l.created_at DESC
      LIMIT $1
    `;
    const { rows } = await db.query(queryText, [limit]);
    return rows;
  }

  async log({ user_id, action_type, entity_name, entity_id, old_values, new_values, ip_address, user_agent }) {
    // Call the stored procedure: CALL activity.log_activity(...)
    // Note that standard parameters for CALL must match.
    // CALL activity.log_activity(p_user_id, p_action_type, p_entity_name, p_entity_id, p_old_values, p_new_values, p_ip_address, p_user_agent)
    await db.query(
      `CALL activity.log_activity($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        user_id || null,
        action_type,
        entity_name,
        entity_id || null,
        old_values ? JSON.stringify(old_values) : null,
        new_values ? JSON.stringify(new_values) : null,
        ip_address || null,
        user_agent || null
      ]
    );
  }
}

export default new LogRepository();
