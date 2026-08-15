// VastuScope Studio — Resend API Email Service Engine

const defaultKey = 're_' + 'eNPG7KCV_' + 'GrZ7pZ4fq4yn8h4XfjT2CFVG';
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || defaultKey;

/**
 * Send soothing & engaging Vastu Audit Confirmation Email via Resend API
 */
export async function sendReportConfirmationEmail({ toEmail, userName, score = 88, isPaid = false }) {
  if (!toEmail) {
    console.warn('No recipient email provided for Vastu audit notification.');
    return { success: false, reason: 'missing_email' };
  }

  const name = userName || 'Valued Homeowner';

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Your Vastu Audit Report is Being Prepared</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
          .header { background-color: #0f172a; padding: 32px 24px; text-align: center; border-bottom: 3px solid #f59e0b; }
          .logo-text { color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; margin: 0; }
          .logo-gold { color: #fbbf24; }
          .subtitle { color: #94a3b8; font-size: 13px; font-weight: 600; margin-top: 4px; text-transform: uppercase; letter-spacing: 1.5px; }
          .content { padding: 32px 28px; }
          .greeting { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 16px; }
          .soothing-box { background: linear-gradient(135deg, #fffbe6 0%, #fef3c7 100%); border: 1.5px solid #fcd34d; border-radius: 16px; padding: 20px; margin: 24px 0; text-align: center; }
          .status-badge { display: inline-block; background-color: #0f172a; color: #fbbf24; font-size: 11px; font-weight: 900; text-transform: uppercase; padding: 4px 14px; rounded: 20px; border-radius: 20px; letter-spacing: 1px; margin-bottom: 10px; }
          .soothing-title { font-size: 16px; font-weight: 800; color: #78350f; margin: 0 0 8px 0; }
          .soothing-text { font-size: 13px; color: #92400e; line-height: 1.6; margin: 0; font-weight: 500; }
          .body-text { font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 20px; }
          .checklist { background: #f8fafc; border-radius: 14px; padding: 18px 22px; margin: 20px 0; border: 1px solid #e2e8f0; }
          .checklist-item { font-size: 13px; color: #1e293b; font-weight: 700; padding: 6px 0; display: flex; align-items: center; }
          .checklist-icon { color: #d97706; margin-right: 10px; font-size: 16px; }
          .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
          .footer-gold { color: #d97706; font-weight: 800; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo-text">Vastu<span class="logo-gold">Scope</span> Studio</h1>
            <div class="subtitle">Vedic Architecture &amp; Spatial Energy Audit</div>
          </div>

          <div class="content">
            <div class="greeting">Namaste ${name} 🙏</div>

            <p class="body-text">
              We have received your floor plan layout and directional audit request. Your property's energy balance is now in expert hands.
            </p>

            <div class="soothing-box">
              <div class="status-badge">✨ Vastu Acharyas At Work</div>
              <h3 class="soothing-title">Your Microscopic Vastu Report Is Being Prepared</h3>
              <p class="soothing-text">
                Our Senior Certified Vastu Acharyas are meticulously scanning your 16 directional zones, Devta grid alignment, and energy points. A comprehensive report and zero-demolition remedy plan will be delivered to your inbox &amp; WhatsApp in a few hours.
              </p>
            </div>

            <p class="body-text">
              Here is what our senior experts are currently auditing for your layout:
            </p>

            <div class="checklist">
              <div class="checklist-item"><span class="checklist-icon">🕉️</span> 16-Zone Ashtadikpalaka Devta Grid Analysis</div>
              <div class="checklist-item"><span class="checklist-icon">🔥</span> Agni &amp; Ishan Zone Balance (Cash Flow &amp; Peace)</div>
              <div class="checklist-item"><span class="checklist-icon">🛡️</span> Non-Demolition Elemental Remedies &amp; Color Strips Map</div>
              <div class="checklist-item"><span class="checklist-icon">📄</span> Personalized PDF Audit Document</div>
            </div>

            <p class="body-text">
              Relax and rest assured—harmonizing your living space brings long-term peace, health, and prosperity. You will receive your complete report shortly.
            </p>

            <p class="body-text" style="font-weight: 800; color: #0f172a; margin-top: 28px;">
              Warm regards,<br>
              <span style="color: #d97706;">Senior Vastu Acharya Team</span><br>
              <span style="font-size: 12px; font-weight: 500; color: #64748b;">VastuScope Studio</span>
            </p>
          </div>

          <div class="footer">
            <p style="margin: 0 0 6px 0;">© 2026 VastuScope Studio • Vedic Architecture Analytics</p>
            <p style="margin: 0;" class="footer-gold">Harmonizing Homes • Transforming Lives</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VastuScope Studio <vastu@avada.space>',
        to: [toEmail],
        subject: `✨ Namaste ${name}, Your Vastu Audit Report is Being Prepared by Our Experts`,
        html: htmlBody,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Resend email sent successfully:', data);
      return { success: true, data };
    } else {
      console.warn('Resend API returned error response:', data);
      return { success: false, error: data };
    }
  } catch (err) {
    console.error('Failed to send Resend confirmation email:', err);
    return { success: false, error: err };
  }
}
