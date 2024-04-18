export type Result<T, Err extends Error> = Success<T> | Failure<Err>;

export type Success<T> = {
  kind: 'result';
  value: T;
  map: <U>(fn: (t: T) => U) => Success<U>;
  mapAsync: <U>(fn: (t: T) => Promise<U>) => Promise<Success<U>>;
  mapErr: <U>(fn: () => U) => Success<T>;
  flatMap: <U, Err extends Error>(fn: (t: T) => Result<U, Err>) => Result<U, Err>;
  flatMapAsync: <U, Err extends Error>(
    fn: (t: T) => Promise<Result<U, Err>>
  ) => Promise<Result<U, Err>>;
  isSuccess: true;
  isFailure: false;
};

export type Failure<Err extends Error> = {
  kind: 'result';
  value: Err;
  map: () => Failure<Err>;
  mapAsync: () => Promise<Failure<Err>>;
  mapErr: <T>(fn: () => T) => Success<T>;
  flatMap: () => Failure<Err>;
  flatMapAsync: () => Promise<Failure<Err>>;
  isFailure: true;
  isSuccess: false;
  rethrow: () => void;
};

export const success = <T>(value: T): Success<T> => ({
  kind: 'result',
  value,
  map: <U>(fn: (t: T) => U) => success(fn(value)),
  mapAsync: async <U>(fn: (t: T) => Promise<U>) => {
    const res: U = await fn(value);
    return success(res);
  },
  mapErr: () => success(value),
  flatMap: <U, Err extends Error>(fn: (t: T) => Result<U, Err>) => fn(value),
  flatMapAsync: async <U, Err extends Error>(fn: (t: T) => Promise<Result<U, Err>>) =>
    await fn(value),
  isSuccess: true,
  isFailure: false,
});

export const failure = <Err extends Error>(value: Err): Failure<Err> => ({
  kind: 'result',
  value,
  map: () => failure(value),
  mapAsync: () => new Promise((resolve) => resolve(failure(value))),
  mapErr: <T>(fn: () => T) => success(fn()),
  flatMap: () => failure(value),
  flatMapAsync: () => new Promise((resolve) => resolve(failure(value))),
  isSuccess: false,
  isFailure: true,
  rethrow: () => {
    throw value;
  },
});
