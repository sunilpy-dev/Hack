import db from '../config/db.js';

class AuditRepository {
  async findCycles() {
    const queryText = `
      SELECT id, name, start_date, end_date, status, created_at
      FROM audit.cycles
      ORDER BY start_date DESC
    `;
    const { rows } = await db.query(queryText);
    return rows;
  }

  async findDiscrepancies() {
    const queryText = `
      SELECT d.id AS discrepancy_id, d.discrepancy_type, d.severity, d.resolution_status, d.comments, d.created_at,
             cy.name AS cycle_name,
             a.id AS asset_id, a.name AS asset_name, a.asset_tag,
             (aud.first_name || ' ' || aud.last_name) AS auditor_name
      FROM audit.discrepancies d
      JOIN audit.results r ON d.result_id = r.id
      JOIN audit.assignments ass ON r.assignment_id = ass.id
      JOIN audit.cycles cy ON ass.cycle_id = cy.id
      JOIN asset.assets a ON r.asset_id = a.id
      JOIN org.employees aud ON ass.auditor_employee_id = aud.id
      ORDER BY d.created_at DESC
    `;
    const { rows } = await db.query(queryText);
    return rows;
  }

  async getOutstandingDiscrepancyCount() {
    const queryText = `
      SELECT COUNT(*) AS count 
      FROM audit.discrepancies 
      WHERE resolution_status IN ('open', 'under_review')
    `;
    const { rows } = await db.query(queryText);
    return parseInt(rows[0].count, 10);
  }
}

export default new AuditRepository();
