import db from '../config/db.js';
import logRepository from '../repositories/logRepository.js';
import auditRepository from '../repositories/auditRepository.js';

class DashboardService {
  async getStats() {
    const assetsCountRes = await db.query(`SELECT COUNT(*) AS count FROM asset.assets WHERE is_deleted = FALSE`);
    const totalAssets = parseInt(assetsCountRes.rows[0].count, 10);

    const allocatedCountRes = await db.query(
      `SELECT COUNT(*) AS count FROM asset.assets WHERE current_status = 'allocated' AND is_deleted = FALSE`
    );
    const allocatedAssets = parseInt(allocatedCountRes.rows[0].count, 10);

    const repairCountRes = await db.query(
      `SELECT COUNT(*) AS count FROM asset.assets WHERE current_status = 'under_maintenance' AND is_deleted = FALSE`
    );
    const inRepairAssets = parseInt(repairCountRes.rows[0].count, 10);

    const activeMaintRes = await db.query(
      `SELECT COUNT(*) AS count FROM maintenance.requests WHERE status IN ('pending', 'approved', 'assigned', 'in_progress')`
    );
    const activeMaintenance = parseInt(activeMaintRes.rows[0].count, 10);

    // Calculate utilization rate
    const utilizationRate = totalAssets > 0 ? Math.round((allocatedAssets / totalAssets) * 100) : 0;

    // Calculate average health score from conditions
    const healthRes = await db.query(`
      SELECT condition, COUNT(*) AS count 
      FROM asset.assets 
      WHERE is_deleted = FALSE 
      GROUP BY condition
    `);
    
    let totalScore = 0;
    let countedAssets = 0;
    
    const conditionScores = {
      'new': 100,
      'excellent': 95,
      'good': 85,
      'fair': 70,
      'poor': 50,
      'damaged': 30,
      'non_functional': 10
    };

    healthRes.rows.forEach(r => {
      const score = conditionScores[r.condition] || 100;
      const count = parseInt(r.count, 10);
      totalScore += score * count;
      countedAssets += count;
    });

    const averageHealth = countedAssets > 0 ? Math.round(totalScore / countedAssets) : 90;

    // Outstanding compliance items
    const outstandingDiscrepancies = await auditRepository.getOutstandingDiscrepancyCount();

    // Maintenance risk level
    let maintenanceRisk = 'Low';
    if (activeMaintenance > 10) maintenanceRisk = 'Critical';
    else if (activeMaintenance > 5) maintenanceRisk = 'Medium';

    return {
      totalAssets,
      activeAssets: totalAssets - inRepairAssets,
      inRepairAssets,
      utilizationRate,
      maintenanceRisk,
      activeMaintenance,
      averageHealth,
      outstandingDiscrepancies,
      efficiencyIndex: 92, // Benchmark default
      auditCompliance: 98  // Default compliance standing
    };
  }

  async getRecentLogs(limit = 10) {
    const rawLogs = await logRepository.findRecent(limit);
    return rawLogs.map(l => {
      // Map entity statuses to styling classes
      let status = 'ACTIVE';
      let color = 'bg-blue-50 text-blue-700 border-blue-200';
      if (l.action_type === 'DELETE') {
        status = 'DECOMMISSIONED';
        color = 'bg-gray-100 text-gray-700 border-gray-200';
      } else if (l.action_type === 'UPDATE' && l.entity_name === 'maintenance.requests') {
        status = 'FAULT DETECTED';
        color = 'bg-red-50 text-red-700 border-red-200';
      }

      // Format timestamp to HH:MM:SS
      const time = new Date(l.created_at).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      return {
        id: `#AS-${l.id.toString().padStart(4, '0')}`,
        status,
        operator: l.operator,
        time,
        statusColor: color
      };
    });
  }
}

export default new DashboardService();
