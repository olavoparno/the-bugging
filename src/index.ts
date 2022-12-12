import { apiUrl } from "./constants";
import { Config, ErrorObject, OnUnhandledRejection } from "./types";

export class TheBugging {
  private preExistingOnError: OnErrorEventHandler = null;

  private preExistingOnUnhandledRejection: OnUnhandledRejection = null;

  private static config: Config;

  private static onErrorParser(
    event: Event | string,
    source?: string,
    lineno?: number,
    colno?: number
  ): ErrorObject {
    const errorObj = {
      message: event,
      errorFile: source,
      errorLine: lineno,
      errorColumn: colno,
    };

    return errorObj;
  }

  private static betweenMarkers(text: string, begin: string, end: string) {
    const firstChar = text.indexOf(begin) + begin.length;
    const lastChar = text.indexOf(end);
    return text.substring(firstChar, lastChar);
  }

  private static onUnhandledRejectionParser(error: Error) {
    const { message, stack } = error;

    if (stack) {
      const errorFile = TheBugging.betweenMarkers(
        stack.split("\n")[1],
        "(",
        ")"
      );

      const [errorLine, errorColumn] = errorFile
        .replace(/^https?:\/\//, "")
        .split(":")
        .slice(1);

      const errorObj = {
        message: message || "",
        errorFile: errorFile,
        errorLine: +errorLine,
        errorColumn: +errorColumn,
      };

      return errorObj;
    }

    return null;
  }

  private static logError(error?: Error) {
    if (TheBugging.config.logErrors && error != null) {
      console.error(error);
    }
  }

  private static checkConfig(config: Config) {
    if (!config.clientKey) {
      throw new Error("clientKey is required");
    }

    return null;
  }

  private static onErrorExists() {
    return window.onerror;
  }

  private static onUnhandledRejectionExists() {
    return window.onunhandledrejection;
  }

  private static sendToServer(errorObject: ErrorObject | null) {
    const { clientKey } = TheBugging.config;

    const url = `${apiUrl}/error?clientKey=${clientKey}`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: errorObject }),
    }).catch((error) => {
      TheBugging.logError(error);
    });
  }

  constructor(config: Config) {
    TheBugging.checkConfig(config);

    TheBugging.config = config;
  }

  static init(config: Config) {
    if (!this.instance) {
      this.instance = new TheBugging(config);
    }

    return this.instance;
  }

  private static instance: TheBugging;

  private appendEvents() {
    this.preExistingOnError = TheBugging.onErrorExists();
    this.preExistingOnUnhandledRejection =
      TheBugging.onUnhandledRejectionExists();

    window.onerror = (event, source, lineno, colno, error) => {
      if (this.preExistingOnError != null) {
        this.preExistingOnError.apply(window, [
          event,
          source,
          lineno,
          colno,
          error,
        ]);
      }

      TheBugging.logError(error);

      const errorObject = TheBugging.onErrorParser(
        event,
        source,
        lineno,
        colno
      );

      TheBugging.sendToServer(errorObject);
    };

    window.onunhandledrejection = (event) => {
      if (this.preExistingOnUnhandledRejection != null) {
        this.preExistingOnUnhandledRejection.apply(window, [event]);
      }

      TheBugging.logError(event.reason);

      const errorObject = TheBugging.onUnhandledRejectionParser(event.reason);

      TheBugging.sendToServer(errorObject);
    };
  }

  private unAppendEvents() {
    window.onerror = this.preExistingOnError || null;
    window.onunhandledrejection = this.preExistingOnUnhandledRejection || null;
  }

  public main() {
    if (typeof window === "undefined") return null;

    this.appendEvents();

    return null;
  }

  public destroy() {
    if (typeof window === "undefined") return null;

    this.unAppendEvents();

    return null;
  }
}

export default TheBugging;
