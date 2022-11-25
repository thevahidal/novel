import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';

import Modal from './Modal';
import styles from '../styles/DeleteStory.module.css';

const DeleteStory = ({ id }) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteStoryLoading, setDeleteStoryLoading] = useState(false);

  const session = useSession();

  const handleDelete = async (e) => {
    e.preventDefault();

    setDeleteStoryLoading(true);
    const res = await fetch(`/api/stories/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setShowModal(false);
    setDeleteStoryLoading(false);

    window.location.href = `/`;
  };

  const handleShow = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <button className='button' onClick={handleShow}>
        Delete Story
      </button>
      <Modal show={showModal} headerTitle='Delete Story' onClose={handleClose}>
        <p>
          Are you sure you want to delete your story? This action won't be reversible.
        </p>
        <button className='danger' onClick={handleDelete} disabled={deleteStoryLoading}>
          {!deleteStoryLoading ? 'Yes, Delete it forever.' : 'Deleting...'}
        </button>
        <br />
        <button onClick={handleClose} disabled={deleteStoryLoading}>No, keep it.</button>
      </Modal>
    </>
  );
};

export default DeleteStory;
