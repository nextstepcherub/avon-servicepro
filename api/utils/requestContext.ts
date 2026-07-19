import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
  ipAddress: string;
  userAgent: string;
}

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();
