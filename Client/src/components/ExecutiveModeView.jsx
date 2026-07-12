import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  AlertTriangle, 
  Trophy, 
  Calendar, 
  Download, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

export default function ExecutiveModeView() {
  const leaderboard = [
    { name: 'Logistics', score: '98.2%', width: '98.2%' },
    { name: 'Operations', score: '84.5%', width: '84.5%' },
    { name: 'R&D Hub', score: '72.1%', width: '72.1%' },
    { name: 'HR Global', score: '65.0%', width: '65%' }
  ];

  // Booking Heatmap cell densities (0 to 3)
  const heatmapData = [
    [0, 1, 1, 2, 2, 3, 3],
    [0, 1, 2, 3, 3, 1, 0],
    [0, 1, 1, 2, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0]
  ];

  const getHeatmapColor = (density) => {
    switch (density) {
      case 3: return 'bg-[#004f5d]'; // Dark Slate-Cyan
      case 2: return 'bg-[#06b6d4]'; // Accent Cyan
      case 1: return 'bg-[#a5f3fc]'; // Light Cyan
      default: return 'bg-[#ecfeff]'; // Very light/lowest density
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold font-sans text-[#0F172A] leading-tight">
            Executive Command Center
          </h1>
          <p className="text-sm text-[#45464d] mt-1 font-sans">
            Real-time enterprise asset performance & intelligence.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="h-9 px-4 rounded-sm border border-[#e5e4e7] bg-white text-sm font-sans font-semibold text-[#45464d] hover:bg-[#f6f3f5] transition-colors flex items-center gap-1.5 cursor-pointer">
            <Calendar size={14} />
            Last 30 Days
          </button>
          <button className="h-9 px-4 rounded-sm bg-[#0F172A] text-white text-sm font-sans font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer">
            <Download size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* Four Executive Cards (Metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card 1: Global Asset Value */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between min-h-[110px] relative group hover:border-[#76777d] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">
              Global Asset Value
            </span>
            <Wallet size={16} className="text-[#76777d]" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-[#0F172A]">$42,841,200</div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-bold mt-2">
              <TrendingUp size={10} />
              <span>+12.4% vs prev quarter</span>
            </div>
          </div>
        </div>

        {/* Card 2: Asset ROI */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between min-h-[110px] relative group hover:border-[#76777d] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">
              Asset ROI
            </span>
            <TrendingUp size={16} className="text-[#76777d]" />
          </div>
          <div className="mt-2 flex justify-between items-end">
            <div>
              <div className="text-xl font-bold font-mono text-[#0F172A]">18.4%</div>
              <span className="text-[10px] font-sans text-[#76777d]">Efficiency index: <span className="font-semibold text-[#0F172A]">High</span></span>
            </div>
            {/* SVG Sparkline Area Chart */}
            <div className="w-16 h-8 opacity-90 mb-1">
              <svg viewBox="0 0 80 40" className="w-full h-full">
                <defs>
                  <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                <path d="M 0 35 Q 20 15 40 25 T 80 10 L 80 40 L 0 40 Z" fill="url(#roiGrad)" />
                <path d="M 0 35 Q 20 15 40 25 T 80 10" fill="none" stroke="#06b6d4" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 3: Risk Exposure Index */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between min-h-[110px] relative group hover:border-[#76777d] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">
              Risk Exposure Index
            </span>
            <AlertTriangle size={16} className="text-[#76777d]" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-[#0F172A]">Low <span className="text-sm font-normal text-[#76777d]">(2.1)</span></div>
            {/* Custom slider indicator */}
            <div className="bg-gray-100 h-1.5 rounded-full mt-3.5 relative overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: '21%' }}></div>
            </div>
          </div>
        </div>

        {/* Card 4: Top Department */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between min-h-[110px] relative group hover:border-[#76777d] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">
              Top Department
            </span>
            <Trophy size={16} className="text-[#76777d]" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-[#0F172A] font-sans">Logistics</div>
            <div className="text-[10px] font-mono text-[#76777d] mt-2">
              98.2% Utilization
            </div>
          </div>
        </div>

      </div>

      {/* Middle Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left chart (2/3 width): Asset Aging & Lifecycle Analysis */}
        <div className="lg:col-span-2 bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-[#f0edef] pb-3 mb-4">
            <span className="text-xs font-bold font-mono tracking-widest text-[#0F172A] uppercase">
              Asset Aging & Lifecycle Analysis
            </span>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-[#0F172A]">
                <div className="w-2 h-2 bg-[#0f172a] rounded-full"></div>
                <span>OPTIMAL</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-[#06b6d4]">
                <div className="w-2 h-2 bg-[#06b6d4] rounded-full"></div>
                <span>SERVICE REQUIRED</span>
              </div>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="w-full h-64 p-2 flex items-end">
            <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#f0edef" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#f0edef" strokeWidth="1" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#f0edef" strokeWidth="1" />
              <line x1="0" y1="200" x2="500" y2="200" stroke="#dcd9db" strokeWidth="1" />

              {/* Bars */}
              {/* JAN: 50% optimal */}
              <rect x="30" y="100" width="36" height="100" fill="#0F172A" />
              {/* FEB: 40% optimal */}
              <rect x="110" y="120" width="36" height="80" fill="#0F172A" />
              {/* MAR: 80% optimal */}
              <rect x="190" y="40" width="36" height="160" fill="#0F172A" />
              {/* APR: 35% service required */}
              <rect x="270" y="130" width="36" height="70" fill="#06b6d4" />
              {/* MAY: 95% optimal */}
              <rect x="350" y="10" width="36" height="190" fill="#0F172A" />
              {/* JUN: 70% optimal */}
              <rect x="430" y="60" width="36" height="140" fill="#0F172A" />
            </svg>
          </div>

          {/* Months labels */}
          <div className="flex justify-between px-5 pt-2 text-[10px] font-mono font-bold text-[#76777d]">
            <span>JAN</span>
            <span>FEB</span>
            <span>MAR</span>
            <span>APR</span>
            <span>MAY</span>
            <span>JUN</span>
          </div>
        </div>

        {/* Right chart (1/3 width): Audit Center Summary */}
        <div className="lg:col-span-1 bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between">
          <span className="text-xs font-bold font-mono tracking-widest text-[#0F172A] uppercase border-b border-[#f0edef] pb-3 mb-4">
            Audit Center Summary
          </span>

          {/* Circular Donut Ring */}
          <div className="flex items-center justify-center h-40 relative">
            <svg width="130" height="130" viewBox="0 0 36 36" className="transform -rotate-90">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f0edef" strokeWidth="2.5" />
              {/* 85% completion stroke */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0F172A" strokeWidth="2.8" 
                strokeDasharray="85 15" strokeDashoffset="0" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold font-mono text-[#0F172A]">85%</span>
              <span className="text-[9px] font-mono font-bold text-[#76777d] uppercase tracking-wider">completion</span>
            </div>
          </div>

          {/* Rows under completion */}
          <div className="space-y-2 mt-4 pt-4 border-t border-[#f0edef]">
            
            {/* Row 1 */}
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded p-2.5 flex justify-between items-center text-xs font-sans">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span className="font-medium text-[#45464d]">Validated Assets</span>
              </div>
              <span className="font-bold font-mono text-[#0F172A]">1,240</span>
            </div>

            {/* Row 2 */}
            <div className="bg-red-50 text-red-800 border border-red-100 rounded p-2.5 flex justify-between items-center text-xs font-sans">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-red-600" />
                <span className="font-medium text-[#45464d]">Discrepancies</span>
              </div>
              <span className="font-bold font-mono text-red-600">12</span>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Booking Density Heatmap */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg">
          <div className="flex justify-between items-center border-b border-[#f0edef] pb-3 mb-4">
            <span className="text-xs font-bold font-mono tracking-widest text-[#0F172A] uppercase">
              Booking Density Heatmap
            </span>
            <span className="text-[9px] font-bold font-mono text-[#76777d] tracking-wider uppercase">
              PEAK HOURS: 09:00 - 11:00
            </span>
          </div>

          <div className="space-y-2">
            {heatmapData.map((row, rowIdx) => (
              <div key={rowIdx} className="grid grid-cols-7 gap-2">
                {row.map((cell, cellIdx) => (
                  <div 
                    key={cellIdx} 
                    className={`h-9 rounded-sm ${getHeatmapColor(cell)} border border-[#fcf8fa] hover:scale-105 transition-transform cursor-pointer`}
                    title={`Density level: ${cell}`}
                  ></div>
                ))}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2 text-[10px] font-mono font-bold text-[#76777d] text-center select-none">
            <span>SUN</span>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
          </div>
        </div>

        {/* Right: Departmental Efficiency Leaderboard */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between">
          <span className="text-xs font-bold font-mono tracking-widest text-[#0F172A] uppercase border-b border-[#f0edef] pb-3 mb-4">
            Departmental Efficiency Leaderboard
          </span>

          <div className="space-y-4">
            {leaderboard.map((dept, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs font-sans text-[#45464d] font-semibold">
                  <span>{dept.name}</span>
                  <span className="font-mono">{dept.score}</span>
                </div>
                <div className="bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#0F172A] h-full" style={{ width: dept.width }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
