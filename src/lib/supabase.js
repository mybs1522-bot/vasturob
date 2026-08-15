import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  rawUrl.startsWith('http')
);

let clientInstance = null;
if (isSupabaseConfigured) {
  try {
    clientInstance = createClient(rawUrl, rawKey);
  } catch (err) {
    console.warn('Supabase client failed to initialize safely:', err);
    clientInstance = null;
  }
}

export const supabase = clientInstance;

// Local Storage Fallback Key Definitions
const LOCAL_LEADS_KEY = 'vastuscope_leads';
const LOCAL_CONSULTATIONS_KEY = 'vastuscope_consultations';
const LOCAL_REPORTS_KEY = 'vastuscope_reports';

// Initial Mock Seed Data if local storage is empty
const defaultLeads = [
  { id: '1', full_name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul.s@gmail.com', vastu_score: 88, status: 'new', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', full_name: 'Priya Verma', phone: '+91 98123 45678', email: 'priya.v@outlook.com', vastu_score: 64, status: 'contacted', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', full_name: 'Vikram Sethi', phone: '+91 99887 76655', email: 'vikram.sethi@architect.in', vastu_score: 92, status: 'converted', created_at: new Date(Date.now() - 172800000).toISOString() }
];

const defaultConsultations = [
  { id: 'c1', customer_name: 'Anish Kapoor', whatsapp_phone: '+91 97111 22334', amount_paid: 999, payment_status: 'completed', chat_status: 'pending', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'c2', customer_name: 'Sunita Nair', whatsapp_phone: '+91 98440 11223', amount_paid: 999, payment_status: 'completed', chat_status: 'contacted', created_at: new Date(Date.now() - 43200000).toISOString() }
];

// Helper to get array from localStorage
const getLocalData = (key, defaultVal = []) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    const parsed = JSON.parse(item);
    return Array.isArray(parsed) ? parsed : defaultVal;
  } catch (err) {
    return defaultVal;
  }
};

// Helper to set array in localStorage
const setLocalData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {}
};

// Helper to deduplicate items by phone or id
const mergeDedupe = (primaryArr, secondaryArr, keyField = 'phone') => {
  const map = new Map();
  [...primaryArr, ...secondaryArr].forEach(item => {
    const k = item[keyField] || item.id || item.full_name;
    if (k && !map.has(k)) {
      map.set(k, item);
    }
  });
  return Array.from(map.values());
};

// ----------------------------------------------------
// 1. LEADS SERVICE
// ----------------------------------------------------
export async function saveLead(lead) {
  const newLead = {
    id: lead.id || String(Date.now()),
    full_name: lead.full_name || lead.name || lead.fullName || 'Anonymous',
    phone: lead.phone || '',
    email: lead.email || '',
    vastu_score: lead.vastu_score || lead.score || 88,
    status: lead.status || 'new',
    created_at: new Date().toISOString()
  };

  // Always save locally immediately
  const localLeads = getLocalData(LOCAL_LEADS_KEY, defaultLeads);
  const updatedLocal = [newLead, ...localLeads];
  setLocalData(LOCAL_LEADS_KEY, updatedLocal);

  // Sync to Supabase if client is ready
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('leads').upsert([newLead], { onConflict: 'id' });
    } catch (e) {
      console.warn('Supabase saveLead sync error:', e);
    }
  }

  // Dispatch custom window event so Admin Panel updates live if open
  window.dispatchEvent(new CustomEvent('vastuscope_lead_added', { detail: newLead }));

  return newLead;
}

export async function updateLeadStatus(id, status) {
  const current = getLocalData(LOCAL_LEADS_KEY, defaultLeads);
  const updated = current.map(item => item.id === id ? { ...item, status } : item);
  setLocalData(LOCAL_LEADS_KEY, updated);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('leads').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateLeadStatus error:', e);
    }
  }
  return updated;
}

export async function getLeads() {
  const localLeads = getLocalData(LOCAL_LEADS_KEY, defaultLeads);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        // Merge Supabase leads with local leads so no user submission is ever lost!
        const merged = mergeDedupe(data, localLeads, 'phone');
        setLocalData(LOCAL_LEADS_KEY, merged);
        return merged;
      }
    } catch (e) {
      console.warn('Supabase getLeads query error:', e);
    }
  }

  return localLeads;
}

// ----------------------------------------------------
// 2. EXPERT CONSULTATIONS SERVICE (₹999 WhatsApp Chat)
// ----------------------------------------------------
export async function saveConsultation(consultation) {
  const newConsultation = {
    id: consultation.id || String(Date.now()),
    customer_name: consultation.customer_name || consultation.name || 'Anonymous',
    whatsapp_phone: consultation.whatsapp_phone || consultation.phone || '',
    amount_paid: consultation.amount_paid || 999,
    payment_status: 'completed',
    chat_status: 'pending',
    created_at: new Date().toISOString()
  };

  const current = getLocalData(LOCAL_CONSULTATIONS_KEY, defaultConsultations);
  const updated = [newConsultation, ...current];
  setLocalData(LOCAL_CONSULTATIONS_KEY, updated);

  // Also auto-save as Lead!
  saveLead({
    full_name: newConsultation.customer_name,
    phone: newConsultation.whatsapp_phone,
    email: '',
    vastu_score: 99,
    status: 'converted'
  });

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('expert_consultations').upsert([newConsultation], { onConflict: 'id' });
    } catch (e) {
      console.warn('Supabase saveConsultation error:', e);
    }
  }
  return newConsultation;
}

export async function getConsultations() {
  const localConsultations = getLocalData(LOCAL_CONSULTATIONS_KEY, defaultConsultations);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('expert_consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const merged = mergeDedupe(data, localConsultations, 'whatsapp_phone');
        setLocalData(LOCAL_CONSULTATIONS_KEY, merged);
        return merged;
      }
    } catch (e) {
      console.warn('Supabase getConsultations error:', e);
    }
  }

  return localConsultations;
}

export async function updateConsultationStatus(id, chat_status) {
  const current = getLocalData(LOCAL_CONSULTATIONS_KEY, defaultConsultations);
  const updated = current.map(item => item.id === id ? { ...item, chat_status } : item);
  setLocalData(LOCAL_CONSULTATIONS_KEY, updated);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('expert_consultations').update({ chat_status }).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateConsultation error:', e);
    }
  }
  return updated;
}

// ----------------------------------------------------
// 3. VASTU REPORTS SERVICE
// ----------------------------------------------------
export async function saveVastuReport(report) {
  const newReport = {
    id: String(Date.now()),
    report_id: report.report_id || `VS-${Math.floor(1000 + Math.random() * 9000)}`,
    user_name: report.user_name || report.name || 'Anonymous',
    user_phone: report.user_phone || report.phone || '',
    user_email: report.user_email || report.email || '',
    overall_score: report.overall_score || report.score || 88,
    placed_rooms: report.placed_rooms || [],
    created_at: new Date().toISOString()
  };

  const current = getLocalData(LOCAL_REPORTS_KEY, []);
  setLocalData(LOCAL_REPORTS_KEY, [newReport, ...current]);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('vastu_reports').upsert([newReport], { onConflict: 'id' });
    } catch (e) {
      console.warn('Supabase saveVastuReport error:', e);
    }
  }
  return newReport;
}

export async function getVastuReports() {
  const localReports = getLocalData(LOCAL_REPORTS_KEY, []);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('vastu_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const merged = mergeDedupe(data, localReports, 'report_id');
        setLocalData(LOCAL_REPORTS_KEY, merged);
        return merged;
      }
    } catch (e) {
      console.warn('Supabase getVastuReports error:', e);
    }
  }

  return localReports;
}
