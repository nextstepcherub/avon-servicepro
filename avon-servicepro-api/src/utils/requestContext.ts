import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
  userName?: string;
}

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();

export const getRequestContext = () => {
  return requestContextStorage.getStore();
};
