import Link from 'next/link';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import SessionReact from 'supertokens-auth-react/recipe/session';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

import styles from '../styles/Home.module.css';
import useUser from '../store/store';

const StoryPart = ({ children, author, color, editing, onSubmitEditing }) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmitEditing) {
      onSubmitEditing();
    }
  };

  return (
    <span className={`${styles.part} ${editing ? styles.editing : ''}`}>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Write your part'
            value={children}
            autoFocus
          />
        </form>
      ) : (
        children
      )}
      <span className={styles.author}>{author}</span>
    </span>
  );
};

const getARandomLightColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const PARTS = [
  {
    id: 1,
    author: 'Jack White',
    text: 'Once upon a time, there was a painter named "P".',
    color: getARandomLightColor(),
  },
  {
    id: 2,
    author: 'Charles Dickens',
    text: 'P was a very talented painter, but he was also very lazy.',
    color: getARandomLightColor(),
  },
  {
    id: 3,
    author: 'Charles Bukowski',
    text: 'P was so lazy that he would rather sleep than paint.',
    color: getARandomLightColor(),
  },
  {
    id: 4,
    author: 'Alber Camus',
    text: 'One day, P was sleeping in his bed when he heard a knock on the door.',
    color: getARandomLightColor(),
  },
  {
    id: 5,
    author: 'Rachel Carson',
    text: 'P opened the door and saw, ',
    color: getARandomLightColor(),
  },
  {
    id: 6,
    author: 'Virginia Woolf',
    text: 'a beautiful',
    color: getARandomLightColor(),
  },
  {
    id: 7,
    author: 'Leo Tolstoy',
    text: 'box, wrapped in some old newspapers.',
    color: getARandomLightColor(),
  },
];

export default function Home() {
  const [parts, setParts] = useState(PARTS);
  const [editing, setEditing] = useState(null);
  const session = useSessionContext();
  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);

  const handleLogout = async () => {
    await fetch('/api/delete-user'); // this will succeed even if the userId didn't exist.

    await SessionReact.signOut();
    window.location.href = '/';
  };

  const fetchUserData = async () => {
    const res = await fetch('/api/get-user');
    if (res.status === 200) {
      const json = await res.json();
      setUser({ id: json.id, ...json.props });
    }
  };

  useEffect(() => {
    if (session.doesSessionExist) {
      fetchUserData();
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Novel</title>
        <meta name='description' content='A collaborative story-telling' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <nav className={styles.navbar}>
        <div className={styles.brand}>
          <h1>Novel</h1>
          <p>A collaborative story-telling</p>
        </div>
        <div className={styles.links}>
          {!session.doesSessionExist ? (
            <Link href='/auth'>Login</Link>
          ) : (
            <a onClick={handleLogout}>Delete and Logout</a>
          )}
        </div>
      </nav>
      <main className={styles.story}>
        <h1 className={styles.title}>
          <StoryPart author={'Vahid Al'}>A painter called P</StoryPart>
        </h1>

        <div className={styles.body}>
          {parts.map((part, index) => (
            <React.Fragment key={part.id}>
              <StoryPart
                author={part.author}
                color={part.color}
                editing={part.editing}
              >
                {part.text}
              </StoryPart>
              {!editing || index === parts.length - 1 ? (
                <span
                  className={`${styles.addPart} ${
                    index === parts.length - 1 ? styles.visible : ''
                  }`}
                  onClick={() => {
                    setEditing(parts.length + 1);
                    setParts([
                      ...parts,
                      {
                        id: parts.length + 1,
                        editing: true,
                        author: user.name,
                      },
                    ]);
                  }}
                >
                  +
                </span>
              ) : (
                <span
                  className={`${styles.addPart} ${styles.placeholder}`}
                ></span>
              )}
            </React.Fragment>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href='https://github.com/thevahidal/novel'
          target='_blank'
          rel='noopener noreferrer'
        >
          Github
        </a>
      </footer>
    </div>
  );
}
