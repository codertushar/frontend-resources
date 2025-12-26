import { createClerkClient } from '@clerk/clerk-sdk-node';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export const config = {
  runtime: 'nodejs',
};

// Load premium content at runtime
function getPremiumContent() {
  try {
    // Try multiple paths to handle both local dev and Vercel deployment
    const possiblePaths = [
      join(process.cwd(), 'src', 'data', 'premium-content.json'),
      join(process.cwd(), 'website', 'src', 'data', 'premium-content.json'),
      join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'premium-content.json'),
    ];

    for (const filePath of possiblePaths) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        console.log('Loaded premium content from:', filePath);
        return JSON.parse(content);
      } catch (e) {
        // Try next path
      }
    }

    console.error('Could not find premium-content.json in any expected location');
    return {};
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

  const { articleId: rawArticleId } = req.query;

  if (!rawArticleId) {
    return res.status(400).json({ error: 'Article ID is required' });
  }

  // Decode the article ID (handles URL-encoded slashes like %2F)
  const articleId = decodeURIComponent(rawArticleId);

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
