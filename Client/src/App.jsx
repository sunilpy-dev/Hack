import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import AssetDirectoryView from './components/AssetDirectoryView';
import ResourceBookingView from './components/ResourceBookingView';
import MaintenanceCenterView from './components/MaintenanceCenterView';
import AuditCenterView from './components/AuditCenterView';
import AnalyticsView from './components/AnalyticsView';
import ExecutiveModeView from './components/ExecutiveModeView';

import { assetService } from './services/assetService.js';
import { maintenanceService } from './services/maintenanceService.js';

import { 
  Search, 
  QrCode, 
  Bell, 
  Sparkles, 
  Send, 
  X, 
  Bot,
  User,
  Settings,
  HelpCircle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('directory');

  // Global Assets State
  const [assets, setAssets] = useState([]);

  // Selected Asset for Slide-out detail drawer
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Set default selected asset for directory tab
  useEffect(() => {
    if (!selectedAsset && assets.length > 0) {
      setSelectedAsset(assets[0]);
    }
  }, [assets]);

  // Global Work Orders State for Kanban
  const [workOrders, setWorkOrders] = useState([]);

  // Load initial data from backend
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const assetsData = await assetService.getAll();
        setAssets(assetsData);
        const workOrdersData = await maintenanceService.getAll();
        setWorkOrders(workOrdersData);
      } catch (err) {
        console.error('Error fetching initial data from backend:', err);
      }
    };
    loadInitialData();
  }, []);

  // Modals state
  const [isNewAssetOpen, setIsNewAssetOpen] = useState(false);
  const [isNewWorkOrderOpen, setIsNewWorkOrderOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // AI Assistant Chat state
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Hello, I am your AssetBridge Intelligence Assistant. How can I help you coordinate assets, people, and operations today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Handle AI Insights Generate Work Orders Action
  const handleGenerateWorkOrders = async () => {
    try {
      await maintenanceService.generatePreventative();
      const updatedOrders = await maintenanceService.getAll();
      setWorkOrders(updatedOrders);
    } catch (err) {
      console.error('Error generating work orders:', err);
    }
  };

  // QR code scan simulation
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [qrMessage, setQrMessage] = useState('');
  const handleQrScan = (e) => {
    e.preventDefault();
    const found = assets.find(a => a.sn.toLowerCase() === qrCodeInput.toLowerCase() || a.id.toLowerCase() === qrCodeInput.toLowerCase());
    if (found) {
      setActiveTab('directory');
      setSelectedAsset(found);
      setQrMessage(`Asset found: ${found.name}`);
      setTimeout(() => {
        setIsQrScannerOpen(false);
        setQrMessage('');
        setQrCodeInput('');
      }, 1500);
    } else {
      setQrMessage('Asset not found. Try serial number: AP-2024-X991');
    }
  };

  // AI Chat reply simulation
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      let text = "I am processing that request. You can check the 'Asset Directory' to view assets or the 'Maintenance Center' to manage work orders.";
      const query = chatInput.toLowerCase();
      if (query.includes('status') || query.includes('asset')) {
        text = `You currently have ${assets.length} registered assets, with ${assets.filter(a => a.status === 'ACTIVE').length} active assets and ${assets.filter(a => a.status === 'IN REPAIR').length} in repair.`;
      } else if (query.includes('work') || query.includes('order') || query.includes('maintenance')) {
        text = `You have ${workOrders.length} total work orders. ${workOrders.filter(w => w.status === 'pending').length} are pending, and ${workOrders.filter(w => w.status === 'in_progress').length} are currently in progress.`;
      } else if (query.includes('hi') || query.includes('hello')) {
        text = "Hello! How can I assist you with your operations today?";
      }
      setChatMessages(prev => [...prev, { role: 'assistant', text }]);
    }, 800);
  };

  // Global search handler
  const [globalSearch, setGlobalSearch] = useState('');
  const handleGlobalSearchSubmit = (e) => {
    e.preventDefault();
    if (!globalSearch) return;
    setActiveTab('directory');
    // search in assets
    const found = assets.find(a => a.name.toLowerCase().includes(globalSearch.toLowerCase()) || a.sn.toLowerCase().includes(globalSearch.toLowerCase()));
    if (found) {
      setSelectedAsset(found);
    }
  };

  // Keyboard shortcut for search focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex w-full min-h-screen bg-[#fcf8fa] relative overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Global Header */}
        <header className="h-[60px] bg-white border-b border-[#e5e4e7] px-6 flex items-center justify-between z-10 shrink-0 sticky top-0">
          
          {/* Left search */}
          <form onSubmit={handleGlobalSearchSubmit} className="relative w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#76777d]" />
            <input 
              id="global-search-input"
              type="text" 
              placeholder="Global Search (⌘K)"
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 py-1.5 border border-[#e5e4e7] rounded-sm text-sm focus:border-[#06b6d4] focus:outline-none transition-colors"
            />
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            
            {/* QR Scanner button */}
            <button 
              onClick={() => setIsQrScannerOpen(true)}
              className="p-2 rounded-full hover:bg-[#f6f3f5] text-[#76777d] hover:text-[#0F172A] transition-colors cursor-pointer"
              title="Scan QR Code"
            >
              <QrCode size={20} strokeWidth={1.5} />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 rounded-full hover:bg-[#f6f3f5] text-[#76777d] hover:text-[#0F172A] transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell size={20} strokeWidth={1.5} />
                <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
              </button>
              
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#e5e4e7] shadow-xl rounded-lg p-3 space-y-2 z-50 animate-fade-in text-xs">
                  <div className="flex justify-between items-center border-b border-[#f0edef] pb-2 mb-2 font-mono font-bold uppercase tracking-wider text-[#0F172A]">
                    <span>System Alerts</span>
                    <span className="text-[10px] text-red-500">2 active</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2 rounded bg-red-50/50 border border-red-100">
                      <span className="font-bold text-red-700">Critical: HVAC Unit Alert</span>
                      <p className="text-[#45464d] mt-0.5">Sensor calibration failure detected at Node 04.</p>
                    </div>
                    <div className="p-2 rounded bg-amber-50/50 border border-amber-100">
                      <span className="font-bold text-amber-700">Warning: Overbooking</span>
                      <p className="text-[#45464d] mt-0.5">Conference Room B has a capacity overflow.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Separator line */}
            <div className="h-6 w-px bg-[#e5e4e7]"></div>

            {/* User Profile info */}
            <div className="flex items-center gap-2.5 select-none">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-[#0F172A] font-sans">Alex Stratton</div>
                <div className="text-[10px] text-[#76777d] font-mono font-medium leading-none mt-0.5">Director of Ops</div>
              </div>
              
              {/* User avatar profile image */}
              <div className="w-8 h-8 rounded-full border border-[#e5e4e7] overflow-hidden flex items-center justify-center bg-slate-900 text-white font-mono text-xs font-bold">
                AS
              </div>
            </div>

          </div>

        </header>

        {/* Dynamic Views Switcher */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'dashboard' && (
            <DashboardView 
              onOpenNewAsset={() => {
                setActiveTab('directory');
                setIsNewAssetOpen(true);
              }}
              onGenerateWorkOrders={handleGenerateWorkOrders}
              workOrdersCount={workOrders.length}
            />
          )}

          {activeTab === 'directory' && (
            <AssetDirectoryView 
              assets={assets}
              setAssets={setAssets}
              selectedAsset={selectedAsset}
              setSelectedAsset={setSelectedAsset}
              isNewAssetOpen={isNewAssetOpen}
              setIsNewAssetOpen={setIsNewAssetOpen}
            />
          )}

          {activeTab === 'booking' && (
            <ResourceBookingView 
              onOpenNewWorkOrder={() => {
                setActiveTab('maintenance');
                setIsNewWorkOrderOpen(true);
              }}
            />
          )}

          {activeTab === 'maintenance' && (
            <MaintenanceCenterView 
              workOrders={workOrders}
              setWorkOrders={setWorkOrders}
              isNewWorkOrderOpen={isNewWorkOrderOpen}
              setIsNewWorkOrderOpen={setIsNewWorkOrderOpen}
            />
          )}

          {activeTab === 'audit' && <AuditCenterView />}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'executive' && <ExecutiveModeView />}

          {activeTab === 'settings' && (
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <h1 className="text-2xl font-bold font-sans text-[#0F172A]">Settings</h1>
              <p className="text-sm text-[#45464d]">Configure platform-wide asset synchronization, notification rules, and operator credentials.</p>
              <div className="bg-white border border-[#e5e4e7] rounded-lg p-6 max-w-md space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase block">Synchronization Interval</label>
                  <select className="w-full h-9 border border-[#e5e4e7] rounded px-3 text-sm bg-white">
                    <option>Real-Time (Webhook)</option>
                    <option>Every 5 Minutes</option>
                    <option>Hourly</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="email-alert" className="accent-[#06b6d4] h-4 w-4" defaultChecked />
                  <label htmlFor="email-alert" className="text-xs font-semibold text-[#45464d] select-none cursor-pointer">Send email digests on critical hardware exceptions</label>
                </div>
                <button className="h-9 px-4 rounded bg-[#0F172A] hover:bg-slate-800 text-white font-bold font-mono tracking-wider text-xs uppercase cursor-pointer">
                  Save Configuration
                </button>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <h1 className="text-2xl font-bold font-sans text-[#0F172A]">System Support</h1>
              <p className="text-sm text-[#45464d]">Connect with enterprise administrators, reference developer documentation, or file service logs.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg space-y-2">
                  <h3 className="font-bold text-sm text-[#0F172A]">Developer API References</h3>
                  <p className="text-xs text-[#76777d] leading-relaxed">Access endpoints for asset inventory management, lifecycle timeline callbacks, and work order syncing.</p>
                  <a href="#" className="text-xs font-bold text-cyan-600 hover:underline block pt-1">docs.assetbridge.net →</a>
                </div>
                <div className="bg-white border border-[#e5e4e7] p-4 rounded-lg space-y-2">
                  <h3 className="font-bold text-sm text-[#0F172A]">File Operations Ticket</h3>
                  <p className="text-xs text-[#76777d] leading-relaxed">Instantly bundle active console registries and system telemetry, then route directly to technical support.</p>
                  <button className="h-8 px-3 bg-[#0F172A] hover:bg-slate-800 text-white rounded text-[10px] font-bold font-mono uppercase tracking-wider cursor-pointer">
                    Bundle & Upload Logs
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* AI Assistant Chat Drawer */}
      {isAiAssistantOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-[#e5e4e7] shadow-2xl z-50 flex flex-col justify-between animate-slide-in select-none">
          <div className="p-4 border-b border-[#e5e4e7] flex justify-between items-center bg-[#131b2e] text-white">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-[#06b6d4]" />
              <span className="font-bold font-mono tracking-widest text-xs uppercase">AI Assistant</span>
            </div>
            <button 
              onClick={() => setIsAiAssistantOpen(false)}
              className="text-[#7c839b] hover:text-white p-1 rounded-full hover:bg-slate-800 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fcf8fa]">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-[85%] text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#0F172A] text-white rounded-br-none' 
                    : 'bg-white border border-[#e5e4e7] text-[#1b1b1d] rounded-bl-none shadow-xs'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChatMessage} className="p-3 border-t border-[#e5e4e7] bg-white flex gap-2">
            <input 
              type="text" 
              placeholder="Ask AI Assistant..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              className="flex-1 h-9 px-3 border border-[#e5e4e7] rounded-sm text-xs focus:border-[#06b6d4] focus:outline-none"
            />
            <button 
              type="submit"
              className="h-9 w-9 bg-[#0F172A] text-white hover:bg-slate-800 rounded-sm flex items-center justify-center transition-colors cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* QR Scanner Dialog Modal */}
      {isQrScannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center select-none">
          <div className="bg-white border border-[#e5e4e7] rounded-xl w-80 p-6 shadow-2xl animate-fade-in text-center relative">
            <button 
              onClick={() => {
                setIsQrScannerOpen(false);
                setQrMessage('');
                setQrCodeInput('');
              }}
              className="absolute top-4 right-4 text-[#76777d] hover:text-[#0F172A] p-1 rounded-full hover:bg-[#f6f3f5] cursor-pointer"
            >
              <X size={18} />
            </button>

            <h2 className="text-sm font-bold font-mono tracking-wider text-[#0F172A] uppercase mb-4">Simulate QR Scanner</h2>
            
            {/* Scanner Area preview */}
            <div className="w-40 h-40 border-4 border-dashed border-[#06b6d4] mx-auto rounded-lg flex items-center justify-center relative bg-[#fcf8fa] mb-4">
              <div className="absolute inset-0 bg-[#06b6d4]/5 flex flex-col items-center justify-center p-3">
                <QrCode size={64} className="text-[#76777d] opacity-40 animate-pulse" />
              </div>
            </div>

            <form onSubmit={handleQrScan} className="space-y-3">
              <input 
                type="text" 
                required
                placeholder="Enter Serial Number or ID"
                value={qrCodeInput}
                onChange={e => setQrCodeInput(e.target.value)}
                className="w-full h-8 text-center border border-[#e5e4e7] rounded text-xs focus:outline-none focus:border-[#06b6d4]"
              />
              <button 
                type="submit"
                className="w-full h-8 bg-[#0F172A] text-white hover:bg-slate-800 text-xs font-bold font-mono uppercase tracking-wider rounded cursor-pointer"
              >
                Scan Code
              </button>
            </form>

            {qrMessage && (
              <p className="text-[11px] font-mono font-semibold text-[#06b6d4] mt-3 animate-pulse">{qrMessage}</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
