import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { postConfirmation } from '../auth/post-confirmation/resource';

const schema = a
  .schema({
    User: a
      .model({
        id: a.id().required(),
        displayName: a.string().required(),
        description: a.string(),
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
        // A fixed partition key to support querying the global feed by time.
        feedPartition: a.string().required(),
        publishedAt: a.datetime().required(),
        likeCount: a.integer(),
        author: a.belongsTo('User', 'authorId'),
        likes: a.hasMany('UserLike', 'postId'),
      })
      .secondaryIndexes((index) => [
        index('feedPartition')
          .sortKeys(['publishedAt'])
          .queryField('listPostsByFeedPartitionAndPublishedAt'),
        index('authorId')
          .sortKeys(['publishedAt'])
          .queryField('listPostsByAuthorIdAndPublishedAt'),
      ])
      .authorization((allow) => [
        allow.guest().to(['read']),
        allow.authenticated().to(['read']),
        allow.ownerDefinedIn('authorId').identityClaim('sub').to(['create']),
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
  })
  .authorization((allow) => [
    allow.resource(postConfirmation).to(['query', 'mutate']),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
