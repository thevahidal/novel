import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';

import Modal from './Modal';
import styles from '../styles/CreateStory.module.css';

const CreateStory = () => {
  const [title, setTitle] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [createStoryLoading, setCreateStoryLoading] = useState(false);

  const session = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      alert('Title is required.');
    }
    setCreateStoryLoading(true)
    const res = await fetch('/api/stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
      }),
    });

    const { data: { id } } = await res.json();

    setShowModal(false);
    setCreateStoryLoading(false)

    window.location.href = `/stories/${id}`
  };

  const handleShow = () => {
    if (!session) {
      alert('You need to login in order to create an story!');
      window.location.href = '/auth/login?callback=/';

      return;
    }

    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <button className='button' onClick={handleShow}>
        Create a Story
      </button>
      <Modal show={showModal} headerTitle='Create Story' onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <label htmlFor='title'>Title</label>
            <input
              name='title'
              placeholder='Enter a title for your story'
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <button type='submit' disabled={createStoryLoading}>{!createStoryLoading ? 'Submit' : 'Submitting...'}</button>
        </form>
      </Modal>
    </>
  );
};

export default CreateStory;
