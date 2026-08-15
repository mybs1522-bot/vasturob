import React, { useState } from 'react';
import { MessageSquare, CheckCircle2, X, ShieldCheck, CreditCard, QrCode, Lock } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { saveConsultation } from '@/lib/supabase';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { useLanguage } from '@/lib/i18n';

export default function VastuExpertModal({ isOpen, onClose }) {
  const { lang } = useLanguage();
  const [step, setStep] = useState(1); // 1: Details | 2: Payment ₹999 | 3: Success
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!name || !phone) return;
    triggerRazorpayPayment();
  };

  const triggerRazorpayPayment = () => {
    setIsProcessing(true);
    openRazorpayCheckout({
      amount: 999,
      description: '1-on-1 WhatsApp Vastu Consultation',
      prefillName: name,
      prefillPhone: phone,
      onSuccess: (paymentDetails) => {
        setIsProcessing(false);
        saveConsultation({ 
          customer_name: name, 
          whatsapp_phone: phone, 
          amount_paid: 999,
          payment_id: paymentDetails.paymentId 
        });
        setStep(3);
      },
      onFailure: (err) => {
        setIsProcessing(false);
        console.warn('Payment failed or cancelled:', err);
      }
    });
  };

  const handleReset = () => {
    setStep(1);
    setName('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <Card className="w-full max-w-md bg-white border-none shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="absolute top-4 right-4 h-8 w-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* STEP 1: Details Form */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment}>
            <CardHeader className="text-center space-y-2 pt-6 pb-4">
              <div className="w-12 h-12 rounded-2xl border-2 border-amber-400/60 overflow-hidden mx-auto shadow-md">
                <img src="/vastu_logo.jpg" className="w-full h-full object-cover" alt="VastuScope Logo" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                  {lang === 'hi' ? 'प्रमाणित वास्तु विशेषज्ञ से सीधा परामर्श' : 'Chat with Certified Vastu Expert'}
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  {lang === 'hi' 
                    ? 'नक्शे की जरूरत नहीं! हमारे वरिष्ठ वास्तु आचार्य WhatsApp पर आपसे बात कर संपूर्ण समाधान देंगे।' 
                    : 'No floor plan required! Our Senior Vastu Acharya will chat with you on WhatsApp and understand your requirement.'}
                </p>
                <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-black text-amber-900 font-mono mt-1">
                  <span>{lang === 'hi' ? 'परामर्श शुल्क: ₹999' : 'Consultation Fee: ₹999'}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 px-6 sm:px-8">
              <div className="space-y-1.5">
                <Label htmlFor="expert-name" className="text-xs font-bold text-slate-700">
                  {lang === 'hi' ? 'आपका पूरा नाम' : 'Your Full Name'}
                </Label>
                <Input
                  id="expert-name"
                  type="text"
                  required
                  placeholder={lang === 'hi' ? 'उदा. राजेश शर्मा' : 'e.g. Rajesh Sharma'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="expert-phone" className="text-xs font-bold text-slate-700">
                  {lang === 'hi' ? 'WhatsApp मोबाइल नंबर' : 'WhatsApp Phone Number'}
                </Label>
                <Input
                  id="expert-phone"
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  {lang === 'hi' ? '100% व्यक्तिगत व गोपनीय परामर्श' : '100% Confidential Consultation'}
                </div>
                <p className="text-[11px] text-slate-600">
                  {lang === 'hi' 
                    ? 'भुगतान के बाद 30 मिनट के भीतर वास्तु विशेषज्ञ आपके WhatsApp पर संपर्क करेंगे।' 
                    : 'Our expert will initiate a direct WhatsApp message within 30 minutes after payment.'}
                </p>
              </div>
            </CardContent>

            <CardFooter className="px-6 sm:px-8 pb-6 pt-2">
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full h-12 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
              >
                <Lock className="w-4 h-4 mr-1 text-slate-950" />
                <span>{lang === 'hi' ? '₹999 सुरक्षित भुगतान करें' : 'Proceed to Pay ₹999 & Chat'}</span>
              </Button>
            </CardFooter>
          </form>
        )}

        {/* STEP 3: Success Screen */}
        {step === 3 && (
          <div className="text-center p-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                {lang === 'hi' ? 'परामर्श बुक हो गया!' : 'Consultation Booked!'}
              </h3>
              <p className="text-xs text-slate-600">
                {lang === 'hi'
                  ? `धन्यवाद ${name}! हमारे वरिष्ठ वास्तु विशेषज्ञ शीघ्र ही ${phone} पर आपसे WhatsApp द्वारा संपर्क करेंगे।`
                  : `Thank you ${name}! Our senior Vastu expert will initiate your WhatsApp chat on ${phone} shortly.`}
              </p>
            </div>
            <Button
              type="button"
              onClick={handleReset}
              className="w-full h-11 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              {lang === 'hi' ? 'पूर्ण हुआ' : 'Done'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
