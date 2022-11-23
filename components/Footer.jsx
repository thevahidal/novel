import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className='container'>
        <a
          href='https://github.com/thevahidal/novel'
          target='_blank'
          rel='noopener noreferrer'
        >
          Github
        </a>
      </div>
    </footer>
  );
};

export default Footer;
