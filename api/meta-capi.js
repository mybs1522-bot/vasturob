export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const META_CAPI_TOKEN = process.env.META_CAPI_TOKEN || process.env.VITE_META_CAPI_TOKEN;
  const PIXEL_ID = process.env.VITE_META_PIXEL_ID || process.env.META_PIXEL_ID;

  if (!META_CAPI_TOKEN || !PIXEL_ID) {
    console.error('[Meta CAPI] Missing token or pixel ID');
    return res.status(500).json({ error: 'Server configuration error: Missing Meta CAPI credentials.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const { eventName, eventId, eventSourceUrl, userData, customData } = body;

    if (!eventName) {
      return res.status(400).json({ error: 'Missing eventName' });
    }

    const crypto = await import('crypto');
    const hash = (str) => {
      if (!str) return undefined;
      return crypto.createHash('sha256').update(str.trim().toLowerCase()).digest('hex');
    };

    // Build the CAPI payload
    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_id: eventId,
          event_source_url: eventSourceUrl,
          user_data: {
            client_ip_address: req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
            client_user_agent: req.headers['user-agent'],
            ph: userData?.ph ? userData.ph.map(hash) : undefined,
            em: userData?.em ? userData.em.map(hash) : undefined,
            fn: userData?.fn ? userData.fn.map(hash) : undefined,
          },
          custom_data: customData || {}
        }
      ]
    };

    const apiUrl = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`[Meta CAPI] Successfully sent ${eventName} event.`);
      return res.status(200).json({ success: true, data });
    } else {
      console.warn(`[Meta CAPI] Error from Meta API:`, data);
      return res.status(response.status).json({ success: false, error: data });
    }
  } catch (error) {
    console.error('[Meta CAPI] Server error:', error);
    return res.status(500).json({ error: error.message });
  }
}
