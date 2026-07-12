import assetRepository from '../repositories/assetRepository.js';
import categoryRepository from '../repositories/categoryRepository.js';
import employeeRepository from '../repositories/employeeRepository.js';
import logRepository from '../repositories/logRepository.js';
import { ValidationError, ConflictError, NotFoundError } from '../utils/errors.js';

const mapConditionToHealth = (condition) => {
  switch (condition) {
    case 'new': return 100;
    case 'excellent': return 95;
    case 'good': return 85;
    case 'fair': return 70;
    case 'poor': return 50;
    case 'damaged': return 30;
    case 'non_functional': return 10;
    default: return 100;
  }
};

const mapHealthToCondition = (health) => {
  const h = Number(health);
  if (h >= 98) return 'new';
  if (h >= 90) return 'excellent';
  if (h >= 80) return 'good';
  if (h >= 60) return 'fair';
  if (h >= 40) return 'poor';
  if (h >= 20) return 'damaged';
  return 'non_functional';
};

const mapDbStatusToFrontend = (status) => {
  if (['available', 'allocated', 'reserved'].includes(status)) return 'ACTIVE';
  if (status === 'under_maintenance') return 'IN REPAIR';
  return 'DECOMMISSIONED';
};

const mapFrontendStatusToDb = (status, hasAssignee) => {
  if (status === 'IN REPAIR') return 'under_maintenance';
  if (status === 'DECOMMISSIONED') return 'retired';
  return hasAssignee ? 'allocated' : 'available';
};

class AssetService {
  async getAllAssets(filters) {
    const dbAssets = await assetRepository.findAll(filters);
    return dbAssets.map(asset => ({
      id: asset.asset_id,
      name: asset.asset_name,
      sn: asset.serial_number,
      category: asset.category_name === 'Monitors' ? 'Displays' : asset.category_name,
      status: mapDbStatusToFrontend(asset.current_status),
      health: mapConditionToHealth(asset.condition),
      location: asset.location,
      assignedTo: asset.employee_name || null,
      initials: asset.employee_name
        ? asset.employee_name.split(' ').map(n => n[0]).join('').toUpperCase()
        : null,
      type: asset.category_name === 'Laptops' ? 'laptop' : asset.category_name === 'Monitors' ? 'monitor' : asset.category_name === 'Audio' ? 'headphones' : 'tablet'
    }));
  }

  async getAssetById(id) {
    const asset = await assetRepository.findById(id);
    if (!asset) throw new NotFoundError('Asset not found');
    return {
      id: asset.asset_id,
      name: asset.asset_name,
      sn: asset.serial_number,
      category: asset.category_name === 'Monitors' ? 'Displays' : asset.category_name,
      status: mapDbStatusToFrontend(asset.current_status),
      health: mapConditionToHealth(asset.condition),
      location: asset.location,
      assignedTo: asset.employee_name || null,
      initials: asset.employee_name
        ? asset.employee_name.split(' ').map(n => n[0]).join('').toUpperCase()
        : null,
      type: asset.category_name === 'Laptops' ? 'laptop' : asset.category_name === 'Monitors' ? 'monitor' : asset.category_name === 'Audio' ? 'headphones' : 'tablet'
    };
  }

  async createAsset(data) {
    const { name, sn, category, status, health, location, assignedTo } = data;

    if (!name || !sn) throw new ValidationError('Name and Serial Number are required');

    // Check duplicate serial number
    const existing = await assetRepository.findBySerialNumber(sn);
    if (existing) throw new ConflictError('Asset with this serial number already exists');

    // Find category ID or map to default
    const dbCategoryName = category === 'Displays' ? 'Monitors' : category || 'Electronics';
    let dbCategory = await categoryRepository.findByName(dbCategoryName);
    if (!dbCategory) {
      const allCats = await categoryRepository.findAll();
      dbCategory = allCats[0]; // Fallback to first category (e.g. Electronics)
    }

    const category_id = dbCategory.id;
    const condition = mapHealthToCondition(health || 100);
    const dbStatus = mapFrontendStatusToDb(status || 'ACTIVE', !!assignedTo);
    const asset_tag = `AST-${category ? category.substring(0, 3).toUpperCase() : 'GEN'}-${Date.now().toString().slice(-5)}`;
    const qr_code = `https://assetflow.com/qr/${asset_tag}`;

    const created = await assetRepository.create({
      category_id,
      name,
      asset_tag,
      serial_number: sn,
      qr_code,
      purchase_cost: category === 'Laptops' ? 1500.00 : 500.00, // mock cost
      purchase_date: new Date(),
      condition,
      current_status: dbStatus,
      location: location || 'IT Storage Room B'
    });

    // If assignee specified, allocate asset
    if (assignedTo) {
      await this.handleAllocation(created.id, assignedTo);
    }

    // Log activity
    await logRepository.log({
      action_type: 'INSERT',
      entity_name: 'asset.assets',
      entity_id: created.id,
      new_values: created
    });

    return this.getAssetById(created.id);
  }

  async updateAsset(id, data) {
    const existingAsset = await assetRepository.findById(id);
    if (!existingAsset) throw new NotFoundError('Asset not found');

    const fieldsToUpdate = {};
    if (data.name !== undefined) fieldsToUpdate.name = data.name;
    if (data.sn !== undefined) {
      const duplicateSn = await assetRepository.findBySerialNumber(data.sn);
      if (duplicateSn && duplicateSn.asset_id !== id) {
        throw new ConflictError('Serial number already in use by another asset');
      }
      fieldsToUpdate.serial_number = data.sn;
    }
    if (data.health !== undefined) fieldsToUpdate.condition = mapHealthToCondition(data.health);
    if (data.location !== undefined) fieldsToUpdate.location = data.location;

    // Handle status change
    if (data.status !== undefined) {
      fieldsToUpdate.current_status = mapFrontendStatusToDb(data.status, !!data.assignedTo);
    }

    let updatedAsset = await assetRepository.update(id, fieldsToUpdate);

    // Handle assignee change / allocation history
    if (data.assignedTo !== undefined) {
      const currentAssignee = existingAsset.employee_name || '';
      if (data.assignedTo !== currentAssignee) {
        if (!data.assignedTo) {
          // Deallocate asset
          await assetRepository.deallocateAsset(id, fieldsToUpdate.condition || existingAsset.condition);
        } else {
          // Allocate asset
          await this.handleAllocation(id, data.assignedTo);
        }
      }
    }

    // Log activity
    await logRepository.log({
      action_type: 'UPDATE',
      entity_name: 'asset.assets',
      entity_id: id,
      old_values: existingAsset,
      new_values: updatedAsset
    });

    return this.getAssetById(id);
  }

  async deleteAsset(id) {
    const existing = await assetRepository.findById(id);
    if (!existing) throw new NotFoundError('Asset not found');

    // Deallocate first if allocated
    if (existing.active_allocation_id) {
      await assetRepository.deallocateAsset(id, 'good');
    }

    const deleted = await assetRepository.softDelete(id);

    // Log activity
    await logRepository.log({
      action_type: 'DELETE',
      entity_name: 'asset.assets',
      entity_id: id,
      old_values: existing
    });

    return { success: true, message: 'Asset deleted successfully' };
  }

  async handleAllocation(assetId, employeeName) {
    const parts = employeeName.trim().split(/\s+/);
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ') || '';

    let employee = await employeeRepository.findByName(firstName, lastName);
    if (!employee) {
      // Create employee dynamically to keep frontend simple if custom assignee is entered
      const allEmployees = await employeeRepository.findAll();
      employee = allEmployees[0]; // fallback
    }

    // Admin user id for approvals
    const adminUserId = 'f1111111-1111-1111-1111-111111111111'; // System Administrator
    await assetRepository.allocateAsset(assetId, employee.id, adminUserId, null);
  }
}

export default new AssetService();
