import { superTokensNextWrapper } from 'supertokens-node/nextjs';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import ThirdPartyPasswordlessNode from 'supertokens-node/recipe/thirdpartypasswordless';
import supertokens from 'supertokens-node';
import NextCors from 'nextjs-cors';
import { deleteUser } from 'supertokens-node';

import { backendConfig } from '../../../config/backendConfig';

supertokens.init(backendConfig());

export default async function user(req, res) {
  // NOTE: We need CORS only if we are querying the APIs from a different origin
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN,
    credentials: true,
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
  });

  // we first verify the session
  await superTokensNextWrapper(
    async (next) => {
      return await verifySession()(req, res, next);
    },
    req,
    res
  );

  const userId = req.session.getUserId();
  await deleteUser(userId); // this will succeed even if the userId didn't exist.

  return res.json({
    userId,
  });
}
