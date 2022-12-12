export interface Config {
  clientKey: string;
  logErrors?: boolean;
}

export interface ErrorObject {
  message: Event | string;
  errorFile?: string;
  errorLine?: number;
  errorColumn?: number;
}

export type ErrorStackParser = (
  event: Event | string,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error
) => ErrorObject;

export type OnUnhandledRejection =
  | ((this: WindowEventHandlers, ev: PromiseRejectionEvent) => unknown)
  | null;
