import styles from '../../styles/BaseIcon.module.css';

const BaseIcon = ({ children, size, spinning, ...props }) => {
  return (
    <div className={`${styles.iconWrapper} ${spinning ? styles.spinning : ''}`}>
      {children}
    </div>
  );
};

export default BaseIcon;
