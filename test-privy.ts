import { User } from '@privy-io/node';
const user: User = {
  id: 'test',
  created_at: Date.now(),
  linkedAccounts: [],
  customMetadata: {},
  has_accepted_terms: false,
  is_guest: false
};
console.log(user);
