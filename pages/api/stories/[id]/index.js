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

  if (req.method === 'PUT') {
    if (!session) {
      return res.status(401).json({
        error: 'not_authenticated',
      });
    }

    const { title } = req.body;
    const { data, error, status } = await supabaseClient
      .from('stories')
      .update({
        title: title,
      })
      .eq('author', user.id)
      .eq('id', storyId);

    res.status(status).json({ data, error });
  } else if (req.method === 'GET') {
    const { data, error, status } = await supabaseClient
      .from('stories')
      .select(
        `
        id,
        title,
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
      .eq('id', storyId)
      .single();
    res.status(status).json({ data, error });
  } else {
    res.status(405);
  }
};
