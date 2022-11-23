import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';

import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    window.location.href = '/';
  };

  const handleCreateStory = async () => {
    if (!session) {
      alert('You need to login in order to create an story!');
      window.location.href = '/auth/login?callback=/';

      return;
    }

    const res = await fetch('/api/stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Untitled Story!',
      }),
    });
  };

  return (
    <nav className={styles.navbar}>
      <div className='container'>
        <div className={styles.brand}>
          <Link href="/">
            <h1>Novel</h1>
          </Link>
          <p className={styles.slogan}>A collaborative story-telling</p>
        </div>
        <div className={styles.links}>
          {!session ? (
            <Link href='/auth/login'>Login</Link>
          ) : (
            <a onClick={handleLogout}>Logout</a>
          )}
          <button className='button' onClick={handleCreateStory}>
            Create a Story
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
