import { IGoogleCalendarClient } from './IGoogleCalendarClient.js';
import { MockGoogleCalendarClient } from './MockGoogleCalendarClient.js';
import { ProdGoogleCalendarClient } from './ProdGoogleCalendarClient.js';

const isMock = process.env.VITE_MOCK_AUTH === 'true';

export const calendarClient: IGoogleCalendarClient = isMock 
  ? new MockGoogleCalendarClient() 
  : new ProdGoogleCalendarClient();

export * from './IGoogleCalendarClient.js';
