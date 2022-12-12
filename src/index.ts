import { apiUrl } from "./constants";
import { Config, ErrorObject, OnUnhandledRejection } from "./types";

export class TheBugging {
  private preExistingOnError: OnErrorEventHandler = null;
  private preExistingOnUnhandledRejection: OnUnhandledRejection = null;
  private config: Config;
  private errorStackParser(
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
  private logError(error?: Error) {
    if (this.config.logErrors && error) {
      console.error(error);
    }
  }
  private checkConfig(config: Config) {
    if (!config.clientKey) {
      throw new Error("clientKey is required");
    }

    return null;
  }
  private static instance: TheBugging;

  constructor(config: Config) {
    this.checkConfig(config);

    this.config = config;
  }

  static init(config: Config) {
    if (!this.instance) {
      this.instance = new TheBugging(config);
    }

    return this.instance;
  }

  private onErrorExists() {
    return window.onerror;
  }

  private onUnhandledRejectionExists() {
    return window.onunhandledrejection;
  }

  private sendToServer(errorObject: ErrorObject) {
    const { clientKey } = this.config;

    const url = `${apiUrl}/error?clientKey=${clientKey}`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify({ error: errorObject }),
    }).catch((error) => {
      console.error("Error while posting to server:", error);
    });
  }

  private appendEvents() {
    this.preExistingOnError = this.onErrorExists();
    this.preExistingOnUnhandledRejection = this.onUnhandledRejectionExists();

    window.onerror = (event, source, lineno, colno, error) => {
      if (this.preExistingOnError) {
        this.preExistingOnError.apply(window, [
          event,
          source,
          lineno,
          colno,
          error,
        ]);
      }

      this.logError(error);

      const errorObject = this.errorStackParser(event, source, lineno, colno);

      this.sendToServer(errorObject);
      console.log("errorObject", errorObject);
    };

    window.onunhandledrejection = (event) => {
      if (this.preExistingOnUnhandledRejection) {
        this.preExistingOnUnhandledRejection.apply(window, [event]);
      }

      this.logError(event.reason);

      const errorObject = this.errorStackParser(event.reason.stack);

      this.sendToServer(errorObject);
      console.log("errorObject", errorObject);
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

// const sasa = TheBugging.init({ clientKey: "123", logErrors: false });

// sasa.main();
