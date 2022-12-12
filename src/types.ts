export type Config = {
  clientKey: string;
  logErrors: boolean;
};

export type ErrorObject = {
  message: Event | string;
  errorFile?: string;
  errorLine?: number;
  errorColumn?: number;
};

export type ErrorStackParser = (
  event: Event | string,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error
) => ErrorObject;

export type OnUnhandledRejection =
  | ((this: WindowEventHandlers, ev: PromiseRejectionEvent) => any)
  | null;
