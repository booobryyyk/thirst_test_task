import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { postConfirmation } from '../auth/post-confirmation/resource';
import { recentFeed } from './recent-feed/resource';
import { toggleLike } from './toggle-like/resource';

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

    ToggleLikeResult: a.customType({
      liked: a.boolean().required(),
      likeCount: a.integer().required(),
    }),

    FeedAuthor: a.customType({
      id: a.id().required(),
      displayName: a.string().required(),
      description: a.string(),
      avatarPath: a.string(),
    }),

    FeedPost: a.customType({
      id: a.id().required(),
      content: a.string().required(),
      publishedAt: a.datetime().required(),
      author: a.ref('FeedAuthor').required(),
      likeCount: a.integer().required(),
      likedByCurrentUser: a.boolean().required(),
    }),

    RecentFeedPage: a.customType({
      items: a.ref('FeedPost').array().required(),
      nextToken: a.string(),
    }),

    listRecentFeed: a
      .query()
      .arguments({ nextToken: a.string() })
      .returns(a.ref('RecentFeedPage'))
      .authorization((allow) => [allow.guest(), allow.authenticated()])
      .handler(a.handler.function(recentFeed)),

    toggleLike: a
      .mutation()
      .arguments({ postId: a.id().required() })
      .returns(a.ref('ToggleLikeResult'))
      .authorization((allow) => [allow.authenticated()])
      .handler(a.handler.function(toggleLike)),
  })
  .authorization((allow) => [
    allow.resource(postConfirmation).to(['query', 'mutate']),
    allow.resource(recentFeed).to(['query', 'mutate']),
    allow.resource(toggleLike).to(['query', 'mutate']),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
