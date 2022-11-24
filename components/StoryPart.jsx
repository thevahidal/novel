import React, { useState } from 'react';

import styles from '../styles/StoryPart.module.css';
import { formatRelatedDate } from '../utils/date';
import CheckIcon from '../components/icons/CheckIcon';
import XIcon from '../components/icons/XIcon';
import RefreshIcon from './icons/RefreshIcon';

const StoryPart = ({
  children,
  author,
  createdAt,
  color,
  editing,
  createPartLoading,
  onSubmitEditing,
  onDiscardEditing,
  isTitle,
}) => {
  const [content, setContent] = useState(children);
  const [localEditing, setLocalEditing] = useState(editing);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmitEditing) {
      onSubmitEditing(content);
    }
  };

  const handleDiscardEditing = () => {
    setLocalEditing(null);
    if (onDiscardEditing) {
      onDiscardEditing();
    }
  };

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  return (
    <span
      className={`${styles.part} ${localEditing ? styles.editing : ''} ${
        isTitle ? styles.title : ''
      }`}
      style={{
        '--color': color,
      }}
    >
      {localEditing ? (
        <form onSubmit={handleSubmit}>
          <div className={styles.input}>
            <input
              type='text'
              placeholder='Write your part'
              value={content}
              autoFocus
              onChange={handleChange}
            />
            <button onClick={handleDiscardEditing} disabled={createPartLoading}>
              <XIcon />
            </button>
            <button type='submit' disabled={createPartLoading}>
              {!createPartLoading ? <CheckIcon /> : <RefreshIcon spinning={true} />}
            </button>
          </div>
        </form>
      ) : (
        <span styles={styles.content}>{children}</span>
      )}
      {author && <span className={styles.author}>{author}</span>}
      {createdAt && !editing && (
        <span className={styles.timestamp}>{formatRelatedDate(createdAt)}</span>
      )}
    </span>
  );
};

export default StoryPart;
