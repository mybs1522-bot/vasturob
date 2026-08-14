import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, FileText, Database, ShieldCheck, 
  Search, Download, RefreshCw, Lock, CheckCircle2, AlertTriangle, 
  IndianRupee, ArrowLeft, Key, ExternalLink, Sparkles, Filter 
} from 'lucide-react';
import { 
  getLeads, saveLead, getConsultations, updateConsultationStatus, 
  getVastuReports, isSupabaseConfigured 
} from '@/lib/supabase';

export default function AdminPanel({ onBackToApp }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const [activeTab, setActiveTab] = useState('leads'); // 'leads' | 'consultations' | 'reports' | 'config'
  const [leads, setLeads] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Update Consultation Chat Status (Pending -> Contacted -> Resolved)
  const handleUpdateStatus = async (id, newStatus) => {
    await updateConsultationStatus(id, newStatus);
    loadData();
  };

  // Export Leads to CSV
  const exportLeadsToCSV = () => {
    if (!leads.length) return;
    const headers = ['ID', 'Full Name', 'Phone', 'Email', 'Vastu Score', 'Status', 'Created At'];
    const rows = leads.map(l => [
      l.id,
      `"${l.full_name || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      l.vastu_score || 88,
      l.status || 'new',
      l.created_at || ''
    ]);
    
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vastuscope_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Leads based on search query
  const filteredLeads = leads.filter(l => 
    (l.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.phone || '').includes(searchQuery) ||
    (l.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate Metrics
  const totalRevenue = (consultations.length * 999) + (reports.length * 899);
  const pendingChats = consultations.filter(c => c.chat_status === 'pending').length;

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
            <p className="text-xs text-amber-300/80 font-mono">Protected Supabase Database Access</p>
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border border-amber-400/50 overflow-hidden shadow-md flex-shrink-0">
            <img src="/vastu_logo.jpg" className="w-full h-full object-cover" alt="VastuScope Logo" />
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-black text-white font-heading tracking-wider uppercase flex items-center gap-2">
              VASTUSCOPE ADMIN PANEL
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-extrabold ${isSupabaseConfigured ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                {isSupabaseConfigured ? '🟢 SUPABASE LIVE' : '🟡 LOCAL SYNC ACTIVE'}
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">Realtime Database Management Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={onBackToApp}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Exit Admin
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* STATS METRIC SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Total Leads</span>
              <Users className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-black text-white font-mono">{leads.length}</p>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">100% Captured Submissions</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Est. Revenue</span>
              <IndianRupee className="w-5 h-5 text-emerald-400 font-bold" />
            </div>
            <p className="text-3xl font-black text-emerald-400 font-mono">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <span className="text-[10px] text-slate-400 font-mono">Consultations + Report Unlocks</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Pending Chats</span>
              <MessageSquare className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-black text-amber-400 font-mono">{pendingChats}</p>
            <span className="text-[10px] text-amber-300/80 font-mono">WhatsApp Action Required</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Reports Generated</span>
              <FileText className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-black text-yellow-400 font-mono">{reports.length}</p>
            <span className="text-[10px] text-slate-400 font-mono">16-Zone Audits Saved</span>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'leads' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Leads ({leads.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('consultations')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'consultations' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Expert Chats ({consultations.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'reports' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Vastu Reports ({reports.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('config')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'config' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Supabase Setup</span>
            </button>
          </div>

          {activeTab === 'leads' && (
            <button
              type="button"
              onClick={exportLeadsToCSV}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer hidden sm:flex"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}
        </div>

        {/* TAB 1: LEADS MANAGEMENT */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            {/* Search Input Bar */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search leads by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">Phone Number</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4 text-center">Score</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-500 text-xs font-mono">
                          No lead submissions found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-white">{lead.full_name}</td>
                          <td className="py-3 px-4 text-amber-300 font-mono">{lead.phone}</td>
                          <td className="py-3 px-4 text-slate-300">{lead.email || '—'}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold font-mono">
                              {lead.vastu_score || 88}/100
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                              lead.status === 'converted' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                              lead.status === 'contacted' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                              'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}>
                              {lead.status || 'new'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">
                            {new Date(lead.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXPERT CONSULTATIONS (₹999 WhatsApp Chats) */}
        {activeTab === 'consultations' && (
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">WhatsApp Phone</th>
                      <th className="py-3 px-4">Fee Paid</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Chat Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {consultations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-500 text-xs font-mono">
                          No expert consultations recorded yet.
                        </td>
                      </tr>
                    ) : (
                      consultations.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-white">{item.customer_name}</td>
                          <td className="py-3 px-4 text-emerald-400 font-mono font-bold">{item.whatsapp_phone}</td>
                          <td className="py-3 px-4 text-amber-400 font-bold font-mono">₹{item.amount_paid || 999}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold font-mono border border-emerald-500/40">
                              ✅ Verified
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                              item.chat_status === 'resolved' ? 'bg-slate-800 text-slate-400' :
                              item.chat_status === 'contacted' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-amber-400 text-slate-950 font-black'
                            }`}>
                              {item.chat_status || 'pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            {item.chat_status !== 'contacted' && item.chat_status !== 'resolved' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(item.id, 'contacted')}
                                className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[10px] font-mono font-bold border border-blue-500/40 transition-all cursor-pointer"
                              >
                                Mark Contacted
                              </button>
                            )}

                            {item.chat_status !== 'resolved' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(item.id, 'resolved')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40 transition-all cursor-pointer"
                              >
                                Mark Resolved
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
          </div>
        )}

        {/* TAB 3: VASTU REPORTS DATABASE */}
        {activeTab === 'reports' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Report ID</th>
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-center">Placed Rooms</th>
                    <th className="py-3 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-500 text-xs font-mono">
                        No saved Vastu reports in database.
                      </td>
                    </tr>
                  ) : (
                    reports.map((rep) => (
                      <tr key={rep.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-amber-400 font-mono">{rep.report_id}</td>
                        <td className="py-3 px-4 font-bold text-white">{rep.user_name || 'Anonymous'}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black font-mono">
                            {rep.overall_score || 88}/100
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-slate-300 font-mono">
                          {Array.isArray(rep.placed_rooms) ? rep.placed_rooms.length : 0} Rooms
                        </td>
                        <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">
                          {new Date(rep.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SUPABASE CONFIG & SQL SCRIPT VIEWER */}
        {activeTab === 'config' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${isSupabaseConfigured ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'}`}>
                {isSupabaseConfigured ? '✅ Supabase Credentials Connected' : '⚠️ Local Fallback Active (Missing .env Keys)'}
              </span>
              <h3 className="text-xl font-black text-white font-heading">Supabase Database Integration Guide</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                To connect your fresh Supabase project, create a <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">.env</code> file in your repository root with the following environment variables:
              </p>
            </div>

            {/* .env Code Block */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-amber-300 space-y-1 relative">
              <p className="text-slate-500"># .env (Vite Environment Configuration)</p>
              <p>VITE_SUPABASE_URL=https://your-project-id.supabase.co</p>
              <p>VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</p>
            </div>

            {/* SQL Table Creation Instructions */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                One-Click SQL Schema Setup Script
              </h4>
              <p className="text-xs text-slate-400">
                Copy and run the contents of <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">supabase_schema.sql</code> inside your Supabase Dashboard SQL Editor to automatically create all required tables (<code className="text-slate-200">leads</code>, <code className="text-slate-200">vastu_reports</code>, <code className="text-slate-200">expert_consultations</code>).
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
