import React, { useState } from 'react';
import { User, PhoneCall, Mail, Sparkles, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { saveLead } from '@/lib/supabase';
import { sendReportConfirmationEmail } from '@/lib/emailService';
import { useLanguage } from '@/lib/i18n';

export default function LeadCaptureModal({ isOpen, onClose, onSubmit }) {
  const { lang } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(lang === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError(lang === 'hi' ? 'कृपया मान्य 10-अंकीय मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError(lang === 'hi' ? 'कृपया मान्य ईमेल पता दर्ज करें' : 'Please enter a valid email address');
      return;
    }

    setError('');
    saveLead({ full_name: name, phone, email, vastu_score: 88 });
    sendReportConfirmationEmail({ toEmail: email, userName: name });
    onSubmit({ name, phone, email });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md bg-white border-none shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Modal Header */}
        <CardHeader className="text-center space-y-2 pt-6 pb-4">
          <div className="w-12 h-12 rounded-2xl border-2 border-amber-400/60 overflow-hidden mx-auto shadow-md">
            <img src="/vastu_logo.jpg" className="w-full h-full object-cover" alt="VastuScope Logo" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-heading">
              {lang === 'hi' ? 'अपनी वास्तु रिपोर्ट प्राप्त करें' : 'Unlock Your Vastu Audit'}
            </h2>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              {lang === 'hi' 
                ? '16 दिशाओं का सटीक स्कोर और कस्टमाइज्ड रिपोर्ट पाने के लिए अपना विवरण दर्ज करें।' 
                : 'Enter your details below to generate your instant 16-Zone Vastu Score and custom report.'}
            </p>
          </div>
        </CardHeader>

        {/* Form Content */}
        <CardContent className="space-y-4 px-6 sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center animate-shake">
                {error}
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-1.5">
              <Label htmlFor="lead-name" className="text-xs font-bold text-slate-700">
                {lang === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
              </Label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  id="lead-name"
                  type="text"
                  placeholder={lang === 'hi' ? 'उदा. राहुल शर्मा' : 'e.g. Rahul Sharma'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 text-xs"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-1.5">
              <Label htmlFor="lead-phone" className="text-xs font-bold text-slate-700">
                {lang === 'hi' ? 'मोबाइल नंबर (WhatsApp) *' : 'Mobile Number (WhatsApp) *'}
              </Label>
              <div className="relative">
                <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  id="lead-phone"
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  className="pl-9 text-xs"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="lead-email" className="text-xs font-bold text-slate-700">
                {lang === 'hi' ? 'ईमेल पता *' : 'Email Address *'}
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  id="lead-email"
                  type="email"
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-xs"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-2"
            >
              <span>{lang === 'hi' ? 'मेरी रिपोर्ट देखें' : 'Get My Report'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t py-3 bg-slate-50/50">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{lang === 'hi' ? '100% सुरक्षित व गोपनीय वैदिक विश्लेषण' : '100% Secure & Confidential Analysis'}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
