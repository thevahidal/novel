import ThirdPartyPasswordlessReact from 'supertokens-auth-react/recipe/thirdpartypasswordless';

import SessionReact from 'supertokens-auth-react/recipe/session';

import { appInfo } from './appInfo';

export const frontendConfig = () => {
  return {
    appInfo,
    recipeList: [
      ThirdPartyPasswordlessReact.init({
        contactMethod: 'EMAIL',
        palette: {
          //   background: '#333',
          //   error: '#ad2e2e',
          //   textTitle: 'white',
          //   textLabel: 'white',
          //   textInput: '#a9a9a9',
          //   textPrimary: 'white',
          //   textLink: '#a9a9a9',
          //   inputBackground: '#292929',
          // ...
        },

        signInUpFeature: {
          providers: [ThirdPartyPasswordlessReact.Github.init()],
          disableDefaultUI: true,
        },

        onHandleEvent: async (context) => {
          if (context.action === 'SESSION_ALREADY_EXISTS') {
            // TODO:
          } else if (context.action === 'PASSWORDLESS_RESTART_FLOW') {
            // TODO:
          } else if (context.action === 'PASSWORDLESS_CODE_SENT') {
            // TODO:
          } else if (context.action === 'SUCCESS') {
            if (context.isNewUser) {
              if ('phoneNumber' in context.user) {
                const { phoneNumber } = context.user;
              } else {
                const { email } = context.user;
              }
              // TODO: Sign up
            } else {
              // TODO: Sign in
            }
          }
        },
      }),
      SessionReact.init(),
    ],
    getRedirectionURL: async (context) => {
      if (context.action === 'TO_AUTH') {
        return '/auth/login';
      }
    },
  };
};
