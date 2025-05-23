"use client";

import * as dashboard from '@/app/actions/dashboard'

type WrapFuncMap<T extends Record<string, (...args: any[]) => any>> = {
  [K in keyof T]: PublicAuthAction<T[K]>;
};


function withDashboardIdExecutorWrapper<Args extends unknown[]>(action: (...args: any[]) => any): PublicAuthAction<typeof action> {
  return function command(...args: Args) {
    async function executor(dashboardId: string) {

      return action(dashboardId, ...args);
    }

    return {
      executor,
      toString: function() {
        return `${action}-${args.join("-")}`
      }
    }
  };
}

function wrapFunctions<T extends Record<string, (...args: any[]) => any>>(obj: T): WrapFuncMap<T> {
  const result = {} as WrapFuncMap<T>;
  for (const key in obj) {
    result[key] = withDashboardIdExecutorWrapper(obj[key]) as WrapFuncMap<T>[typeof key];
  }
  return result;
}


type GetAuthRestProps<T> = T extends (...args: infer Args) => unknown ? Args : never;
type GetActionExecutor<Action extends (...props: any[]) => any> = (dashboardId: string) => ReturnType<Action>;

type GetCommandReturnType<Action extends (...props: any[]) => any> = {
  executor: GetActionExecutor<Action>,
  toString: () => string
}

export type PublicAuthAction<Action extends (...props: any[]) => any> = (...props: unknown[]) => GetCommandReturnType<Action>;  

