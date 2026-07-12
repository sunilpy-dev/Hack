import React, { useState } from 'react';
import { assetService } from '../services/assetService.js';
import { 
  SlidersHorizontal, 
  Plus, 
  Laptop, 
  Monitor, 
  Headphones, 
  Tablet, 
  Calendar, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Sparkles,
  History,
  MoreHorizontal,
  ChevronRight,
  User,
  Search,
  Sliders
} from 'lucide-react';

export default function AssetDirectoryView({ 
  currentUser,
  assets, 
  setAssets, 
  selectedAsset, 
  setSelectedAsset, 
  isNewAssetOpen, 
  setIsNewAssetOpen 
}) {
  const [showFilters, setShowFilters] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [healthThreshold, setHealthThreshold] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [formError, setFormError] = useState('');

  // Local state for Drawer Tab
  const [drawerTab, setDrawerTab] = useState('maintenance');

  // Local state for the Edit Form
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSn, setEditSn] = useState('');
  const [editStatus, setEditStatus] = useState('ACTIVE');
  const [editHealth, setEditHealth] = useState(100);
  const [editAssignee, setEditAssignee] = useState('');

  // Local state for Add New Asset Form
  const [newName, setNewName] = useState('');
  const [newSn, setNewSn] = useState('');
  const [newCategory, setNewCategory] = useState('Laptops');
  const [newStatus, setNewStatus] = useState('ACTIVE');
  const [newHealth, setNewHealth] = useState(100);
  const [newAssignee, setNewAssignee] = useState('');
  const [newLocation, setNewLocation] = useState('San Francisco HQ');

  const startEdit = (asset) => {
    setEditName(asset.name);
    setEditSn(asset.sn);
    setEditStatus(asset.status);
    setEditHealth(asset.health);
    setEditAssignee(asset.assignedTo || '');
    setIsEditing(true);
  };

  const saveEdit = async (id) => {
    try {
      const updatedAsset = await assetService.update(id, {
        name: editName,
        sn: editSn,
        status: editStatus,
        health: Number(editHealth),
        assignedTo: editAssignee || null
      });

      const updatedList = await assetService.getAll();
      setAssets(updatedList);
      
      const newSelected = updatedList.find(a => a.id === id);
      setSelectedAsset(newSelected || updatedAsset);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving asset edits:', err);
    }
  };

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    if (!newName || !newSn) return;
    setFormError('');

    try {
      await assetService.create({
        name: newName,
        sn: newSn,
        category: newCategory,
        status: newStatus,
        health: Number(newHealth),
        location: newLocation,
        assignedTo: newAssignee || null
      });

      const updatedList = await assetService.getAll();
      setAssets(updatedList);
      setIsNewAssetOpen(false);
      setFormError('');

      // Reset fields
      setNewName('');
      setNewSn('');
      setNewCategory('Laptops');
      setNewStatus('ACTIVE');
      setNewHealth(100);
      setNewAssignee('');
      setNewLocation('San Francisco HQ');
    } catch (err) {
      console.error('Error creating asset:', err);
      setFormError(err.message || 'Failed to create asset. Please try again.');
    }
  };

  // Filter Logic
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.sn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (asset.assignedTo && asset.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'All' || asset.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || asset.status === filterStatus;
    const matchesLocation = filterLocation === 'All' || asset.location === filterLocation;
    const matchesHealth = asset.health >= healthThreshold;

    return matchesSearch && matchesCategory && matchesStatus && matchesLocation && matchesHealth;
  });

  const getAssetIcon = (type) => {
    switch (type) {
      case 'laptop':
        return <Laptop size={28} className="text-[#0F172A]" />;
      case 'monitor':
        return <Monitor size={28} className="text-[#0F172A]" />;
      case 'headphones':
        return <Headphones size={28} className="text-[#0F172A]" />;
      default:
        return <Tablet size={28} className="text-[#0F172A]" />;
    }
  };

  return (
    <div className="flex-1 flex relative overflow-hidden h-full">
      {/* Main Grid View Area */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold font-sans text-[#0F172A] leading-tight">
              Asset Directory
            </h1>
            <p className="text-sm text-[#45464d] mt-1 font-sans">
              Unified view of all physical and digital enterprise assets.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`h-9 px-4 rounded-sm border text-sm font-sans font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                showFilters 
                  ? 'border-[#06b6d4] bg-[#e6f7fa] text-[#0F172A] glow-accent-sm' 
                  : 'border-[#e5e4e7] bg-white text-[#45464d] hover:bg-[#f6f3f5]'
              }`}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
            {(currentUser?.permissions?.includes('asset.create') || currentUser?.role === 'Admin') && (
              <button 
                onClick={() => setIsNewAssetOpen(true)}
                className="h-9 px-4 rounded-sm bg-[#0F172A] text-white text-sm font-sans font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={16} />
                New Asset
              </button>
            )}
          </div>
        </div>

        {/* Global Search & Filters Bar */}
        {showFilters && (
          <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg space-y-4 transition-all">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              
              {/* Category */}
              <div>
                <label className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase block mb-1.5">
                  Category
                </label>
                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full h-9 border border-[#e5e4e7] rounded-sm px-3 text-sm text-[#1b1b1d] bg-white focus:border-[#06b6d4] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Displays">Displays</option>
                  <option value="Audio">Audio</option>
                  <option value="Input Devices">Input Devices</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase block mb-1.5">
                  Status
                </label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full h-9 border border-[#e5e4e7] rounded-sm px-3 text-sm text-[#1b1b1d] bg-white focus:border-[#06b6d4] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="IN REPAIR">In Repair</option>
                  <option value="DECOMMISSIONED">Decommissioned</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase block mb-1.5">
                  Location
                </label>
                <select 
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full h-9 border border-[#e5e4e7] rounded-sm px-3 text-sm text-[#1b1b1d] bg-white focus:border-[#06b6d4] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="All">All Locations</option>
                  <option value="San Francisco HQ">San Francisco HQ</option>
                  <option value="New York Office">New York Office</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              {/* Health Score */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">
                    Health Score
                  </label>
                  <span className="text-[11px] font-mono font-bold text-[#0F172A]">&gt; {healthThreshold}%</span>
                </div>
                <div className="flex items-center h-9">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={healthThreshold}
                    onChange={(e) => setHealthThreshold(Number(e.target.value))}
                    className="w-full accent-[#06b6d4] bg-gray-200 h-1 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#76777d]" />
              <input 
                type="text"
                placeholder="Search assets by name, serial number, or assignee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[#e5e4e7] rounded-sm text-sm focus:border-[#06b6d4] focus:outline-none transition-colors font-sans"
              />
            </div>
          </div>
        )}

        {/* Asset Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => {
              const isSelected = selectedAsset && selectedAsset.id === asset.id;
              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    setSelectedAsset(asset);
                    setIsEditing(false); // Reset editing form state when changing asset
                  }}
                  className={`bg-white border p-4 rounded-lg flex flex-col justify-between cursor-pointer transition-all hover:border-[#76777d] relative ${
                    isSelected 
                      ? 'border-[#06b6d4] bg-cyan-50/5 glow-accent-sm' 
                      : 'border-[#e5e4e7]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#f0edef] rounded-md flex items-center justify-center border border-[#e5e4e7]">
                        {getAssetIcon(asset.type)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#0F172A] font-sans">
                          {asset.name}
                        </h3>
                        <p className="text-xs font-mono text-[#76777d] mt-0.5">
                          ID: {asset.tag || 'AST-GEN'} | SN: {asset.sn}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-sm border select-none ${
                        asset.status === 'ACTIVE' 
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : asset.status === 'IN REPAIR' 
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {asset.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#f0edef]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-[#76777d] uppercase">Health Score</span>
                      <span className={`text-xs font-mono font-bold ${
                        asset.health > 80 ? 'text-emerald-600' : asset.health > 50 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {asset.health}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-[#76777d] uppercase">Assigned To</span>
                      {asset.assignedTo ? (
                        <div className="flex items-center gap-1">
                          <div className="w-5 h-5 rounded-full bg-[#d5e0f8] flex items-center justify-center text-[9px] font-mono font-bold text-[#586377]">
                            {asset.initials}
                          </div>
                          <span className="text-xs font-sans text-[#45464d] font-medium truncate max-w-[100px]">
                            {asset.assignedTo.split(' ')[0]}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[#76777d]">
                          <Calendar size={12} />
                          <span className="text-[11px] font-sans italic font-medium">Unassigned</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 py-12 text-center border border-dashed border-[#e5e4e7] bg-white rounded-lg">
              <AlertCircle className="mx-auto text-[#76777d] mb-2" size={24} />
              <p className="text-sm font-sans text-[#45464d] font-semibold">No assets found matching the filter criteria.</p>
              <p className="text-xs font-sans text-[#76777d] mt-1">Try resetting the status/category filter or reducing the health threshold.</p>
            </div>
          )}
        </div>

      </div>

      {/* Right Drawer Panel (opened for selected asset) */}
      {selectedAsset && (
        <div className="w-96 bg-white border-l border-[#e5e4e7] h-full flex flex-col justify-between shadow-lg z-10 animate-slide-in select-none">
          {/* Header */}
          <div className="p-4 border-b border-[#e5e4e7] flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#f0edef] border border-[#e5e4e7] rounded-md flex items-center justify-center">
                {getAssetIcon(selectedAsset.type)}
              </div>
              <div>
                <h2 className="font-bold text-sm text-[#0F172A] font-sans">
                  {selectedAsset.name}
                </h2>
                <p className="text-[10px] font-mono text-[#76777d] font-medium">
                  ID: {selectedAsset.tag || 'AST-GEN'} | SERIAL: {selectedAsset.sn}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedAsset(null)}
              className="text-[#76777d] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#f6f3f5] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {isEditing ? (
              /* Inline Edit Mode */
              <div className="space-y-4 bg-slate-50 p-3 rounded border border-slate-200">
                <h3 className="text-xs font-bold font-mono text-slate-700 uppercase">Edit Asset Details</h3>
                
                <div>
                  <label className="text-[9px] font-bold font-mono text-slate-500 uppercase block mb-1">Asset Name</label>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={e => setEditName(e.target.value)}
                    className="w-full h-8 px-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-cyan-500 bg-white"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold font-mono text-slate-500 uppercase block mb-1">Serial Number</label>
                  <input 
                    type="text" 
                    value={editSn} 
                    onChange={e => setEditSn(e.target.value)}
                    className="w-full h-8 px-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-cyan-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-bold font-mono text-slate-500 uppercase block mb-1">Status</label>
                    <select 
                      value={editStatus} 
                      onChange={e => setEditStatus(e.target.value)}
                      className="w-full h-8 px-2 border border-slate-300 rounded text-xs focus:outline-none bg-white"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="IN REPAIR">In Repair</option>
                      <option value="DECOMMISSIONED">Decommissioned</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold font-mono text-slate-500 uppercase block mb-1">Health Score</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      value={editHealth} 
                      onChange={e => setEditHealth(e.target.value)}
                      className="w-full h-8 px-2 border border-slate-300 rounded text-xs focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold font-mono text-slate-500 uppercase block mb-1">Assignee Name</label>
                  <input 
                    type="text" 
                    value={editAssignee} 
                    placeholder="Leave blank for unassigned"
                    onChange={e => setEditAssignee(e.target.value)}
                    className="w-full h-8 px-2 border border-slate-300 rounded text-xs focus:outline-none bg-white"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => saveEdit(selectedAsset.id)}
                    className="flex-1 h-8 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-xs font-semibold cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 h-8 bg-white border border-slate-300 hover:bg-slate-100 rounded text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Insight block */}
                <div className="bg-[#131b2e] text-white p-4 rounded-lg relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-10 p-2">
                    <Sparkles size={72} className="text-cyan-400" />
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold font-mono tracking-widest text-[#7c839b] uppercase flex items-center gap-1">
                      <Sparkles size={11} className="text-[#06b6d4]" />
                      INSIGHT
                    </span>
                    <span className="text-sm font-bold font-mono text-cyan-400">{selectedAsset.health}% Health</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-200 mt-2 font-sans font-medium">
                    {selectedAsset.status === 'ACTIVE' 
                      ? 'Asset is performing at peak efficiency. Recommendation: Battery optimization cycle in 12 days to maintain longevity. No hardware issues detected in last 30 scans.'
                      : selectedAsset.status === 'IN REPAIR'
                      ? 'Asset needs replacement of secondary power rails. Technicians estimate complete overhaul in 48h. Currently bypassed.'
                      : 'Asset marked for recycling and secure disposal. Hardware registers wiped.'
                    }
                  </p>
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-[#76777d] uppercase">
                    Lifecycle Timeline
                  </span>
                  
                  <div className="relative pl-6 space-y-4 border-l border-[#e5e4e7] ml-2 mt-2">
                    <div className="relative">
                      <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#0F172A] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]"></div>
                      </div>
                      <h4 className="text-xs font-bold text-[#0F172A]">
                        {selectedAsset.assignedTo ? `Assigned to ${selectedAsset.assignedTo}` : 'Marked Unassigned'}
                      </h4>
                      <p className="text-[10px] text-[#76777d] font-mono mt-0.5">Jan 12, 2024 • 09:41 AM</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#76777d] flex items-center justify-center"></div>
                      <h4 className="text-xs font-semibold text-[#45464d]">Auto-Audit Passed</h4>
                      <p className="text-[10px] text-[#76777d] font-mono mt-0.5">Dec 28, 2023 • 02:00 PM</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#76777d] flex items-center justify-center"></div>
                      <h4 className="text-xs font-semibold text-[#45464d]">Asset Procured & Registered</h4>
                      <p className="text-[10px] text-[#76777d] font-mono mt-0.5">Dec 15, 2023 • 11:30 AM</p>
                    </div>
                  </div>
                </div>

                {/* Tabs for Drawer */}
                <div className="border-t border-[#f0edef] pt-4">
                  <div className="flex border-b border-[#e5e4e7] gap-4 mb-3">
                    <button 
                      onClick={() => setDrawerTab('maintenance')}
                      className={`pb-2 text-[10px] font-bold font-mono tracking-wider cursor-pointer transition-colors relative ${
                        drawerTab === 'maintenance' ? 'text-[#0F172A]' : 'text-[#76777d]'
                      }`}
                    >
                      MAINTENANCE
                      {drawerTab === 'maintenance' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F172A]"></div>
                      )}
                    </button>
                    <button 
                      onClick={() => setDrawerTab('allocation')}
                      className={`pb-2 text-[10px] font-bold font-mono tracking-wider cursor-pointer transition-colors relative ${
                        drawerTab === 'allocation' ? 'text-[#0F172A]' : 'text-[#76777d]'
                      }`}
                    >
                      ALLOCATION
                      {drawerTab === 'allocation' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F172A]"></div>
                      )}
                    </button>
                  </div>

                  {drawerTab === 'maintenance' ? (
                    <div className="space-y-2">
                      <div className="border border-[#e5e4e7] rounded p-2.5 flex justify-between items-center bg-[#fcf8fa] hover:bg-[#f0edef] transition-colors cursor-pointer">
                        <div>
                          <h5 className="text-xs font-bold text-[#0F172A]">Display Calibration</h5>
                          <p className="text-[10px] text-[#76777d] mt-0.5">Scheduled for Feb 15</p>
                        </div>
                        <ChevronRight size={14} className="text-[#76777d]" />
                      </div>

                      <div className="border border-[#e5e4e7] rounded p-2.5 flex justify-between items-center bg-[#fcf8fa]">
                        <div>
                          <h5 className="text-xs font-semibold text-[#45464d]">Firmware Update v2.4</h5>
                          <p className="text-[10px] text-[#76777d] mt-0.5">Completed Dec 20, 2023</p>
                        </div>
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs text-[#45464d]">
                      <div className="border border-[#e5e4e7] rounded p-3 space-y-1.5">
                        <div className="flex justify-between font-mono text-[10px] text-[#76777d]">
                          <span>CURRENT DEPLOYMENT</span>
                          <span>ACTIVE</span>
                        </div>
                        <div className="font-semibold text-[#0F172A]">San Francisco HQ - Desk 12B</div>
                        <div className="text-[10px]">Cost Center: US-ENG-SF</div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Drawer Actions */}
          {!isEditing && (currentUser?.permissions?.includes('asset.update') || currentUser?.role === 'Admin') && (
            <div className="p-4 border-t border-[#e5e4e7] flex gap-2">
              <button 
                onClick={() => startEdit(selectedAsset)}
                className="flex-1 h-9 rounded-sm bg-[#0F172A] text-white hover:bg-slate-800 text-xs font-bold font-mono tracking-wider uppercase transition-colors cursor-pointer"
              >
                Edit Details
              </button>
              <button className="h-9 w-9 rounded-sm border border-[#e5e4e7] bg-white flex items-center justify-center text-[#76777d] hover:bg-[#f6f3f5] transition-colors cursor-pointer">
                <History size={16} />
              </button>
              <button className="h-9 w-9 rounded-sm border border-[#e5e4e7] bg-white flex items-center justify-center text-[#76777d] hover:bg-[#f6f3f5] transition-colors cursor-pointer">
                <MoreHorizontal size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* New Asset Dialog Modal */}
      {isNewAssetOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center select-none">
          <div className="bg-white border border-[#e5e4e7] rounded-xl w-[480px] p-6 shadow-2xl animate-fade-in relative">
            <button 
              onClick={() => { setIsNewAssetOpen(false); setFormError(''); }}
              className="absolute top-4 right-4 text-[#76777d] hover:text-[#0F172A] p-1 rounded-full hover:bg-[#f6f3f5] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-bold font-sans text-[#0F172A] mb-1">Provision New Asset</h2>
            <p className="text-xs text-[#76777d] mb-4">Register a physical device or virtual node in the system catalog.</p>

            <form onSubmit={handleCreateAsset} className="space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs font-sans leading-relaxed flex items-start gap-2">
                  <span className="font-bold">Error:</span>
                  <span>{formError}</span>
                </div>
              )}
              
              {/* Asset Name */}
              <div>
                <label className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase block mb-1.5">
                  Asset Name *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. MacBook Pro M3 Max"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-9 border border-[#e5e4e7] rounded-sm px-3 text-sm focus:border-[#06b6d4] focus:outline-none transition-colors"
                />
              </div>

              {/* Grid: Serial Number & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase block mb-1.5">
                    Serial Number *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. AP-X883-998"
                    value={newSn}
                    onChange={(e) => setNewSn(e.target.value)}
                    className="w-full h-9 border border-[#e5e4e7] rounded-sm px-3 text-sm focus:border-[#06b6d4] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase block mb-1.5">
                    Category
                  </label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-9 border border-[#e5e4e7] rounded-sm px-3 text-sm bg-white focus:border-[#06b6d4] focus:outline-none transition-colors"
                  >
                    <option value="Laptops">Laptops</option>
                    <option value="Displays">Displays</option>
                    <option value="Audio">Audio</option>
                    <option value="Input Devices">Input Devices</option>
                  </select>
                </div>
              </div>

              {/* Grid: Status & Health */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase block mb-1.5">
                    Status
                  </label>
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full h-9 border border-[#e5e4e7] rounded-sm px-3 text-sm bg-white focus:border-[#06b6d4] focus:outline-none transition-colors"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="IN REPAIR">In Repair</option>
                    <option value="DECOMMISSIONED">Decommissioned</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase block mb-1.5">
                    Health Score (0-100)
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    required
                    value={newHealth}
                    onChange={(e) => setNewHealth(e.target.value)}
                    className="w-full h-9 border border-[#e5e4e7] rounded-sm px-3 text-sm focus:border-[#06b6d4] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Assignee & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase block mb-1.5">
                    Assignee Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Jane Doe"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full h-9 border border-[#e5e4e7] rounded-sm px-3 text-sm focus:border-[#06b6d4] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase block mb-1.5">
                    Location
                  </label>
                  <select 
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full h-9 border border-[#e5e4e7] rounded-sm px-3 text-sm bg-white focus:border-[#06b6d4] focus:outline-none transition-colors"
                  >
                    <option value="San Francisco HQ">San Francisco HQ</option>
                    <option value="New York Office">New York Office</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewAssetOpen(false)}
                  className="flex-1 h-10 border border-[#e5e4e7] rounded-sm text-sm font-bold font-mono tracking-wider uppercase hover:bg-[#f6f3f5] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 bg-[#0F172A] hover:bg-slate-800 text-white rounded-sm text-sm font-bold font-mono tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Save Asset
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
