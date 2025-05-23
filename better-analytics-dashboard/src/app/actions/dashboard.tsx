
import { PublicAuthAction, withDashboardAuthContext } from './auth'
import * as authenticated from './authenticated'

type WrapFuncMap<T extends Record<string, (...args: any[]) => any>> = {
  [K in keyof T]: PublicAuthAction<T[K]>;
};

function wrapFunctions<T extends Record<string, (...args: any[]) => any>>(obj: T): WrapFuncMap<T> {
  const result = {} as WrapFuncMap<T>;
  for (const key in obj) {
    result[key] = withDashboardAuthContext(obj[key]) as WrapFuncMap<T>[typeof key];
  }
  return result;
}


export const actions = wrapFunctions(authenticated);
