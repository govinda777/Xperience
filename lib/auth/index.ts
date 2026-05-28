import { IAuthClient } from './IAuthClient.js';
import { MockAuthClient } from './MockAuthClient.js';
import { PrivyAuthClient } from './PrivyAuthClient.js';

const isMock = process.env.VITE_MOCK_AUTH === 'true';

export const authClient: IAuthClient = isMock ? new MockAuthClient() : new PrivyAuthClient();

export * from './IAuthClient.js';
