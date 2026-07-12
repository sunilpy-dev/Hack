import maintenanceRepository from '../repositories/maintenanceRepository.js';
import assetRepository from '../repositories/assetRepository.js';
import employeeRepository from '../repositories/employeeRepository.js';
import logRepository from '../repositories/logRepository.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

const mapPriorityToFrontend = (priority) => {
  if (['critical', 'high'].includes(priority)) return 'HIGH';
  if (priority === 'medium') return 'MEDIUM';
  return 'LOW';
};

const mapPriorityToDb = (priority) => {
  if (priority === 'HIGH') return 'high';
  if (priority === 'MEDIUM') return 'medium';
  return 'low';
};

const formatDate = (dateStr) => {
  if (!dateStr) return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

class MaintenanceService {
  async getAllWorkOrders(filters) {
    const list = await maintenanceRepository.findAll(filters);
    return list.map(req => ({
      id: req.id,
      requestNumber: `REQ-${req.id.slice(0, 6).toUpperCase()}`,
      title: req.description.split('\n')[0] || 'Maintenance Order',
      priority: mapPriorityToFrontend(req.priority),
      status: req.status,
      due: formatDate(req.scheduled_start_date || req.created_at),
      assignedTo: req.technician_name || 'Unassigned',
      description: req.description
    }));
  }

  async createWorkOrder(data) {
    const { title, priority, assignedTo, due, description } = data;

    if (!title) throw new ValidationError('Title is required');

    // 1. Resolve placeholder asset (since frontend form does not let user pick an asset)
    const assets = await assetRepository.findAll({});
    if (assets.length === 0) throw new ValidationError('No assets available in system');
    const asset_id = assets[0].asset_id;

    // 2. Requestor is default Admin
    const requested_by_employee_id = 'f1111111-1111-1111-1111-111111111111'; // Admin employee

    // 3. Find technician by name
    const techniciansList = await maintenanceRepository.findTechnicians();
    let technician_id = null;
    if (assignedTo && assignedTo !== 'Unassigned') {
      const match = techniciansList.find(t => t.name.toLowerCase().includes(assignedTo.toLowerCase()));
      if (match) {
        technician_id = match.id;
      } else if (techniciansList.length > 0) {
        technician_id = techniciansList[0].id; // fallback
      }
    } else if (techniciansList.length > 0) {
      technician_id = techniciansList[0].id;
    }

    // 4. Map priority & status
    const dbPriority = mapPriorityToDb(priority || 'HIGH');
    const dbStatus = 'pending'; // start as pending
    const fullDescription = `${title}\n\n${description || ''}`;

    const scheduledDate = due ? new Date(due) : new Date();
    const validScheduledDate = isNaN(scheduledDate.getTime()) ? new Date() : scheduledDate;

    const created = await maintenanceRepository.create({
      asset_id,
      requested_by_employee_id,
      technician_id,
      priority: dbPriority,
      status: dbStatus,
      description: fullDescription,
      cost: 0.00,
      scheduled_start_date: validScheduledDate
    });

    // Log activity
    await logRepository.log({
      action_type: 'INSERT',
      entity_name: 'maintenance.requests',
      entity_id: created.id,
      new_values: created
    });

    return {
      id: created.id,
      title: title,
      priority: priority || 'HIGH',
      status: created.status,
      due: formatDate(created.scheduled_start_date),
      assignedTo: assignedTo || 'Bob Builder',
      description: description || ''
    };
  }

  async moveWorkOrder(id, targetStatus) {
    const existing = await maintenanceRepository.findById(id);
    if (!existing) throw new NotFoundError('Work order not found');

    const fieldsToUpdate = { status: targetStatus };

    // If status moves to 'assigned' or further, verify technician is set
    if (['assigned', 'in_progress', 'resolved', 'closed'].includes(targetStatus) && !existing.technician_id) {
      // Auto-assign first technician if none assigned
      const techniciansList = await maintenanceRepository.findTechnicians();
      if (techniciansList.length > 0) {
        fieldsToUpdate.technician_id = techniciansList[0].id;
      } else {
        throw new ValidationError('No active technician available to assign');
      }
    }

    const updated = await maintenanceRepository.update(id, fieldsToUpdate);

    // Log activity
    await logRepository.log({
      action_type: 'UPDATE',
      entity_name: 'maintenance.requests',
      entity_id: id,
      old_values: existing,
      new_values: updated
    });

    return updated;
  }

  async generatePreventativeWorkOrders() {
    const assets = await assetRepository.findAll({});
    if (assets.length === 0) return [];

    const techniciansList = await maintenanceRepository.findTechnicians();
    const techId = techniciansList.length > 0 ? techniciansList[0].id : null;
    const requestorId = 'f1111111-1111-1111-1111-111111111111';

    const generated = [];
    for (let i = 0; i < 12; i++) {
      const asset = assets[i % assets.length];
      const created = await maintenanceRepository.create({
        asset_id: asset.asset_id,
        requested_by_employee_id: requestorId,
        technician_id: techId,
        priority: i % 3 === 0 ? 'high' : i % 2 === 0 ? 'medium' : 'low',
        status: 'pending',
        description: `Preventative Maintenance #${100 + i}\nAuto-generated preventative check from AI Insight log analytics.`,
        cost: 0.00,
        scheduled_start_date: new Date(Date.now() + (i * 24 * 60 * 60 * 1000))
      });
      generated.push(created);
    }

    // Log bulk insert activity
    await logRepository.log({
      action_type: 'INSERT',
      entity_name: 'maintenance.requests',
      new_values: { count: 12 }
    });

    return generated;
  }

  async getTechnicians() {
    return maintenanceRepository.findTechnicians();
  }
}

export default new MaintenanceService();
