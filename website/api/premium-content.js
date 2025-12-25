import { createClerkClient } from '@clerk/clerk-sdk-node';
import { readFileSync } from 'fs';
import { join } from 'path';

export const config = {
  runtime: 'nodejs',
};

// Load premium content at runtime
function getPremiumContent() {
  try {
    const filePath = join(process.cwd(), 'src', 'data', 'premium-content.json');
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading premium content:', error);
    return {};
  }
}

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { articleId } = req.query;

  if (!articleId) {
    return res.status(400).json({ error: 'Article ID is required' });
  }

  // Check environment variables
  if (!process.env.CLERK_SECRET_KEY) {
    return res.status(500).json({ error: 'CLERK_SECRET_KEY not configured' });
  }

  const premiumContent = getPremiumContent();

  // Check if article exists in premium content
  if (!premiumContent[articleId]) {
    return res.status(404).json({ error: 'Article not found or is not premium' });
  }

  // Get auth token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.substring(7);

  try {
    // Initialize Clerk client
    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

    // Parse the JWT payload to get user ID
    const parts = token.split('.');
    if (parts.length !== 3) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    const userId = payload.sub;

    if (!userId) {
      return res.status(401).json({ error: 'Invalid token - no user ID' });
    }

    // Get user to check subscription status
    const user = await clerkClient.users.getUser(userId);
    const subscription = user.publicMetadata?.subscription;

    // Check if user has active premium subscription
    if (!subscription || subscription.status !== 'active') {
      return res.status(403).json({
        error: 'Premium subscription required',
        subscriptionStatus: subscription?.status || 'none',
      });
    }

    // Check if subscription is expired (for future-proofing, lifetime has null expiresAt)
    if (subscription.expiresAt && new Date(subscription.expiresAt) < new Date()) {
      return res.status(403).json({
        error: 'Subscription expired',
        expiresAt: subscription.expiresAt,
      });
    }

    // User is authorized, return full content
    return res.status(200).json({
      content: premiumContent[articleId],
      articleId,
    });
  } catch (error) {
    console.error('Error fetching premium content:', error);
    return res.status(500).json({
      error: 'Failed to fetch content',
      details: error.message
    });
  }
}
