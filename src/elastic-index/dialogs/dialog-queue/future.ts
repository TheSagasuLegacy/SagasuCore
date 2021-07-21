export interface ResolveCallback<T> {
  (value?: T | PromiseLike<T>): void;
}

export interface RejectCallback {
  (reason?: any): void;
}

export class Future<T = void> extends Promise<T> {
  public setResult: ResolveCallback<T>;
  public setError: RejectCallback;

  constructor(
    executor?: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) {
    let promiseResolve: ResolveCallback<T>, promiseReject: RejectCallback;

    super(
      executor ||
        ((resolve, reject) => {
          promiseResolve = resolve;
          promiseReject = reject;
        }),
    );

    this.setResult = promiseResolve;
    this.setError = promiseReject;
  }

  static sleep(ms: number) {
    const future = new Future<void>();
    setTimeout(() => future.setResult(), ms);
    return future;
  }
}

export default Future;
