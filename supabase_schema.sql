-- ========================================================
-- VastuScope Studio — Production Supabase Database Schema
-- Run this complete script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/auetvxiigqoeiijdtpbb/sql
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create LEADS Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    vastu_score INT DEFAULT 52,
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'converted'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create VASTU_REPORTS Table (Stores Floor Plans & Room Coordinates)
CREATE TABLE IF NOT EXISTS public.vastu_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id TEXT NOT NULL,
    user_name TEXT,
    user_phone TEXT,
    user_email TEXT,
    overall_score INT DEFAULT 52,
    placed_rooms JSONB DEFAULT '[]'::jsonb,
    evaluated_zones JSONB DEFAULT '[]'::jsonb,
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create EXPERT_CONSULTATIONS Table (WhatsApp Consultations ₹999)
CREATE TABLE IF NOT EXISTS public.expert_consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    whatsapp_phone TEXT NOT NULL,
    amount_paid NUMERIC(10, 2) DEFAULT 999.00,
    payment_status TEXT DEFAULT 'completed', -- 'pending', 'completed'
    chat_status TEXT DEFAULT 'pending', -- 'pending', 'contacted', 'resolved'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vastu_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_consultations ENABLE ROW LEVEL SECURITY;

-- 5. Open Full Public Read/Write Access Policies (Anon & Authenticated)
DROP POLICY IF EXISTS "Enable all access for all users" ON public.leads;
CREATE POLICY "Enable all access for all users" ON public.leads FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON public.vastu_reports;
CREATE POLICY "Enable all access for all users" ON public.vastu_reports FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON public.expert_consultations;
CREATE POLICY "Enable all access for all users" ON public.expert_consultations FOR ALL USING (true) WITH CHECK (true);
