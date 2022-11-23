import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export default async (req, res) => {
  const supabase = createServerSupabaseClient({
    req,
    res,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { id: storyId } = req.query;

  if (req.method === 'POST') {
    if (!session) {
      return res.status(401).json({
        error: 'not_authenticated',
      });
    }

    const { data: profileData } = await supabaseClient
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    if (!profileData.full_name) {
      return res.status(400).json({
        error: 'incomplete_profile',
      });
    }

    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        error: 'invalid_body',
      });
    }

    const { data, error, status } = await supabaseClient.from('parts').insert({
      story: storyId,
      author: user.id,
      content,
    });
    res.status(status).json({ data, error });
  } else if (req.method === 'GET') {
    const { data, error, status } = await supabaseClient
      .from('parts')
      .select(
        `
        id,
        content,
        author (
          id,
          username,
          full_name
        ),
        created_at,
        updated_at
      `
      )
      .eq('story', storyId)
      .eq('is_published', true)
      .order('created_at', {
        ascending: true,
      });

    res.status(status).json({ data, error });
  } else {
    res.status(405);
  }
};
