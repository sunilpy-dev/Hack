import auditRepository from '../repositories/auditRepository.js';

class AuditService {
  async getAllAudits() {
    const cycles = await auditRepository.findCycles();
    return cycles.map(c => {
      let status = 'SCHEDULED';
      if (c.status === 'completed') status = 'COMPLETED';
      else if (c.status === 'in_progress') status = 'IN PROGRESS';
      else if (c.status === 'cancelled') status = 'CANCELLED';

      return {
        id: c.id.substring(0, 11).toUpperCase(),
        name: c.name,
        date: new Date(c.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status,
        compliance: c.status === 'completed' ? '99.2%' : c.status === 'in_progress' ? '85.4%' : '—'
      };
    });
  }

  async getDiscrepancies() {
    return auditRepository.findDiscrepancies();
  }

  async getDiscrepancyCount() {
    return auditRepository.getOutstandingDiscrepancyCount();
  }
}

export default new AuditService();
