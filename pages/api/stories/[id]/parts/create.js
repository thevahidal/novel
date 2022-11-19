import crypto from 'crypto';
import { superTokensNextWrapper } from 'supertokens-node/nextjs';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import ThirdPartyPasswordlessNode from 'supertokens-node/recipe/thirdpartypasswordless';
import supertokens from 'supertokens-node';
import NextCors from 'nextjs-cors';
import CyclicDb from 'cyclic-dynamodb';

import { backendConfig } from '../../../../../config/backendConfig';

const db = CyclicDb(process.env.AWS_DYNAMODB_TABLE_NAME);

const users = db.collection('users');
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

  // we first verify the session
  await superTokensNextWrapper(
    async (next) => {
      return await verifySession()(req, res, next);
    },
    req,
    res
  );

  // if it comes here, it means that the session verification was successful
  const userId = req.session.getUserId();
  const userInfo = await users.get(userId);

  const storyId = req.query.id;
  const story = await stories.get(storyId);
  const parts = story.props.parts;

  const newPartId = crypto.randomUUID();
  const newPart = {
    id: newPartId,
    author: userId,
    authorName: userInfo.props.name,
    content: req.body.content,
    position: parts.length + 1,
  };

  await stories.set(storyId, {
    parts: [...parts, newPart],
  });

  return res.json({
    ...newPart,
    id: newPartId,
  });
}
