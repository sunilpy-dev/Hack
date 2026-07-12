import React from 'react';
import { BarChart3, LineChart, PieChart, TrendingUp, DollarSign, Activity } from 'lucide-react';

export default function AnalyticsView() {
  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-sans text-[#0F172A] leading-tight">
          Analytics & Intelligence
        </h1>
        <p className="text-sm text-[#45464d] mt-1 font-sans">
          Deep telemetry and forecasting tools to maximize asset lifespan and efficiency.
        </p>
      </div>

      {/* Grid Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between min-h-[100px] relative group hover:border-[#76777d] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">Mean Time to Repair</span>
            <Activity size={16} className="text-[#76777d]" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-[#0F172A]">18.5 Hours</div>
            <span className="text-[10px] font-mono text-emerald-600 font-bold mt-2.5 block">-4.2h vs last month</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between min-h-[100px] relative group hover:border-[#76777d] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">Asset Cost Savings</span>
            <DollarSign size={16} className="text-[#76777d]" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-[#0F172A]">$12,450.00</div>
            <span className="text-[10px] font-mono text-emerald-600 font-bold mt-2.5 block">+8.6% saved this Q</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between min-h-[100px] relative group hover:border-[#76777d] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">Operational Risk Factor</span>
            <TrendingUp size={16} className="text-[#76777d]" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-[#0F172A]">0.12 <span className="text-xs font-normal text-[#76777d]">/ 1.0</span></div>
            <span className="text-[10px] font-mono text-emerald-600 font-bold mt-2.5 block">Nominal risk profile</span>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Deprecation Curve */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between">
          <span className="text-xs font-bold font-mono tracking-widest text-[#0F172A] uppercase border-b border-[#f0edef] pb-3 mb-4">
            Depreciation Curve (5 Year Forecast)
          </span>

          {/* SVG Line Chart */}
          <div className="w-full h-48 py-2">
            <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
              <path d="M 0 10 Q 75 40 150 70 T 300 90" fill="none" stroke="#0F172A" strokeWidth="2" />
              <path d="M 0 10 Q 75 40 150 70 T 300 90 L 300 100 L 0 100 Z" fill="rgba(15, 23, 42, 0.05)" />
              <line x1="0" y1="90" x2="300" y2="90" stroke="#f0edef" strokeWidth="1" strokeDasharray="3 3" />
            </svg>
          </div>

          <div className="flex justify-between text-[9px] font-mono font-bold text-[#76777d] mt-2">
            <span>YEAR 1</span>
            <span>YEAR 2</span>
            <span>YEAR 3</span>
            <span>YEAR 4</span>
            <span>YEAR 5</span>
          </div>
        </div>

        {/* Right: Allocation Distribution */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between">
          <span className="text-xs font-bold font-mono tracking-widest text-[#0F172A] uppercase border-b border-[#f0edef] pb-3 mb-4">
            Allocation Distribution by Type
          </span>

          <div className="space-y-4 py-2">
            <div>
              <div className="flex justify-between font-mono text-[10px] text-[#45464d] font-bold mb-1">
                <span>PHYSICAL WORKSTATIONS</span>
                <span>65%</span>
              </div>
              <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#0F172A] h-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-[10px] text-[#45464d] font-bold mb-1">
                <span>DIGITAL NODES & SERVERS</span>
                <span>25%</span>
              </div>
              <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#06b6d4] h-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-[10px] text-[#45464d] font-bold mb-1">
                <span>PERIPHERALS & A/V</span>
                <span>10%</span>
              </div>
              <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#76777d] h-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
