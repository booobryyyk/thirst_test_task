import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { postConfirmation } from '../auth/post-confirmation/resource';

const schema = a.schema({
  Gender: a.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),

  User: a
    .model({
      // The profile ID is the owning Cognito user's `sub` claim.
      id: a.id().required(),
      displayName: a.string().required(),
      description: a.string(),
      birthdate: a.date(),
      gender: a.ref('Gender'),
      avatarPath: a.string(), // A public S3 object key
      posts: a.hasMany('Post', 'authorId'),
      likes: a.hasMany('UserLike', 'userId'),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow
        .ownerDefinedIn('id')
        .identityClaim('sub')
        .to(['create', 'update']),
    ]),

  Post: a
    .model({
      content: a.string().required(),
      authorId: a.id().required(),
      author: a.belongsTo('User', 'authorId'),
      likes: a.hasMany('UserLike', 'postId'),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow
        .ownerDefinedIn('authorId')
        .identityClaim('sub')
        .to(['create']),
    ]),

  UserLike: a
    .model({
      userId: a.id().required(),
      postId: a.id().required(),
      user: a.belongsTo('User', 'userId'),
      post: a.belongsTo('Post', 'postId'),
    })
    .identifier(['userId', 'postId'])
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow
        .ownerDefinedIn('userId')
        .identityClaim('sub')
        .to(['create', 'delete']),
    ]),
}).authorization((allow) => [allow.resource(postConfirmation).to(['mutate'])]);;

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
