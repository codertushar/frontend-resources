import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'nodejs',
};

async function verifyAdmin(supabase, token) {
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return { error: 'Invalid token', status: 401 };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    return { error: 'Admin access required', status: 403 };
  }

  return { user };
}

export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.substring(7);
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const adminCheck = await verifyAdmin(supabase, token);
  if (adminCheck.error) {
    return res.status(adminCheck.status).json({ error: adminCheck.error });
  }

  try {
    switch (req.method) {
      case 'GET': {
        // Get all premium overrides
        const { data: overrides, error } = await supabase
          .from('article_premium_overrides')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) throw error;
        return res.status(200).json({ overrides: overrides || [] });
      }

      case 'POST': {
        // Set premium override for an article
        const { articleId, isPremium } = req.body;

        if (!articleId || typeof isPremium !== 'boolean') {
          return res.status(400).json({ error: 'articleId and isPremium are required' });
        }

        const { data: override, error } = await supabase
          .from('article_premium_overrides')
          .upsert({
            article_id: articleId,
            is_premium: isPremium,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'article_id',
          })
          .select()
          .single();

        if (error) throw error;
        return res.status(200).json({ override });
      }

      case 'DELETE': {
        // Remove premium override (revert to auto-detection)
        const { articleId } = req.body;

        if (!articleId) {
          return res.status(400).json({ error: 'articleId is required' });
        }

        const { error } = await supabase
          .from('article_premium_overrides')
          .delete()
          .eq('article_id', articleId);

        if (error) throw error;
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Admin articles error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
