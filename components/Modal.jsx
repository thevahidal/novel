import ReactDOM from 'react-dom';
import dynamic from 'next/dynamic';

import styles from '../styles/Modal.module.css';
import usePortal from '../hooks/usePortal';
import { useEffect, useState } from 'react';

const Modal = ({ onClose, show, headerTitle, children, ...props }) => {
  const [localShow, setLocalShow] = useState(show);
  const target = usePortal('modal');

  const handleClose = () => {
    setLocalShow(false);
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    setLocalShow(show);
  }, [show]);

  if (!localShow) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className={styles.wrapper}>
      <div className={styles.underlay} onClick={handleClose} />
      <div className={styles.modal}>
        <h3 className={styles.headerTitle}>{headerTitle}</h3>
        {children}
      </div>
    </div>,
    target
  );
};

export default dynamic(() => Promise.resolve(Modal), {
  ssr: false,
});
