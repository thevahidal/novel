import Link from 'next/link';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import SessionReact from 'supertokens-auth-react/recipe/session';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

import styles from '../styles/Home.module.css';
import useUser from '../store/store';

const StoryPart = ({ children, author, color, editing, onSubmitEditing }) => {
  const [content, setContent] = useState(children);
  console.log(author);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmitEditing) {
      onSubmitEditing(content);
    }
  };

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  return (
    <span className={`${styles.part} ${editing ? styles.editing : ''}`}>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Write your part'
            value={content}
            autoFocus
            onChange={handleChange}
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

export default function Home() {
  const [parts, setParts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [story, setStory] = useState({});

  const session = useSessionContext();
  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);

  const handleLogout = async () => {
    await fetch('/api/user/delete'); // this will succeed even if the userId didn't exist.

    await SessionReact.signOut();
    window.location.href = '/';
  };

  const handleCreateStory = async () => {
    await fetch('/api/stories/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'A Painter called "P"',
      }),
    });
  };

  const handleCreatePart = async (content) => {
    await fetch(`/api/stories/${story.key}/parts/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
      }),
    });
  };

  const fetchUserData = async () => {
    const res = await fetch('/api/user/get');
    if (res.status === 200) {
      const json = await res.json();
      setUser({ id: json.id, ...json.props });
    }
  };

  const fetchStories = async () => {
    const res = await fetch('/api/stories/list');
    if (res.status === 200) {
      const json = await res.json();
      const _story = json.data.results[json.data.results.length - 1];
      setStory(_story);
      setParts(_story.props.parts);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  console.log(user);

  useEffect(() => {
    if (session.doesSessionExist) {
      fetchUserData();
    }
  }, [session.loading]);

  console.log(parts);

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
          <a onClick={handleCreateStory}>Create a Story</a>
        </div>
      </nav>
      <main className={styles.story}>
        <h1 className={styles.title}>
          <StoryPart author={story.props?.authorName}>
            {story.props?.title}
          </StoryPart>
        </h1>

        <div className={styles.body}>
          {parts.map((part, index) => (
            <React.Fragment key={part.id}>
              <StoryPart
                author={part.authorName}
                color={part.color}
                editing={part.editing}
                onSubmitEditing={handleCreatePart}
              >
                {part.content}
              </StoryPart>
              {false ? (
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
                        authorName: user.name,
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
          <span
            className={`${styles.addPart} ${styles.visible}`}
            onClick={() => {
              setEditing(parts.length + 1);
              setParts([
                ...parts,
                {
                  id: parts.length + 1,
                  editing: true,
                  authorName: user.name,
                },
              ]);
            }}
          >
            + Add a Part
          </span>
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
