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

  const { id: storyId, partId } = req.query;

  if (req.method === 'PUT') {
    if (!session) {
      return res.status(401).json({
        error: 'not_authenticated',
      });
    }

    const { content } = req.body;
    const { data, error, status } = await supabaseClient
      .from('parts')
      .update({
        content,
      })
      .eq('author', user.id)
      .eq('story', storyId)
      .eq('id', partId);

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
      .eq('is_published', true)
      .eq('id', partId)
      .single();
    res.status(status).json({ data, error });
  } else {
    res.status(405);
  }
};
