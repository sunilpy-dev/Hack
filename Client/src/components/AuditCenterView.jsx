import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import { auditService } from '../services/auditService.js';

export default function AuditCenterView() {
  const [audits, setAudits] = useState([]);
  const [discrepancyCount, setDiscrepancyCount] = useState(12);

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const list = await auditService.getAll();
        setAudits(list);
        const countData = await auditService.getDiscrepancyCount();
        setDiscrepancyCount(countData.count ?? countData);
      } catch (err) {
        console.error('Error fetching audit data:', err);
      }
    };
    fetchAudits();
  }, []);

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-sans text-[#0F172A] leading-tight">
          Audit & Compliance Center
        </h1>
        <p className="text-sm text-[#45464d] mt-1 font-sans">
          Manage regulatory requirements, automated system verification checks, and hardware audits.
        </p>
      </div>

      {/* Grid Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between min-h-[92px]">
          <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">Overall Compliance Score</span>
          <span className="text-xl font-bold font-mono text-[#0F172A] mt-2">98.4%</span>
        </div>
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between min-h-[92px]">
          <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">Next Scheduled Audit</span>
          <span className="text-xl font-bold font-mono text-[#0F172A] mt-2">Nov 12, 2023</span>
        </div>
        <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg flex flex-col justify-between min-h-[92px]">
          <span className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase">Outstanding Discrepancies</span>
          <span className="text-xl font-bold font-mono text-red-600 mt-2">{discrepancyCount} Items</span>
        </div>
      </div>

      {/* Audit Logs List */}
      <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg space-y-4">
        <span className="text-xs font-bold font-mono tracking-widest text-[#0F172A] uppercase border-b border-[#f0edef] pb-3 block">
          Recent Audit Runs
        </span>

        <div className="divide-y divide-[#f0edef]">
          {audits.map((aud) => {
            const Icon = aud.status === 'COMPLETED' ? CheckCircle2 : aud.status === 'IN PROGRESS' ? RefreshCw : AlertTriangle;
            const color = aud.status === 'COMPLETED' ? 'text-emerald-500 bg-emerald-50' : aud.status === 'IN PROGRESS' ? 'text-blue-500 bg-blue-50' : 'text-amber-500 bg-amber-50';
            return (
              <div key={aud.id} className="py-3 flex justify-between items-center hover:bg-[#fcf8fa] px-2 rounded-sm transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A] font-sans">{aud.name}</h4>
                    <p className="text-[10px] text-[#76777d] font-mono mt-0.5">ID: {aud.id} • Due: {aud.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <span className="text-[9px] font-bold font-mono tracking-wider text-[#76777d] uppercase block">Compliance</span>
                    <span className="text-xs font-mono font-bold text-[#0F172A]">{aud.compliance}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold font-mono tracking-wider text-[#76777d] uppercase block">Status</span>
                    <span className={`text-[10px] font-mono font-bold ${
                      aud.status === 'COMPLETED' ? 'text-emerald-600' : aud.status === 'IN PROGRESS' ? 'text-blue-600 animate-pulse' : 'text-amber-600'
                    }`}>{aud.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
