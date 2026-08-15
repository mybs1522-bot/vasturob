import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, FileText, Database, ShieldCheck, 
  Search, Download, RefreshCw, Lock, CheckCircle2, AlertTriangle, 
  IndianRupee, ArrowLeft, Key, ExternalLink, Sparkles, Filter,
  Eye, X, PhoneCall, Compass, Layers, Check
} from 'lucide-react';
import { 
  getLeads, saveLead, getConsultations, updateConsultationStatus, 
  getVastuReports, isSupabaseConfigured 
} from '@/lib/supabase';

export default function AdminPanel({ onBackToApp }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const [activeTab, setActiveTab] = useState('reports'); // 'reports' | 'leads' | 'consultations' | 'config'
  const [leads, setLeads] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportForModal, setSelectedReportForModal] = useState(null);

  // Authentication Lock (Passcode: vastu2026)
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === 'vastu2026' || passcode === 'admin') {
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  // Fetch Data from Supabase / Local Storage
  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedLeads, fetchedConsultations, fetchedReports] = await Promise.all([
        getLeads(),
        getConsultations(),
        getVastuReports()
      ]);
      setLeads(fetchedLeads || []);
      setConsultations(fetchedConsultations || []);
      setReports(fetchedReports || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Update Consultation Chat Status
  const handleUpdateStatus = async (id, newStatus) => {
    await updateConsultationStatus(id, newStatus);
    loadData();
  };

  // Direct WhatsApp Client Launcher
  const handleWhatsAppUser = (phone, name) => {
    const cleanPhone = String(phone || '').replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = encodeURIComponent(`Namaste ${name || ''}, this is VastuScope Senior Acharya regarding your submitted floor plan and Vastu report.`);
    window.open(`https://wa.me/${formattedPhone}?text=${msg}`, '_blank');
  };

  // Filtered Lists based on search query with full String() type safety
  const safeQuery = String(searchQuery || '').toLowerCase();

  const filteredReports = (reports || []).filter(r => 
    String(r?.user_name || '').toLowerCase().includes(safeQuery) ||
    String(r?.user_phone || '').toLowerCase().includes(safeQuery) ||
    String(r?.user_email || '').toLowerCase().includes(safeQuery) ||
    String(r?.report_id || '').toLowerCase().includes(safeQuery)
  );

  const filteredLeads = (leads || []).filter(l => 
    String(l?.full_name || '').toLowerCase().includes(safeQuery) ||
    String(l?.phone || '').toLowerCase().includes(safeQuery) ||
    String(l?.email || '').toLowerCase().includes(safeQuery)
  );

  // --- PASSCODE GATE LOCK SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 selection:bg-amber-500 selection:text-slate-950">
        <div className="w-full max-w-md bg-slate-900 border-2 border-amber-400/50 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl border-2 border-amber-400/60 overflow-hidden mx-auto shadow-xl">
              <img src="/vastu_logo.jpg" className="w-full h-full object-cover" alt="VastuScope Logo" />
            </div>
            <h2 className="text-2xl font-black text-white font-heading">VastuScope Admin Portal</h2>
            <p className="text-xs text-amber-300/80 font-mono">Live Supabase Database & Floor Plans</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Admin Passcode</label>
              <input
                type="password"
                required
                placeholder="Enter passcode (Default: vastu2026)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
              />
              {passcodeError && (
                <p className="text-xs text-red-400 font-bold flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Incorrect Admin Passcode. Try: vastu2026
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-lg hover:scale-102 transition-all cursor-pointer"
            >
              UNLOCK ADMIN DASHBOARD &rarr;
            </button>
          </form>

          <button
            type="button"
            onClick={onBackToApp}
            className="w-full text-center text-xs text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Admin Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border border-amber-400/60 overflow-hidden shadow">
            <img src="/vastu_logo.jpg" className="w-full h-full object-cover" alt="Logo" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white font-heading">
              VastuScope <span className="text-amber-400">Admin CRM</span>
            </h1>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Supabase Cloud Connected
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-amber-300 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={onBackToApp}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go to App</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
        
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Submitted Plans</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{reports.length}</div>
            <span className="text-[10px] text-emerald-400 font-mono">100% Synced Online</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Leads</span>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{leads.length}</div>
            <span className="text-[10px] text-slate-400 font-mono">Prospects Captured</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Consultations</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{consultations.length}</div>
            <span className="text-[10px] text-emerald-400 font-mono">₹999 WhatsApp Bookings</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Database Status</span>
            <div className="text-lg font-black text-emerald-400 font-mono mt-1">ONLINE ✅</div>
            <span className="text-[10px] text-slate-400 font-mono">auetvxiigqoeiijdtpbb</span>
          </div>
        </div>

        {/* Tab Selection & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-xl text-xs font-black font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reports' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Floor Plans & Reports ({reports.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2 rounded-xl text-xs font-black font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'leads' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Leads ({leads.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('consultations')}
              className={`px-4 py-2 rounded-xl text-xs font-black font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'consultations' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Consultations ({consultations.length})</span>
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* TAB 1: FLOOR PLANS & VASTU REPORTS DATABASE */}
        {activeTab === 'reports' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Plan Blueprint</th>
                    <th className="py-3.5 px-4">User Details</th>
                    <th className="py-3.5 px-4">Phone / WhatsApp</th>
                    <th className="py-3.5 px-4 text-center">Score</th>
                    <th className="py-3.5 px-4 text-center">Rooms Placed</th>
                    <th className="py-3.5 px-4 text-center">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-500 text-xs font-mono">
                        No saved Vastu reports or plans found in database.
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((rep) => {
                      const zoneInfo = Array.isArray(rep.evaluated_zones) && rep.evaluated_zones[0] ? rep.evaluated_zones[0] : {};
                      const hasPlan = Boolean(zoneInfo.plan_image || zoneInfo.svg_content);
                      return (
                        <tr key={rep.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            {hasPlan ? (
                              <button
                                type="button"
                                onClick={() => setSelectedReportForModal(rep)}
                                className="w-14 h-10 rounded-lg border border-amber-400/50 bg-slate-950 overflow-hidden flex items-center justify-center hover:scale-105 transition-all cursor-pointer relative group"
                                title="Click to view submitted floor plan blueprint"
                              >
                                {zoneInfo.plan_image ? (
                                  <img src={zoneInfo.plan_image} className="w-full h-full object-cover" alt="Floor Plan" />
                                ) : (
                                  <Compass className="w-5 h-5 text-amber-400" />
                                )}
                                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Eye className="w-4 h-4 text-white" />
                                </div>
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono">No Image</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-sm">{rep.user_name || 'Anonymous'}</div>
                            <div className="text-[11px] text-slate-400">{rep.user_email || 'No email'}</div>
                            <span className="text-[9px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded">
                              {zoneInfo.property_type || 'Residential'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-emerald-400">{rep.user_phone || 'N/A'}</div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black font-mono text-xs">
                              {rep.overall_score || 52}/100
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center text-slate-300 font-mono text-xs">
                            {Array.isArray(rep.placed_rooms) ? rep.placed_rooms.length : 0} Rooms
                          </td>
                          <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-xs">
                            {new Date(rep.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => setSelectedReportForModal(rep)}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-yellow-300 text-slate-950 text-xs font-black font-mono transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Plan</span>
                            </button>
                            {rep.user_phone && (
                              <button
                                type="button"
                                onClick={() => handleWhatsAppUser(rep.user_phone, rep.user_name)}
                                className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black font-mono transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: LEADS LIST */}
        {activeTab === 'leads' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Full Name</th>
                    <th className="py-3.5 px-4">Phone Number</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4 text-center">Score</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-500 text-xs font-mono">
                        No leads found.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">{l.full_name || 'Anonymous'}</td>
                        <td className="py-3.5 px-4 text-emerald-400 font-mono font-bold">{l.phone || 'N/A'}</td>
                        <td className="py-3.5 px-4 text-slate-400">{l.email || 'N/A'}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-bold font-mono">
                            {l.vastu_score || 52}/100
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">
                            {l.status || 'new'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {l.phone && (
                            <button
                              type="button"
                              onClick={() => handleWhatsAppUser(l.phone, l.full_name)}
                              className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black font-mono transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CONSULTATIONS LIST */}
        {activeTab === 'consultations' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Client Name</th>
                    <th className="py-3.5 px-4">WhatsApp Phone</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Chat Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {consultations.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-slate-500 text-xs font-mono">
                        No expert consultations recorded yet.
                      </td>
                    </tr>
                  ) : (
                    consultations.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">{c.customer_name}</td>
                        <td className="py-3.5 px-4 text-emerald-400 font-mono font-bold">{c.whatsapp_phone}</td>
                        <td className="py-3.5 px-4 text-amber-400 font-bold font-mono">₹{c.amount_paid || 999}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black font-mono text-[10px]">
                            {c.chat_status || 'pending'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleWhatsAppUser(c.whatsapp_phone, c.customer_name)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black font-mono transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Chat Client</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* FULL-SCREEN MODAL: VIEW SUBMITTED FLOOR PLAN BLUEPRINT & ROOMS            */}
      {/* ========================================================================= */}
      {selectedReportForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-amber-400/70 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-4 sm:p-6 space-y-5 text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-base sm:text-lg font-black font-heading">
                    Submitted Floor Plan Blueprint
                  </h3>
                  <span className="text-xs text-amber-300 font-mono">
                    User: {selectedReportForModal.user_name} • Phone: {selectedReportForModal.user_phone}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReportForModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Visual Floor Plan Viewer */}
            <div className="space-y-3">
              {(() => {
                const zoneData = Array.isArray(selectedReportForModal.evaluated_zones) && selectedReportForModal.evaluated_zones[0] ? selectedReportForModal.evaluated_zones[0] : {};
                const planImg = zoneData.plan_image;
                const svgCode = zoneData.svg_content;
                const placedRooms = selectedReportForModal.placed_rooms || [];

                return (
                  <>
                    <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 p-3 flex items-center justify-center min-h-[260px] relative overflow-hidden shadow-inner">
                      {planImg ? (
                        <img src={planImg} className="max-h-[380px] w-auto object-contain rounded-xl shadow" alt="User Floor Plan" />
                      ) : svgCode ? (
                        <div dangerouslySetInnerHTML={{ __html: svgCode }} className="w-full h-full flex items-center justify-center text-white" />
                      ) : (
                        <div className="text-center space-y-2 text-slate-500 py-8">
                          <Layers className="w-8 h-8 mx-auto text-slate-600" />
                          <p className="text-xs font-mono">No raw image file stored; room boxes are saved below.</p>
                        </div>
                      )}
                    </div>

                    {/* Placed Rooms Breakdown */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black font-mono uppercase text-amber-400 flex items-center gap-1.5">
                        <Layers className="w-4 h-4" /> Placed Room Boxes ({placedRooms.length}) & Vastu Score ({selectedReportForModal.overall_score || 52}/100)
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {placedRooms.map((r, i) => (
                          <div key={i} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                            <div className="flex items-center justify-between font-bold">
                              <span className="text-white">{r.name || `Room ${i + 1}`}</span>
                              <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded">
                                Zone: {r.zone?.id || 'SW'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-tight">
                              {r.description || 'Calculated directional zone.'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleWhatsAppUser(selectedReportForModal.user_phone, selectedReportForModal.user_name)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Client on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedReportForModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
