import supertokens from 'supertokens-node';
import NextCors from 'nextjs-cors';
import CyclicDb from 'cyclic-dynamodb';

import { backendConfig } from '../../../../config/backendConfig';

const db = CyclicDb(process.env.AWS_DYNAMODB_TABLE_NAME);

const stories = db.collection('stories');

supertokens.init(backendConfig());

export default async function user(req, res) {
  // NOTE: We need CORS only if we are querying the APIs from a different origin
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN,
    credentials: true,
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
  });

  const storyId = req.query.id;
  const storyInfo = await stories.get(storyId);

  return res.json({
    ...storyInfo,
  });
}
