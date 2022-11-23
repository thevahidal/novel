import React, { useEffect, useState } from 'react';
import { useUser, useSession } from '@supabase/auth-helpers-react';

import { useUserColorStore, useUserStore } from '../store/store';
import styles from '../styles/Story.module.css';
import StoryPart from './StoryPart';

const Story = ({isMain, ...props}) => {
  const [parts, setParts] = useState([]);
  const [partsLoading, setPartsLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [story, setStory] = useState(props.story || {});
  const [storyLoading, setStoryLoading] = useState(props.loading);

  const userData = useUserStore((state) => state.user);
  const color = useUserStore((state) => state.color);
  const getUserColor = useUserColorStore((state) => state.getUserColor);

  const session = useSession();

  const user = useUser();

  const fetchParts = async (storyId) => {
    const res = await fetch(`/api/stories/${storyId}/parts`, {
      method: 'GET',
    });
    const { data } = await res.json();
    setParts(data);
    setPartsLoading(false);
  };

  const handleAddPartClick = () => {
    if (!session) {
      alert('You need to login in order to add story parts!');
      window.location.href = '/auth/login?callback=/';

      return;
    }

    setEditing(parts.length + 1);
    setParts([
      ...parts,
      {
        id: parts.length + 1,
        editing: true,
        color,
        author: {
          id: user.id,
          full_name: userData.full_name,
        },
      },
    ]);
  };

  const handleCreatePart = async (content) => {
    if (!content) return;

    const res = await fetch(`/api/stories/${story.id}/parts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
      }),
    });

    const { data, error } = await res.json();

    if (error) {
      switch (error) {
        case 'incomplete_profile':
          alert(
            'You need to complete your profile to be able to create story parts.'
          );
          window.location.href =
            '/user/account/?error=incomplete_profile&callback=/';
          break;

        default:
          break;
      }

      return;
    }

    fetchParts(story.id);
  };

  useEffect(() => {
    if (props.story.id) {
      setStory(props.story);
      fetchParts(props.story.id);
    }
  }, [props.story?.id]);

  useEffect(() => {
    setStoryLoading(props.loading);
  }, [props.loading]);

  return (
    <main className={styles.story}>
      {isMain && <div className={styles.main}># Cover Story</div>}
      {storyLoading ? (
        <>
          <h1>Fetching the story...</h1>
        </>
      ) : (
        <h1 className={styles.title}>
          <StoryPart
            author={story?.author?.full_name}
            createdAt={story.created_at}
            color={getUserColor(story.author?.id)}
            isTitle={true}
          >
            {story?.title}
          </StoryPart>
        </h1>
      )}

      <div className={styles.body}>
        {partsLoading ? (
          <div>Fetching the story parts...</div>
        ) : (
          <>
            {parts.map((part, index) => (
              <React.Fragment key={part.id}>
                <StoryPart
                  author={part.author?.full_name}
                  editing={part.editing}
                  onSubmitEditing={handleCreatePart}
                  onDiscardEditing={() => {
                    setEditing(null);
                    setParts(parts.filter((p) => !p.editing));
                  }}
                  createdAt={part.created_at}
                  color={getUserColor(part.author?.id)}
                >
                  {part.content}
                </StoryPart>
                {false ? (
                  <span
                    className={`${styles.addPart} ${
                      index === parts.length - 1 ? styles.visible : ''
                    }`}
                    onClick={handleAddPartClick}
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
            {!editing && (
              <button
                className={`${styles.addPart} ${styles.visible}`}
                onClick={handleAddPartClick}
                style={{
                  '--color': getUserColor(user?.id),
                }}
              >
                + Add a Part
              </button>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Story;
