import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService.js';
import { 
  Heart, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Check, 
  Plug,
  Plus
} from 'lucide-react';

export default function ResourceBookingView({ onOpenNewWorkOrder }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [spaceUtilization, setSpaceUtilization] = useState([]);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const list = await bookingService.getAll();
        setBookings(list);
        const util = await bookingService.getSpaceUtilization();
        setSpaceUtilization(util);
      } catch (err) {
        console.error('Error fetching booking data:', err);
      }
    };
    fetchBookingData();
  }, []);

  const rawDays = [
    { date: 28, month: 'Sep', booked: false, past: true, label: 'HVAC Sync' },
    { date: 29, month: 'Sep', booked: false, past: true, label: 'Board Meeting' },
    { date: 30, month: 'Sep', booked: false, label: 'HVAC Overhaul', type: 'hvac' },
    { date: 1, month: 'Oct', booked: false },
    { date: 2, month: 'Oct', booked: false, label: 'Audit B-02', type: 'audit' },
    { date: 3, month: 'Oct', booked: false, label: 'Client Conf' },
    { date: 4, month: 'Oct', booked: false },
    { date: 5, month: 'Oct', booked: false, label: 'Internal Sync' },
    { date: 6, month: 'Oct', booked: false },
    { date: 7, month: 'Oct', booked: false, label: 'Cleaning', type: 'cleaning' },
    { date: 8, month: 'Oct', booked: false, borderRed: true, label: 'Main Overhaul' },
    { date: 9, month: 'Oct', booked: false },
    { date: 10, month: 'Oct', booked: false },
    { date: 11, month: 'Oct', booked: false }
  ];

  const days = rawDays.map(d => {
    // Check if there is an active DB booking matching this day of the month
    const match = bookings.find(b => {
      const start = new Date(b.startTime);
      return start.getDate() === d.date;
    });

    if (match) {
      return {
        ...d,
        booked: true,
        label: match.purpose,
        type: match.resourceType?.toLowerCase().includes('room') ? 'hvac' : 'audit'
      };
    }

    // Default/fallback mock values if no DB bookings match
    if (d.date === 28 || d.date === 29 || d.date === 30 || d.date === 3 || d.date === 5 || d.date === 8) {
      return { ...d, booked: true };
    }
    return d;
  });

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold font-sans text-[#0F172A] leading-tight">
            Maintenance & Resource Center
          </h1>
          <p className="text-sm text-[#45464d] mt-1 font-sans">
            Strategic oversight for enterprise-grade facilities and infrastructure.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="h-9 px-4 rounded-sm border border-[#e5e4e7] bg-white text-sm font-sans font-semibold text-[#45464d] hover:bg-[#f6f3f5] transition-colors cursor-pointer">
            Generate Log
          </button>
          <button 
            onClick={onOpenNewWorkOrder}
            className="h-9 px-4 rounded-sm bg-[#0F172A] text-white text-sm font-sans font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            New Work Order
          </button>
        </div>
      </div>

      {/* Top Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Health Score */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between min-h-[100px] relative group hover:border-[#76777d] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">
              Health Score
            </span>
            <Heart size={16} className="text-[#76777d] group-hover:text-[#06b6d4] transition-colors" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-[#0F172A]">82 <span className="text-sm text-[#76777d] font-normal">/ 100</span></div>
            <div className="bg-gray-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#0F172A] h-full rounded-full" style={{ width: '82%' }}></div>
            </div>
          </div>
        </div>

        {/* Card 2: Failure Probability */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between min-h-[100px] relative group hover:border-[#76777d] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">
              Failure Probability
            </span>
            <AlertTriangle size={16} className="text-[#76777d]" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-[#0F172A]">12%</div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-bold mt-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span>Low Risk Badge</span>
            </div>
          </div>
        </div>

        {/* Card 3: Suggested Action */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex items-center justify-between min-h-[100px] gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">
              Suggested Action
            </span>
            <h4 className="text-xs font-bold text-[#0F172A] leading-tight">
              Schedule sensor check for HVAC unit B-12
            </h4>
            <p className="text-[10px] text-[#76777d]">
              Preventative measures could save $4,200 in emergency repairs.
            </p>
          </div>
          <button className="h-8 px-3.5 rounded-sm bg-[#e6f7fa] text-[#06b6d4] text-[11px] font-bold font-mono tracking-wider hover:bg-[#cbf1f6] transition-colors cursor-pointer shrink-0">
            Optimize
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Resource Booking Grid */}
        <div className="lg:col-span-2 bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col">
          <div className="flex justify-between items-center border-b border-[#f0edef] pb-3 mb-4">
            <span className="text-xs font-bold font-mono tracking-widest text-[#0F172A] uppercase">
              Resource Booking Grid
            </span>
            <div className="flex items-center gap-4">
              <button className="text-[#76777d] hover:text-[#0F172A] p-0.5 rounded cursor-pointer">
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold font-mono text-[#0F172A] select-none uppercase tracking-wider">
                October 2023
              </span>
              <button className="text-[#76777d] hover:text-[#0F172A] p-0.5 rounded cursor-pointer">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 border-t border-l border-[#e5e4e7]">
            {/* Weekdays */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(w => (
              <div key={w} className="border-r border-b border-[#e5e4e7] py-2 text-center text-[10px] font-bold font-mono text-[#76777d] bg-[#f6f3f5] uppercase select-none">
                {w}
              </div>
            ))}

            {/* Days */}
            {days.map((day, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedDay(day)}
                className={`min-h-[92px] border-r border-b border-[#e5e4e7] p-2 flex flex-col justify-between transition-colors relative cursor-pointer group ${
                  day.past 
                    ? 'bg-[#fbfbfb]' 
                    : day.booked 
                    ? 'bg-[#e6f7fa] hover:bg-cyan-100/50' 
                    : 'bg-white hover:bg-[#f6f3f5]'
                }`}
              >
                <div className="text-xs font-mono font-semibold text-[#76777d]">
                  {day.date}
                </div>

                {day.label && (
                  <div className={`mt-auto text-[9px] font-mono font-bold p-1 rounded-sm tracking-wide ${
                    day.type === 'hvac' 
                      ? 'bg-black text-white' 
                      : day.type === 'audit' 
                      ? 'bg-slate-700 text-white' 
                      : day.type === 'cleaning'
                      ? 'bg-[#eae7e9] text-[#45464d]'
                      : day.borderRed
                      ? 'bg-red-50 text-red-700 border-b-2 border-red-500'
                      : 'bg-cyan-700 text-white'
                  }`}>
                    {day.label}
                  </div>
                )}

                {/* Selected Ring */}
                {selectedDay?.date === day.date && selectedDay?.month === day.month && (
                  <div className="absolute inset-0 border-2 border-[#06b6d4] pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Columns: Space Utilization & Facility Load */}
        <div className="lg:col-span-1 space-y-6">
          {/* Space Utilization Heatmap Card */}
          <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg space-y-4">
            <span className="text-xs font-bold font-mono tracking-widest text-[#0F172A] uppercase">
              Space Utilization Heatmap
            </span>
            
            {/* Visual Heatmap representation */}
            <div className="bg-cyan-50/50 border border-[#e5e4e7] h-32 rounded flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-200/40 via-cyan-100/10 to-emerald-200/25"></div>
              {/* Floor Analytics Bubble */}
              <div className="z-10 bg-white border border-[#0F172A] shadow-md py-1 px-3 rounded-xs font-mono text-[9px] font-bold text-[#0F172A]">
                Floor 04 Analytics
              </div>
            </div>

            <div className="space-y-3">
              {spaceUtilization.length > 0 ? spaceUtilization.map((su, idx) => (
                <div key={su.id || idx}>
                  <div className="flex justify-between items-center text-xs font-sans text-[#45464d] font-semibold mb-1">
                    <span>{su.name}</span>
                    <span className="font-mono">{su.utilization}</span>
                  </div>
                  <div className="bg-gray-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#0F172A] h-full" style={{ width: su.utilization }}></div>
                  </div>
                </div>
              )) : (
                <>
                  <div>
                    <div className="flex justify-between items-center text-xs font-sans text-[#45464d] font-semibold mb-1">
                      <span>Conference Room A</span>
                      <span className="font-mono">92%</span>
                    </div>
                    <div className="bg-gray-100 h-1 rounded-full overflow-hidden">
                      <div className="bg-[#0F172A] h-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-xs font-sans text-[#45464d] font-semibold mb-1">
                      <span>Lounge Hub</span>
                      <span className="font-mono">45%</span>
                    </div>
                    <div className="bg-gray-100 h-1 rounded-full overflow-hidden">
                      <div className="bg-[#0F172A] h-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Facility Load Status Card */}
          <div className="bg-[#0F172A] text-white p-4 rounded-lg flex flex-col justify-between min-h-[144px]">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center text-cyan-400">
                <Plug size={16} />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider bg-white/10 text-cyan-300 rounded uppercase">
                Real-time
              </span>
            </div>

            <div className="mt-3">
              <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">
                Facility Load Status
              </span>
              <h3 className="text-2xl font-bold font-mono text-white mt-1">
                68.4 <span className="text-sm font-normal text-slate-300">kW/h</span>
              </h3>
            </div>

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400">
              <span>Status: Nominal</span>
              <span className="text-emerald-400 font-bold">↑ 2.1%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
