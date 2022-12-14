import { apiUrl } from "./constants";
import { Config, ErrorObject, OnUnhandledRejection } from "./types";

export class TheBugging {
  private constructor(config: Config) {
    this.checkConfig(config);

    TheBugging.config = config;
  }

  private static config: Config;

  private static instance: TheBugging;

  private preExistingOnError: OnErrorEventHandler = null;

  private preExistingOnUnhandledRejection: OnUnhandledRejection = null;

  private unAppendEvents() {
    window.onerror = this.preExistingOnError || null;
    window.onunhandledrejection = this.preExistingOnUnhandledRejection || null;
  }

  private onErrorParser(
    event: Event | string,
    source?: string,
    lineno?: number,
    colno?: number,
    stack?: string
  ): ErrorObject {
    const errorObj = {
      message: event,
      errorFile: source,
      errorLine: lineno,
      errorColumn: colno,
      errorStack: stack,
    };

    return errorObj;
  }

  private onUnhandledRejectionParser(error: Error) {
    const { message = "", stack } = error;

    if (stack) {
      const betweenMarkers = (text: string, begin: string, end: string) => {
        const firstChar = text.indexOf(begin) + begin.length;
        const lastChar = text.indexOf(end);
        return text.substring(firstChar, lastChar);
      };
      const removeLineAndColumnFromFile = (text: string) => {
        const rawText = text
          .replace(/^https?:\/\//, "")
          .replace(/^file:\/\//, "")
          .replace(/^webpack-internal:\/\//, "");
        const firstChar = rawText.indexOf(":");
        const diffLengthWithoutProtocol = text.length - rawText.length;
        return text.substring(0, firstChar + diffLengthWithoutProtocol);
      };
      const rawErrorFile = betweenMarkers(stack.split("\n")[1], "(", ")");

      const [errorLine, errorColumn] = rawErrorFile
        .replace(/^https?:\/\//, "")
        .replace(/^file:\/\//, "")
        .replace(/^webpack-internal:\/\//, "")
        .split(":")
        .slice(1);

      const errorFile = removeLineAndColumnFromFile(rawErrorFile);

      const errorObj = {
        message,
        errorFile,
        errorLine: +errorLine,
        errorColumn: +errorColumn,
        errorStack: stack,
      };

      return errorObj;
    }

    return null;
  }

  private appendEvents() {
    this.preExistingOnError = this.onErrorExists();
    this.preExistingOnUnhandledRejection = this.onUnhandledRejectionExists();

    const onErrorHandlerTB: OnErrorEventHandler = (
      event,
      source,
      lineno,
      colno,
      error
    ) => {
      if (this.preExistingOnError != null) {
        this.preExistingOnError.apply(window, [
          event,
          source,
          lineno,
          colno,
          error,
        ]);
      }

      const errorObject = this.onErrorParser(
        event,
        source,
        lineno,
        colno,
        error?.stack
      );

      this.sendToServer(errorObject);
    };

    const onUnhandledRejectionHandlerTB: OnUnhandledRejection = (event) => {
      if (this.preExistingOnUnhandledRejection != null) {
        this.preExistingOnUnhandledRejection.apply(window, [event]);
      }

      const errorObject = this.onUnhandledRejectionParser(event.reason);

      this.sendToServer(errorObject);
    };

    window.onerror = onErrorHandlerTB;
    window.onunhandledrejection = onUnhandledRejectionHandlerTB;
  }

  private checkConfig(config: Config) {
    if (!config.clientKey) {
      throw new Error("clientKey is required");
    }

    return null;
  }

  private onErrorExists() {
    return window.onerror;
  }

  private onUnhandledRejectionExists() {
    return window.onunhandledrejection;
  }

  private sendToServer(errorObject: ErrorObject | null) {
    const { clientKey } = TheBugging.config;

    const url = `${apiUrl}/error?clientKey=${clientKey}`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: errorObject }),
    });
  }

  private listenForWindowUnload() {
    window.onbeforeunload = () => {
      this.unAppendEvents();
    };
  }

  private start() {
    if (typeof window === "undefined") return null;

    this.appendEvents();
    this.listenForWindowUnload();

    return null;
  }

  public static init(config: Config) {
    if (!this.instance) {
      this.instance = new TheBugging(config);
    }

    this.instance.start();
  }
}

export default TheBugging;
