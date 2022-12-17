export interface Config {
  projectKey: string;
}

export interface ErrorObject {
  message: Event | string;
  errorFile?: string;
  errorLine?: number;
  errorColumn?: number;
  errorStack?: string;
}

export type OnUnhandledRejection =
  | ((this: WindowEventHandlers, ev: PromiseRejectionEvent) => unknown)
  | null;
