import React, { useState } from 'react';
import { SignInAndUp } from 'supertokens-auth-react/recipe/thirdpartypasswordless';
import Session from 'supertokens-auth-react/recipe/session';

import styles from '../../styles/Login.module.css';

const Input = ({ label, placeholder, onChange }) => {
  return (
    <div className={styles.formRow}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            onChange={onChange}
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );
};

const Button = ({ onClick, children }) => {
  return <button className={styles.button}>{children}</button>;
};

function Login() {
  const [name, setName] = useState('');
  let session = Session.useSessionContext();

  const submitUserInfo = async (event) => {
    event.preventDefault();
    if (name.length === 0) {
      return;
    }

    const res = await fetch('/api/update-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
      }),
    });

    if (res.status === 200) {
      const json = await res.json();
      window.location.href = '/';
    }
  };

  if (session.loading) {
    return null;
  }

  if (session.doesSessionExist) {
    // We wrap this with <SessionAuth /> so that
    // all claims are validated before showing the logged in UI.
    // For example, if email verification is switched on, and
    // the user's email is not verified, then <SessionAuth />
    // will redirect to the email verification page.

    return (
      <Session.SessionAuth>
        <div className={styles.card}>
          <div className={styles.row}>
            <div className={styles.headerTitle}>Complete Registration</div>
            <div className={styles.divider} />
            <form onSubmit={submitUserInfo}>
              <Input
                label='Name'
                placeholder='Enter your name'
                onChange={(e) => setName(e.target.value)}
              />
              <Button type='submit'>Submit</Button>
            </form>
          </div>
        </div>
      </Session.SessionAuth>
    );
  } else {
    return <SignInAndUp />;
  }
}

export default Login;
