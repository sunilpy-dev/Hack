import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService.js';
import { 
  Box, 
  Gauge, 
  ShieldAlert, 
  Calendar, 
  FileSpreadsheet, 
  Sparkles,
  Lock,
  ArrowUpRight,
  Wifi,
  Plus
} from 'lucide-react';

export default function DashboardView({ currentUser, onOpenNewAsset, onGenerateWorkOrders, workOrdersCount }) {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalAssets: 1248,
    utilizationRate: 84,
    maintenanceRisk: 'Low',
    efficiencyIndex: 92,
    auditCompliance: 98,
    outstandingDiscrepancies: 12
  });

  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await dashboardService.getStats();
        setStats(statsData);
        const logsData = await dashboardService.getLogs();
        setLogs(logsData);
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
      }
    };
    fetchDashboardData();
  }, [workOrdersCount]);

  const triggerGenerateWorkOrders = () => {
    if (onGenerateWorkOrders) {
      onGenerateWorkOrders();
      setNotification('Generated 12 preventative work orders in Maintenance Center!');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#0F172A] text-white py-3 px-4 rounded-sm border-l-4 border-[#06b6d4] shadow-md flex items-center gap-2 animate-bounce">
          <Sparkles size={16} className="text-[#06b6d4]" />
          <span className="text-xs font-mono">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold font-sans text-[#0F172A] leading-tight">
            Asset Intelligence Overview
          </h1>
          <p className="text-sm text-[#45464d] mt-1 font-sans">
            Real-time resource synthesis & predictive health metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="h-9 px-4 rounded-sm border border-[#e5e4e7] bg-white text-sm font-sans font-semibold text-[#45464d] hover:bg-[#f6f3f5] transition-colors cursor-pointer">
            Export Report
          </button>
          {(currentUser?.permissions?.includes('asset.create') || currentUser?.role === 'Admin') && (
            <button 
              onClick={onOpenNewAsset}
              className="h-9 px-4 rounded-sm bg-[#0F172A] text-white text-sm font-sans font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={16} />
              Provision Asset
            </button>
          )}
        </div>
      </div>

      {/* Five Executive Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Card 1: Total Assets */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between min-h-[108px] relative group hover:border-[#76777d] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">
              Total Assets
            </span>
            <Box size={16} className="text-[#76777d] group-hover:text-[#06b6d4] transition-colors" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-[#0F172A]">{stats.totalAssets.toLocaleString()}</div>
            {/* Mini bar chart */}
            <div className="flex gap-0.5 items-end h-5 mt-1.5">
              <div className="w-4 bg-gray-200 h-2 rounded-xs"></div>
              <div className="w-4 bg-gray-300 h-3 rounded-xs"></div>
              <div className="w-4 bg-gray-200 h-1.5 rounded-xs"></div>
              <div className="w-4 bg-gray-400 h-4 rounded-xs"></div>
              <div className="w-4 bg-[#0F172A] h-5 rounded-xs"></div>
            </div>
          </div>
        </div>

        {/* Card 2: Utilization */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between min-h-[108px] relative group hover:border-[#76777d] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">
              Utilization
            </span>
            <Gauge size={16} className="text-[#76777d] group-hover:text-[#06b6d4] transition-colors" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-[#0F172A]">{stats.utilizationRate}%</div>
            <div className="flex items-center gap-2 mt-3.5">
              <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#0F172A] h-full rounded-full" style={{ width: `${stats.utilizationRate}%` }}></div>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 shrink-0">+2.4%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Maint. Risk */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between min-h-[108px] relative group hover:border-[#76777d] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">
              Maint. Risk
            </span>
            <ShieldAlert size={16} className="text-[#76777d] group-hover:text-[#06b6d4] transition-colors" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-[#0F172A] uppercase">{stats.maintenanceRisk}</div>
            <div className="flex gap-1 items-center mt-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>

        {/* Card 4: Efficiency */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between min-h-[108px] relative group hover:border-[#76777d] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">
              Efficiency
            </span>
            <Calendar size={16} className="text-[#76777d] group-hover:text-[#06b6d4] transition-colors" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-[#0F172A]">{stats.efficiencyIndex}%</div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-[#76777d] mt-4">
              <ArrowUpRight size={10} className="text-emerald-500" />
              <span>Benchmark: 88%</span>
            </div>
          </div>
        </div>

        {/* Card 5: Audit Comp. */}
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between min-h-[108px] relative group hover:border-[#76777d] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">
              Audit Comp.
            </span>
            <Lock size={14} className="text-[#76777d]" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-[#0F172A]">{stats.auditCompliance}%</div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#76777d] mt-4">
              <span>Tier 1 Standing</span>
              <span className="font-semibold text-xs tracking-widest text-[#0F172A] uppercase">Locked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Insights & Heatmap */}
        <div className="lg:col-span-1 space-y-6 flex flex-col justify-between">
          {/* AI Insights Engine Card */}
          <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col flex-1">
            <div className="flex items-center gap-2 border-b border-[#e5e4e7] pb-3 mb-4">
              <Sparkles size={16} className="text-[#06b6d4]" />
              <span className="text-xs font-bold font-mono tracking-widest text-[#0F172A] uppercase">
                AI Insights Engine
              </span>
            </div>
            
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              {/* Alert 1 */}
              <div className="bg-slate-900 text-white p-3 rounded-md flex flex-col justify-between">
                <div className="flex justify-between text-[10px] font-mono text-[#7c839b] font-semibold">
                  <span className="tracking-wider text-[#06b6d4]">PREDICTIVE ALERT</span>
                  <span>2m ago</span>
                </div>
                <p className="text-xs mt-1.5 font-medium leading-relaxed font-sans text-slate-200">
                  12 assets require immediate preventative maintenance based on cycle logs.
                </p>
                <button 
                  onClick={triggerGenerateWorkOrders}
                  className="mt-3 text-[10px] font-bold font-mono tracking-wider text-white hover:text-[#06b6d4] transition-colors cursor-pointer text-left self-start"
                >
                  GENERATE WORK ORDERS →
                </button>
              </div>

              {/* Alert 2 */}
              <div className="bg-slate-900 text-white p-3 rounded-md flex flex-col justify-between">
                <div className="flex justify-between text-[10px] font-mono text-[#7c839b] font-semibold">
                  <span className="tracking-wider text-[#06b6d4]">ANOMALY DETECTED</span>
                  <span>15m ago</span>
                </div>
                <p className="text-xs mt-1.5 font-medium leading-relaxed font-sans text-slate-200">
                  Conference Room B overbooked by 140% for the next 4 hours.
                </p>
                <button className="mt-3 text-[10px] font-bold font-mono tracking-wider text-white hover:text-[#06b6d4] transition-colors cursor-pointer text-left self-start">
                  REALLOCATE NOW →
                </button>
              </div>

              {/* Alert 3 */}
              <div className="bg-slate-900 text-white p-3 rounded-md flex flex-col justify-between">
                <div className="flex justify-between text-[10px] font-mono text-[#7c839b] font-semibold">
                  <span className="tracking-wider text-[#06b6d4]">OPTIMIZATION</span>
                  <span>1h ago</span>
                </div>
                <p className="text-xs mt-1.5 font-medium leading-relaxed font-sans text-slate-200">
                  Unused server capacity detected in Node 7.
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[10px] font-mono text-[#7c839b]">Est. savings: $1,240/mo</span>
                  <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-bold">RECOMMENDED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resource Heatmap Card */}
          <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg">
            <span className="text-xs font-bold font-mono tracking-wider text-[#76777d] uppercase">
              Resource Heatmap
            </span>
            <div className="grid grid-cols-5 gap-2 mt-3">
              <div className="aspect-square bg-gray-100 rounded-sm hover:scale-105 transition-transform" title="Density: Low"></div>
              <div className="aspect-square bg-gray-200 rounded-sm hover:scale-105 transition-transform" title="Density: Medium-Low"></div>
              <div className="aspect-square bg-gray-400 rounded-sm hover:scale-105 transition-transform" title="Density: Medium"></div>
              <div className="aspect-square bg-gray-700 rounded-sm hover:scale-105 transition-transform" title="Density: High"></div>
              <div className="aspect-square bg-black rounded-sm hover:scale-105 transition-transform" title="Density: Peak"></div>
              
              <div className="aspect-square bg-gray-300 rounded-sm hover:scale-105 transition-transform"></div>
              <div className="aspect-square bg-gray-500 rounded-sm hover:scale-105 transition-transform"></div>
              <div className="aspect-square bg-gray-100 rounded-sm hover:scale-105 transition-transform"></div>
              <div className="aspect-square bg-gray-300 rounded-sm hover:scale-105 transition-transform"></div>
              <div className="aspect-square bg-gray-600 rounded-sm hover:scale-105 transition-transform"></div>
            </div>
            <p className="text-[11px] text-[#76777d] font-sans mt-3">
              Visualizing 24h utilization density across global nodes.
            </p>
          </div>
        </div>

        {/* Right Column (take 2/3 width on desktop): Map & Log Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Global Distribution Map Card */}
          <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg relative min-h-[300px] flex flex-col justify-between overflow-hidden">
            <div className="flex justify-between items-center z-10">
              <div>
                <span className="text-xs font-bold font-mono tracking-wider text-[#0F172A] uppercase">
                  Global Distribution
                </span>
                <div className="flex gap-3 mt-1.5">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#45464d]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0F172A]"></div>
                    <span>Active</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#45464d]">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                    <span>Idle</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 border border-[#e5e4e7] py-1 px-2.5 rounded-sm flex items-center gap-1.5 text-[10px] font-mono text-[#0F172A]">
                <Wifi size={10} className="text-[#06b6d4] animate-pulse" />
                <span>Live Feed: Node 04_BKLYN</span>
              </div>
            </div>

            {/* Custom SVG World Map Grid Representation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6 mt-10">
              <svg width="100%" height="100%" viewBox="0 0 600 240" className="opacity-95">
                {/* World map grid coordinates placeholder dots */}
                <g fill="#eae7e9">
                  {/* Stylized world grid dots */}
                  {Array.from({ length: 28 }).map((_, i) => (
                    <circle key={i} cx={((i % 7) * 80) + 40 + (Math.sin(i) * 10)} cy={((Math.floor(i / 7)) * 50) + 30 + (Math.cos(i) * 5)} r="1.5" />
                  ))}
                  {Array.from({ length: 30 }).map((_, i) => (
                    <circle key={i+30} cx={((i % 6) * 90) + 60 + (Math.cos(i) * 8)} cy={((Math.floor(i / 6)) * 40) + 50 + (Math.sin(i) * 8)} r="1.5" />
                  ))}
                </g>
                
                {/* Network Connections */}
                <path d="M 120 70 Q 200 40 320 100 T 480 80" fill="none" stroke="#dcd9db" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 320 100 Q 260 140 180 160" fill="none" stroke="#dcd9db" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 320 100 Q 420 160 500 130" fill="none" stroke="#dcd9db" strokeWidth="1" strokeDasharray="3 3" />

                {/* Pulsing Active Nodes */}
                <g>
                  {/* NY HQ Node */}
                  <circle cx="120" cy="70" r="8" fill="rgba(6, 182, 212, 0.15)" className="animate-ping" style={{ transformOrigin: '120px 70px' }} />
                  <circle cx="120" cy="70" r="4" fill="#0F172A" />
                  <circle cx="120" cy="70" r="2" fill="#06b6d4" />
                  <text x="132" y="74" fill="#45464d" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">US-EST-1</text>

                  {/* London Node */}
                  <circle cx="320" cy="100" r="8" fill="rgba(6, 182, 212, 0.15)" className="animate-ping" style={{ transformOrigin: '320px 100px' }} />
                  <circle cx="320" cy="100" r="4" fill="#0F172A" />
                  <circle cx="320" cy="100" r="2" fill="#06b6d4" />
                  <text x="332" y="104" fill="#45464d" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">EU-WEST-2</text>

                  {/* Tokyo Node */}
                  <circle cx="480" cy="80" r="4" fill="gray" opacity="0.5" />
                  <text x="492" y="84" fill="#76777d" fontSize="9" fontFamily="JetBrains Mono">AP-NE-1</text>

                  {/* Sydney Node */}
                  <circle cx="500" cy="130" r="4" fill="#0F172A" />
                  <circle cx="500" cy="130" r="2" fill="#06b6d4" />
                  <text x="512" y="134" fill="#45464d" fontSize="9" fontFamily="JetBrains Mono">AP-SE-2</text>

                  {/* São Paulo Node */}
                  <circle cx="180" cy="160" r="4" fill="gray" opacity="0.5" />
                  <text x="192" y="164" fill="#76777d" fontSize="9" fontFamily="JetBrains Mono">SA-EAST-1</text>
                </g>
              </svg>
            </div>
            
            {/* Background Mesh styling */}
            <div className="h-44 w-full"></div>
          </div>

          {/* System Log - Assets Table */}
          <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-[#e5e4e7] pb-3 mb-3">
              <span className="text-xs font-bold font-mono tracking-widest text-[#0F172A] uppercase">
                System Log – Assets
              </span>
              <button className="text-[10px] font-bold font-mono tracking-wider text-[#0F172A] hover:text-[#06b6d4] transition-colors cursor-pointer">
                VIEW ALL LOGS
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#f0edef]">
                    <th className="py-2.5 text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">Asset ID</th>
                    <th className="py-2.5 text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">Status</th>
                    <th className="py-2.5 text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">Operator</th>
                    <th className="py-2.5 text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase text-right">Log Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f6f3f5]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#fcf8fa] transition-colors group">
                      <td className="py-3 text-xs font-mono font-semibold text-[#0F172A]">{log.id}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 text-[9px] font-bold font-mono border rounded-full tracking-wide inline-flex items-center ${log.statusColor}`}>
                          <span className="w-1 h-1 rounded-full bg-current mr-1"></span>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 text-xs font-sans text-[#45464d]">{log.operator}</td>
                      <td className="py-3 text-xs font-mono text-[#76777d] text-right">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Systems operational status banner */}
      <div className="border-t border-[#e5e4e7] pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-[#76777d] gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-[#45464d] tracking-wider">SYSTEMS OPERATIONAL</span>
          </div>
          <div className="h-3 w-px bg-[#e5e4e7]"></div>
          <span>Region: us-east-1</span>
        </div>
        <div>
          <span>© 2024 ASSETBRIDGE SOLUTIONS. ALL RIGHTS RESERVED.</span>
        </div>
      </div>
    </div>
  );
}
