import { createClient } from '@supabase/supabase-js';

// Production fallback credentials so online database sync ALWAYS works across all devices & Vercel
const DEFAULT_SUPABASE_URL = 'https://auetvxiigqoeiijdtpbb.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1ZXR2eGlpZ3FvZWlpamR0cGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MzE5MTEsImV4cCI6MjEwMjMwNzkxMX0.7zvrAkTMafM34_R4iEAsjiTwMDiVbz9YAsFHBWWcx-c';

const rawUrl = ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_URL).trim();
const rawKey = ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY).trim();

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  rawUrl.startsWith('http')
);

let clientInstance = null;
if (isSupabaseConfigured) {
  try {
    clientInstance = createClient(rawUrl, rawKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
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

// UUID Validator Helper
const isValidUUID = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

// Helper to get array from localStorage
const getLocalData = (key, defaultVal = []) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultVal;
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

// Deduplication Helper
const mergeDedupe = (cloudArr = [], localArr = [], keyField = 'phone') => {
  const map = new Map();
  // Cloud records take precedence
  cloudArr.forEach(item => {
    const k = item[keyField] || item.id;
    if (k) map.set(String(k).trim().toLowerCase(), item);
  });
  localArr.forEach(item => {
    const k = item[keyField] || item.id;
    if (k && !map.has(String(k).trim().toLowerCase())) {
      map.set(String(k).trim().toLowerCase(), item);
    }
  });
  return Array.from(map.values()).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
};

// ----------------------------------------------------
// 1. LEADS SERVICE (Online Cloud Sync)
// ----------------------------------------------------
export async function saveLead(lead) {
  const leadPayload = {
    full_name: lead.full_name || lead.name || lead.fullName || 'Anonymous',
    phone: lead.phone || '',
    email: lead.email || '',
    vastu_score: Number(lead.vastu_score || lead.score || 52),
    status: lead.status || 'new',
  };

  if (lead.id && isValidUUID(lead.id)) {
    leadPayload.id = lead.id;
  }

  let savedRecord = { ...leadPayload, id: lead.id || `lead_${Date.now()}`, created_at: new Date().toISOString() };

  // 1. Save directly to Supabase Cloud
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([leadPayload])
        .select()
        .single();

      if (!error && data) {
        savedRecord = data;
        console.log('[Supabase] ✅ Lead synced to cloud database:', savedRecord.id);
      } else if (error) {
        console.warn('[Supabase] saveLead insert error:', error.message);
      }
    } catch (e) {
      console.warn('[Supabase] saveLead network error:', e.message);
    }
  }

  // 2. Cache in localStorage
  const localLeads = getLocalData(LOCAL_LEADS_KEY, []);
  const updatedLocal = [savedRecord, ...localLeads.filter(l => l.phone !== savedRecord.phone && l.id !== savedRecord.id)];
  setLocalData(LOCAL_LEADS_KEY, updatedLocal);

  // 3. Dispatch live UI event
  try {
    window.dispatchEvent(new CustomEvent('vastuscope_lead_added', { detail: savedRecord }));
  } catch (e) {}

  return savedRecord;
}

export async function getLeads() {
  const localLeads = getLocalData(LOCAL_LEADS_KEY, []);

  // Fetch live from Supabase Cloud
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const cloudPhones = new Set(data.map(d => String(d.phone).trim()));
        const unpushed = localLeads.filter(l => l.phone && !cloudPhones.has(String(l.phone).trim()));
        for (const up of unpushed) {
          saveLead(up).catch(() => {});
        }

        const merged = mergeDedupe(data, localLeads, 'phone');
        setLocalData(LOCAL_LEADS_KEY, merged);
        return merged;
      }
    } catch (e) {
      console.warn('[Supabase] getLeads cloud fetch error:', e.message);
    }
  }

  return localLeads;
}

export async function updateLeadStatus(id, status) {
  const current = getLocalData(LOCAL_LEADS_KEY, []);
  const updated = current.map(item => item.id === id ? { ...item, status } : item);
  setLocalData(LOCAL_LEADS_KEY, updated);

  if (supabase && isValidUUID(id)) {
    try {
      await supabase.from('leads').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('[Supabase] updateLeadStatus error:', e);
    }
  }
  return updated;
}

// ----------------------------------------------------
// 2. EXPERT CONSULTATIONS SERVICE (₹999 WhatsApp Chat)
// ----------------------------------------------------
export async function saveConsultation(consultation) {
  const consultationPayload = {
    customer_name: consultation.customer_name || consultation.name || 'Anonymous',
    whatsapp_phone: consultation.whatsapp_phone || consultation.phone || '',
    amount_paid: Number(consultation.amount_paid || 999),
    payment_status: 'completed',
    chat_status: 'pending',
  };

  if (consultation.id && isValidUUID(consultation.id)) {
    consultationPayload.id = consultation.id;
  }

  let savedRecord = { ...consultationPayload, id: consultation.id || `chat_${Date.now()}`, created_at: new Date().toISOString() };

  // 1. Save to Supabase Cloud
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('expert_consultations')
        .insert([consultationPayload])
        .select()
        .single();

      if (!error && data) {
        savedRecord = data;
        console.log('[Supabase] ✅ Consultation synced to cloud database:', savedRecord.id);
      }
    } catch (e) {
      console.warn('[Supabase] saveConsultation error:', e.message);
    }
  }

  // 2. Also register as a Lead automatically
  saveLead({
    full_name: consultationPayload.customer_name,
    phone: consultationPayload.whatsapp_phone,
    email: '',
    vastu_score: 52,
    status: 'converted'
  }).catch(() => {});

  // 3. Cache locally
  const current = getLocalData(LOCAL_CONSULTATIONS_KEY, []);
  const updated = [savedRecord, ...current.filter(c => c.id !== savedRecord.id)];
  setLocalData(LOCAL_CONSULTATIONS_KEY, updated);

  return savedRecord;
}

export async function getConsultations() {
  const localConsultations = getLocalData(LOCAL_CONSULTATIONS_KEY, []);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('expert_consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const merged = mergeDedupe(data, localConsultations, 'whatsapp_phone');
        setLocalData(LOCAL_CONSULTATIONS_KEY, merged);
        return merged;
      }
    } catch (e) {
      console.warn('[Supabase] getConsultations error:', e.message);
    }
  }

  return localConsultations;
}

export async function updateConsultationStatus(id, chat_status) {
  const current = getLocalData(LOCAL_CONSULTATIONS_KEY, []);
  const updated = current.map(item => item.id === id ? { ...item, chat_status } : item);
  setLocalData(LOCAL_CONSULTATIONS_KEY, updated);

  if (supabase && isValidUUID(id)) {
    try {
      await supabase.from('expert_consultations').update({ chat_status }).eq('id', id);
    } catch (e) {
      console.warn('[Supabase] updateConsultation error:', e);
    }
  }
  return updated;
}

// ----------------------------------------------------
// 3. VASTU REPORTS SERVICE (Saves Floor Plans & Rooms)
// ----------------------------------------------------
export async function saveVastuReport(report) {
  const reportPayload = {
    report_id: report.report_id || `VS-${Math.floor(1000 + Math.random() * 9000)}`,
    user_name: report.user_name || report.name || 'Anonymous',
    user_phone: report.user_phone || report.phone || '',
    user_email: report.user_email || report.email || '',
    overall_score: Number(report.overall_score || report.score || 52),
    placed_rooms: Array.isArray(report.placed_rooms) ? report.placed_rooms : (report.placedRooms || []),
    evaluated_zones: [
      {
        plan_image: report.plan_image || report.imageUrl || '',
        svg_content: report.svg_content || report.svgContent || '',
        north_angle: Number(report.north_angle ?? report.northAngle ?? 0),
        property_type: report.property_type || report.propertyType || 'Residential',
        doshas_count: Number(report.doshas_count ?? report.doshasCount ?? 0),
        ideal_count: Number(report.ideal_count ?? report.idealCount ?? 0),
        summary: report.summary || {},
        report_data: report.report_data || null,
      }
    ],
    is_paid: Boolean(report.is_paid || false),
  };

  if (report.id && isValidUUID(report.id)) {
    reportPayload.id = report.id;
  }

  let savedRecord = { ...reportPayload, id: report.id || `rep_${Date.now()}`, created_at: new Date().toISOString() };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('vastu_reports')
        .insert([reportPayload])
        .select()
        .single();

      if (!error && data) {
        savedRecord = data;
        console.log('[Supabase] ✅ Vastu Report & Floor Plan saved to cloud database:', savedRecord.id);
      } else if (error) {
        console.warn('[Supabase] saveVastuReport insert error:', error.message);
      }
    } catch (e) {
      console.warn('[Supabase] saveVastuReport error:', e.message);
    }
  }

  const current = getLocalData(LOCAL_REPORTS_KEY, []);
  setLocalData(LOCAL_REPORTS_KEY, [savedRecord, ...current.filter(r => r.report_id !== savedRecord.report_id && r.id !== savedRecord.id)]);

  return savedRecord;
}

export async function getVastuReports() {
  const localReports = getLocalData(LOCAL_REPORTS_KEY, []);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('vastu_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const merged = mergeDedupe(data, localReports, 'report_id');
        setLocalData(LOCAL_REPORTS_KEY, merged);
        return merged;
      }
    } catch (e) {
      console.warn('[Supabase] getVastuReports error:', e.message);
    }
  }

  return localReports;
}
