export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const publicKey = process.env.VAPID_PUBLIC_KEY;

  if (!publicKey) {
    return res.status(500).json({ error: 'VAPID public key not configured' });
  }

  // Cache the response since the key doesn't change
  res.setHeader('Cache-Control', 'public, max-age=86400');
  return res.status(200).json({ publicKey });
}
