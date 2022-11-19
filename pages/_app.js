import React from 'react';
import SuperTokensReact, { SuperTokensWrapper } from 'supertokens-auth-react';

import '../styles/globals.css';
import { frontendConfig } from '../config/frontendConfig';

if (typeof window !== 'undefined') {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  SuperTokensReact.init(frontendConfig());
}

function MyApp({ Component, pageProps }) {
  return (
    <SuperTokensWrapper>
      <Component {...pageProps} />
    </SuperTokensWrapper>
  );
}

export default MyApp;
