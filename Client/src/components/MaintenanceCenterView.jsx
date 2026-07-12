import React, { useState } from 'react';
import { maintenanceService } from '../services/maintenanceService.js';
import { 
  Plus, 
  ChevronRight, 
  ChevronLeft,
  X,
  AlertCircle,
  Clock,
  User,
  SlidersHorizontal,
  Wrench
} from 'lucide-react';

export default function MaintenanceCenterView({ 
  workOrders, 
  setWorkOrders, 
  isNewWorkOrderOpen, 
  setIsNewWorkOrderOpen 
}) {
  const [filterPriority, setFilterPriority] = useState('All');
  
  // Form states
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [description, setDescription] = useState('');
  const [due, setDue] = useState('Oct 20, 2023');
  const [assignedTo, setAssignedTo] = useState('Technician A');

  const moveOrder = async (id, targetStatus) => {
    try {
      await maintenanceService.move(id, targetStatus);
      const updated = await maintenanceService.getAll();
      setWorkOrders(updated);
    } catch (err) {
      console.error('Error moving work order status:', err);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      await maintenanceService.create({
        title,
        priority,
        description,
        due,
        assignedTo
      });
      
      const updated = await maintenanceService.getAll();
      setWorkOrders(updated);
      setIsNewWorkOrderOpen(false);

      // Reset fields
      setTitle('');
      setPriority('HIGH');
      setDescription('');
      setDue('Oct 20, 2023');
      setAssignedTo('Technician A');
    } catch (err) {
      console.error('Error creating work order:', err);
    }
  };

  const getPriorityStyle = (p) => {
    switch (p) {
      case 'HIGH':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  // Columns layout
  const columns = [
    { id: 'pending', label: 'Pending', countColor: 'bg-gray-100 text-gray-700 border-gray-200' },
    { id: 'approved', label: 'Approved', countColor: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'assigned', label: 'Assigned', countColor: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 'in_progress', label: 'In Progress', countColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  ];

  const getNextStatus = (current) => {
    if (current === 'pending') return 'approved';
    if (current === 'approved') return 'assigned';
    if (current === 'assigned') return 'in_progress';
    return null;
  };

  const getPrevStatus = (current) => {
    if (current === 'in_progress') return 'assigned';
    if (current === 'assigned') return 'approved';
    if (current === 'approved') return 'pending';
    return null;
  };

  // Filter tasks
  const filteredOrders = workOrders.filter(o => 
    filterPriority === 'All' || o.priority === filterPriority
  );

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold font-sans text-[#0F172A] leading-tight">
            Maintenance Workflow
          </h1>
          <p className="text-sm text-[#45464d] mt-1 font-sans">
            Oversee and track maintenance operations, repairs, and technical work orders.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center border border-[#e5e4e7] rounded-sm bg-white px-2">
            <SlidersHorizontal size={14} className="text-[#76777d] mr-2" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="h-8 border-none text-xs font-sans font-semibold text-[#45464d] bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
          <button 
            onClick={() => setIsNewWorkOrderOpen(true)}
            className="h-9 px-4 rounded-sm bg-[#0F172A] text-white text-sm font-sans font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            New Work Order
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start select-none">
        {columns.map(col => {
          const colOrders = filteredOrders.filter(o => o.status === col.id);
          return (
            <div key={col.id} className="bg-[#f6f3f5] border border-[#e5e4e7] rounded-lg p-3 flex flex-col min-h-[500px]">
              {/* Column Header */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold font-mono tracking-widest text-[#0F172A] uppercase">
                  {col.label}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold font-mono border rounded-full ${col.countColor}`}>
                  {String(colOrders.length).padStart(2, '0')}
                </span>
              </div>

              {/* Cards list */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colOrders.map(order => {
                  const next = getNextStatus(order.status);
                  const prev = getPrevStatus(order.status);
                  return (
                    <div 
                      key={order.id}
                      className="bg-white border border-[#e5e4e7] p-3 rounded-md hover:border-[#76777d] transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <span className={`px-2 py-0.5 text-[8px] font-bold font-mono border rounded-xs select-none ${getPriorityStyle(order.priority)}`}>
                            {order.priority}
                          </span>
                          <span className="text-[9px] font-mono text-[#76777d] flex items-center gap-0.5">
                            <Clock size={10} />
                            {order.due}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#0F172A] font-sans leading-tight">
                          {order.title}
                        </h4>
                        <p className="text-[10px] text-[#76777d] font-sans leading-relaxed">
                          {order.description || 'No description provided.'}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-[#f0edef]">
                        <div className="flex items-center gap-1 text-[#76777d]">
                          <User size={10} />
                          <span className="text-[9px] font-sans font-medium">{order.assignedTo}</span>
                        </div>
                        
                        {/* Control buttons */}
                        <div className="flex gap-1">
                          {prev && (
                            <button 
                              onClick={() => moveOrder(order.id, prev)}
                              className="w-5 h-5 rounded border border-[#e5e4e7] flex items-center justify-center text-[#76777d] hover:bg-[#f6f3f5] hover:text-[#0F172A] cursor-pointer"
                              title="Move back"
                            >
                              <ChevronLeft size={10} />
                            </button>
                          )}
                          {next && (
                            <button 
                              onClick={() => moveOrder(order.id, next)}
                              className="w-5 h-5 rounded border border-[#e5e4e7] flex items-center justify-center text-[#76777d] hover:bg-[#f6f3f5] hover:text-[#0F172A] cursor-pointer"
                              title="Move forward"
                            >
                              <ChevronRight size={10} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colOrders.length === 0 && (
                  <div className="py-8 text-center text-[10px] font-sans text-[#76777d] italic bg-white/40 border border-dashed border-[#e5e4e7] rounded">
                    No orders in column
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Work Order Modal */}
      {isNewWorkOrderOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center select-none">
          <div className="bg-white border border-[#e5e4e7] rounded-xl w-[440px] p-6 shadow-2xl animate-fade-in relative">
            <button 
              onClick={() => setIsNewWorkOrderOpen(false)}
              className="absolute top-4 right-4 text-[#76777d] hover:text-[#0F172A] p-1 rounded-full hover:bg-[#f6f3f5] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-bold font-sans text-[#0F172A] mb-1">Create Work Order</h2>
            <p className="text-xs text-[#76777d] mb-4">Initialize a new maintenance ticket in the workflow queue.</p>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              
              {/* Order Title */}
              <div>
                <label className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase block mb-1.5">
                  Order Title *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Repack HVAC Compressor Seals"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-9 border border-[#e5e4e7] rounded-sm px-3 text-sm focus:border-[#06b6d4] focus:outline-none transition-colors"
                />
              </div>

              {/* Priority & Assignee */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase block mb-1.5">
                    Priority
                  </label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full h-9 border border-[#e5e4e7] rounded-sm px-3 text-sm bg-white focus:border-[#06b6d4] focus:outline-none transition-colors"
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase block mb-1.5">
                    Assignee
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Technician A"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full h-9 border border-[#e5e4e7] rounded-sm px-3 text-sm focus:border-[#06b6d4] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase block mb-1.5">
                  Due Date
                  </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Oct 20, 2023"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                  className="w-full h-9 border border-[#e5e4e7] rounded-sm px-3 text-sm focus:border-[#06b6d4] focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase block mb-1.5">
                  Description
                </label>
                <textarea 
                  placeholder="Details of the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-20 border border-[#e5e4e7] rounded-sm p-3 text-sm focus:border-[#06b6d4] focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewWorkOrderOpen(false)}
                  className="flex-1 h-10 border border-[#e5e4e7] rounded-sm text-sm font-bold font-mono tracking-wider uppercase hover:bg-[#f6f3f5] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 bg-[#0F172A] hover:bg-slate-800 text-white rounded-sm text-sm font-bold font-mono tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Create
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
