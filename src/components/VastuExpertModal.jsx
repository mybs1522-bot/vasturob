import React, { useState } from 'react';
import { MessageSquare, CheckCircle2, X, ShieldCheck, CreditCard, QrCode, Lock } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { saveConsultation } from '@/lib/supabase';
import { openRazorpayCheckout } from '@/lib/razorpay';

export default function VastuExpertModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Details | 2: Payment ₹999 | 3: Success
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card'
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

  const handleConfirmPayment = () => {
    triggerRazorpayPayment();
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
          className="absolute top-4 right-4 h-8 w-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
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
                  Chat with Certified Vastu Expert
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  No floor plan required! Our Senior Vastu Acharya will chat with you on WhatsApp and understand your requirement.
                </p>
                <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-black text-amber-900 font-mono mt-1">
                  <span>Consultation Fee: ₹999</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 px-6 sm:px-8">
              <div className="space-y-1.5">
                <Label htmlFor="expert-name" className="text-xs font-bold text-slate-700">Your Full Name</Label>
                <Input
                  id="expert-name"
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="expert-phone" className="text-xs font-bold text-slate-700">WhatsApp Mobile Number (For Expert Chat)</Label>
                <Input
                  id="expert-phone"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-xs"
                />
              </div>
            </CardContent>

            <CardFooter className="pt-2 pb-6 px-6 sm:px-8">
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
              >
                Proceed to Pay ₹999 →
              </Button>
            </CardFooter>
          </form>
        )}

        {/* STEP 2: Payment ₹999 Checkout */}
        {step === 2 && (
          <div className="space-y-4 p-6 sm:p-8">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-mono">
                Payment Required
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">Schedule Expert Chat</h3>
              <p className="text-xs text-muted-foreground">Completing payment for {name} ({phone})</p>
            </div>

            {/* Price Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">1-on-1 WhatsApp Chat Consultation</p>
                <p className="text-xs font-bold text-slate-200">Senior Vastu Acharya Chat</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-amber-400 font-mono">₹999</p>
                <p className="text-[10px] text-slate-400">Inclusive of Taxes</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Select Payment Method:
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('upi')}
                  className={`h-auto p-3 flex items-center justify-start gap-2 ${
                    paymentMethod === 'upi' ? 'bg-amber-50 border-amber-600 text-slate-900 hover:bg-amber-100 font-bold' : ''
                  }`}
                >
                  <QrCode className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold">UPI / QR</span>
                </Button>

                <Button
                  type="button"
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className={`h-auto p-3 flex items-center justify-start gap-2 ${
                    paymentMethod === 'card' ? 'bg-amber-50 border-amber-600 text-slate-900 hover:bg-amber-100 font-bold' : ''
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold">Card</span>
                </Button>
              </div>
            </div>

            {/* Pay Button */}
            <Button
              type="button"
              onClick={handleConfirmPayment}
              className="w-full h-11 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" /> Pay ₹999 &amp; Start WhatsApp Chat
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit Encrypted Secure Checkout</span>
            </div>
          </div>
        )}

        {/* STEP 3: Payment Successful Confirmation */}
        {step === 3 && (
          <div className="text-center p-6 sm:p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-mono">
                Payment Successful • ₹999 Received
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">Expert Chat Initiated!</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Thank you <strong>{name}</strong>! Your payment of <strong>₹999</strong> has been verified. Our Senior Certified Vastu Acharya will message you on WhatsApp at{' '}
                <strong className="text-slate-900">{phone}</strong> within 5 minutes.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleReset}
              className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Done
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
