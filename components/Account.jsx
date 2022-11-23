import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Avatar from './Avatar';
import { useUserStore } from '../store/store';

export default function Account({ session }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [color, setColor] = useState(null);
  const [avatar_url, setAvatarURL] = useState(null);
  const [full_name, setFullName] = useState(null);

  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, full_name, color, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setFullName(data.full_name);
        setColor(data.color);
        setAvatarURL(data.avatar_url);
      }
    } catch (error) {
      alert('Error loading user data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, full_name, color, avatar_url }) {
    try {
      setLoading(true);

      const updates = {
        id: user.id,
        username,
        full_name,
        color,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      let { data, error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      alert('Profile updated!');
      setUser(data);

      const queryParams = new URL(window.location.href).search;

      if (queryParams.includes('callback=')) {
        const callback = queryParams.split('callback=')[1].split('&')[0].replace('%2F', '/');
        window.location.href = callback;
      }
    } catch (error) {
      alert('Error updating the data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='form-widget'>
      <Avatar
        uid={user.id}
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarURL(url);
          updateProfile({ username, color, avatar_url: url });
        }}
      />
      <div>
        <label htmlFor='email'>Email</label>
        <input id='email' type='text' value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor='username'>Username</label>
        <input
          id='username'
          type='text'
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor='full_name'>Full Name</label>
        <input
          id='full_name'
          type='text'
          value={full_name || ''}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      {/* <div>
        <label htmlFor='color'>Color</label>
        <input
          id='color'
          type='color'
          value={color || ''}
          onChange={(e) => setColor(e.target.value)}
        />
      </div> */}

      <div>
        <button
          className='button primary block'
          onClick={() =>
            updateProfile({ username, full_name, color, avatar_url })
          }
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button
          className='button block'
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
