import { VASTU_LOGO_BASE64 } from './vastuLogoBase64';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_Wh4xEHePkQXqRO';

// Helper to dynamically load Razorpay checkout SDK
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Open Razorpay Live Checkout Modal
export async function openRazorpayCheckout({
  amount = 999,
  name = 'VastuScope Studio',
  description = '1-on-1 Expert Vastu Consultation',
  prefillName = '',
  prefillPhone = '',
  prefillEmail = '',
  onSuccess,
  onFailure
}) {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded) {
    alert('Razorpay Payment Gateway failed to load. Please check your internet connection.');
    if (onFailure) onFailure('Script load error');
    return;
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: amount * 100, // Amount in paise (₹999 = 99900 paise)
    currency: 'INR',
    name: 'VastuScope Studio',
    description: description,
    image: VASTU_LOGO_BASE64,
    handler: function (response) {
      if (onSuccess) {
        onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature
        });
      }
    },
    prefill: {
      name: prefillName,
      contact: prefillPhone,
      email: prefillEmail
    },
    theme: {
      color: '#d97706' // Metallic Gold
    },
    modal: {
      ondismiss: function () {
        if (onFailure) onFailure('Payment dismissed by user');
      }
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error('Razorpay execution error:', err);
    if (onFailure) onFailure(err.message);
  }
}
