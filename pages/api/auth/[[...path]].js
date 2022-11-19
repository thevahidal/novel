import { superTokensNextWrapper } from 'supertokens-node/nextjs';
import { middleware } from 'supertokens-node/framework/express';
import supertokens from 'supertokens-node';
import NextCors from 'nextjs-cors';

import { backendConfig } from '../../../config/backendConfig';

supertokens.init(backendConfig());

export default async function superTokens(req, res) {
  // NOTE: We need CORS only if we are querying the APIs from a different origin
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN,
    credentials: true,
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
  });

  await superTokensNextWrapper(
    async (next) => {
      // This is needed for production deployments with Vercel
      res.setHeader(
        'Cache-Control',
        'no-cache, no-store, max-age=0, must-revalidate'
      );
      await middleware()(req, res, next);
    },
    req,
    res
  );
  if (!res.writableEnded) {
    res.status(404).send('Not found');
  }
}
