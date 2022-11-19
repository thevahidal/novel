import ThirdPartyPasswordlessNode from 'supertokens-node/recipe/thirdpartypasswordless';
import SessionNode from 'supertokens-node/recipe/session';
import Dashboard from 'supertokens-node/recipe/dashboard';
import CyclicDb from 'cyclic-dynamodb';

import { appInfo } from './appInfo';

const db = CyclicDb(process.env.AWS_DYNAMODB_TABLE_NAME);

const users = db.collection('users');

const onSignInUp = async (response) => {
  // Post sign up response, we check if it was successful
  if (response.status === 'OK') {
    const { id, email } = response.user;

    if (response.createdNewUser) {
      await users.set(id, {
        email,
      });
    } else {
      // TODO: post sign in logic
    }
  }
};

export const backendConfig = () => {
  return {
    framework: 'express',
    supertokens: {
      // These are the connection details of the app you created on supertokens.com
      connectionURI: process.env.SUPERTOKENS_CONNECTION_URI,
      apiKey: process.env.SUPERTOKENS_API_KEY,
    },
    appInfo,
    recipeList: [
      ThirdPartyPasswordlessNode.init({
        providers: [
          // We have provided you with development keys which you can use for testing.
          // IMPORTANT: Please replace them with your own OAuth keys for production use.

          ThirdPartyPasswordlessNode.Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ],
        contactMethod: 'EMAIL',
        flowType: 'USER_INPUT_CODE',

        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,

              thirdPartySignInUpPOST: async (input) => {
                if (
                  originalImplementation.thirdPartySignInUpPOST === undefined
                ) {
                  throw Error('Should never come here');
                }

                // First we call the original implementation of thirdPartySignInUpPOST.
                const response =
                  await originalImplementation.thirdPartySignInUpPOST(input);

                onSignInUp(response);

                return response;
              },

              consumeCodePOST: async (input) => {
                if (originalImplementation.consumeCodePOST === undefined) {
                  throw Error('Should never come here');
                }

                // First we call the original implementation of consumeCodePOST.
                const response = await originalImplementation.consumeCodePOST(
                  input
                );

                onSignInUp(response);

                return response;
              },
            };
          },
        },
      }),

      SessionNode.init(),
      Dashboard.init({
        apiKey: '<SOME API KEY>',
      }),
    ],
    isInServerlessEnv: true,
  };
};
