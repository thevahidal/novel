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

  if ((req.method in ['PUT', 'DELETE']) & !session) {
    return res.status(401).json({
      error: 'not_authenticated',
    });
  }

  if (req.method === 'PUT') {
    const { title } = req.body;
    const { data, error, status } = await supabaseClient
      .from('stories')
      .update({
        title: title,
      })
      .eq('author', user.id)
      .eq('id', storyId);

    res.status(status).json({ data, error });
  } else if (req.method === 'DELETE') {
    const { data, error, status } = await supabaseClient
      .from('stories')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('author', user.id)
      .eq('id', storyId);

    res.status(status).json({});
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
      .is('deleted_at', null)
      .eq('id', storyId)
      .single();
    res.status(status).json({ data, error });
  } else {
    res.status(405);
  }
};
