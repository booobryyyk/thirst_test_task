import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'avatars',
  isDefault: true,
  access: (allow) => ({
    'avatars/{entity_id}/*': [
      allow.guest.to(['get']),
      allow.authenticated.to(['get']),
      allow.entity('identity').to(['write', 'delete']),
    ],
  }),
});
