import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderTree, 
  CalendarRange, 
  Wrench, 
  FileCheck, 
  BarChart3, 
  ShieldAlert, 
  Settings, 
  HelpCircle, 
  Bot, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare,
  Send,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenAiAssistant }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'directory', label: 'Asset Directory', icon: FolderTree },
    { id: 'booking', label: 'Resource Booking', icon: CalendarRange },
    { id: 'maintenance', label: 'Maintenance Center', icon: Wrench },
    { id: 'audit', label: 'Audit Center', icon: FileCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'executive', label: 'Executive Mode', icon: ShieldAlert },
  ];

  return (
    <div 
      className={`bg-white border-r border-[#e5e4e7] flex flex-col justify-between transition-all duration-300 relative z-20 select-none ${
        isCollapsed ? 'w-16' : 'w-60'
      } h-screen sticky top-0`}
    >
      {/* Collapse/Expand Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-6 -right-3 w-6 h-6 rounded-full bg-white border border-[#e5e4e7] flex items-center justify-center hover:bg-[#f6f3f5] text-[#76777d] transition-colors cursor-pointer"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div>
        {/* Logo Section */}
        <div className={`p-4 border-b border-[#e5e4e7] ${isCollapsed ? 'items-center' : 'items-start'} flex flex-col justify-center min-h-[90px]`}>
          {!isCollapsed ? (
            <div className="w-full">
              <div className="flex items-center gap-2">
                {/* Custom Bridge Graphic representing Logo */}
                <div className="w-6 h-6 flex flex-col justify-between shrink-0">
                  <div className="h-1.5 w-full bg-[#0F172A] rounded-sm"></div>
                  <div className="flex justify-between w-full">
                    <div className="h-2 w-1.5 bg-[#06b6d4] rounded-sm"></div>
                    <div className="h-2 w-1.5 bg-[#06b6d4] rounded-sm"></div>
                  </div>
                  <div className="h-1.5 w-full bg-[#0F172A] rounded-sm"></div>
                </div>
                <span className="font-bold text-xl tracking-tight text-[#0F172A] font-sans">
                  AssetBridge
                </span>
              </div>
              <p className="text-[10px] text-[#76777d] mt-1 font-medium font-sans uppercase tracking-wider leading-tight">
                Connecting Assets, People, and Operations
              </p>
            </div>
          ) : (
            <div className="w-8 h-8 mx-auto flex flex-col justify-between p-1 border border-[#e5e4e7] rounded">
              <div className="h-1 w-full bg-[#0F172A] rounded-sm"></div>
              <div className="flex justify-between w-full">
                <div className="h-1.5 w-1 bg-[#06b6d4] rounded-sm"></div>
                <div className="h-1.5 w-1 bg-[#06b6d4] rounded-sm"></div>
              </div>
              <div className="h-1 w-full bg-[#0F172A] rounded-sm"></div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="p-2 space-y-1 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center rounded-sm py-2 px-3 transition-all relative group cursor-pointer ${
                  isActive 
                    ? 'text-[#0F172A] font-semibold bg-[#e6f7fa] glow-accent-sm' 
                    : 'text-[#45464d] hover:bg-[#f6f3f5] font-medium'
                }`}
              >
                {/* Active Left Border indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#06b6d4]"></div>
                )}
                
                <Icon 
                  size={20} 
                  strokeWidth={1.5}
                  className={`shrink-0 ${isActive ? 'text-[#06b6d4]' : 'text-[#76777d]'}`} 
                />
                
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-sans truncate">
                    {item.label}
                  </span>
                )}

                {isCollapsed && (
                  <div className="absolute left-14 bg-[#0F172A] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions Section */}
      <div className="p-2 space-y-1 border-t border-[#e5e4e7]">
        {/* AI Assistant button */}
        <button
          onClick={onOpenAiAssistant}
          className={`w-full flex items-center bg-[#0F172A] text-white hover:bg-slate-800 transition-colors p-2.5 rounded-sm relative group cursor-pointer justify-center mb-2`}
        >
          <Bot size={18} className="shrink-0 text-[#06b6d4]" />
          {!isCollapsed && (
            <span className="ml-2 text-xs font-bold font-mono tracking-wider uppercase">
              AI Assistant
            </span>
          )}
          {isCollapsed && (
            <div className="absolute left-14 bg-[#0F172A] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              AI Assistant
            </div>
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center text-[#45464d] hover:bg-[#f6f3f5] rounded-sm py-2 px-3 transition-colors cursor-pointer ${
            activeTab === 'settings' ? 'bg-[#f0edef] font-semibold text-[#0F172A]' : 'font-medium'
          }`}
        >
          <Settings size={20} strokeWidth={1.5} className="text-[#76777d]" />
          {!isCollapsed && <span className="ml-3 text-sm font-sans">Settings</span>}
        </button>

        {/* Support button */}
        <button
          onClick={() => setActiveTab('support')}
          className={`w-full flex items-center text-[#45464d] hover:bg-[#f6f3f5] rounded-sm py-2 px-3 transition-colors cursor-pointer ${
            activeTab === 'support' ? 'bg-[#f0edef] font-semibold text-[#0F172A]' : 'font-medium'
          }`}
        >
          <HelpCircle size={20} strokeWidth={1.5} className="text-[#76777d]" />
          {!isCollapsed && <span className="ml-3 text-sm font-sans">Support</span>}
        </button>
      </div>
    </div>
  );
}
