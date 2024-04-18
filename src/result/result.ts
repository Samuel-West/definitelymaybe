export type Result<T, Err extends Error> = Success<T> | Failure<Err>;

export type Success<T> = {
  kind: 'result';
  value: T;
  map: <U>(fn: (t: T) => U) => Success<U>;
  mapErr: <U>(fn: () => U) => Success<T>;
  flatMap: <U, Err extends Error>(fn: (t: T) => Result<U, Err>) => Result<U, Err>;
  isSuccess: true;
  isFailure: false;
};

export type Failure<Err extends Error> = {
  kind: 'result';
  value: Err;
  map: () => Failure<Err>;
  mapErr: <T>(fn: () => T) => Success<T>;
  flatMap: () => Failure<Err>;
  isFailure: true;
  isSuccess: false;
  rethrow: () => void;
};

export const success = <T>(value: T): Success<T> => ({
  kind: 'result',
  value,
  map: <U>(fn: (t: T) => U) => success(fn(value)),
  mapErr: () => success(value),
  flatMap: <U, Err extends Error>(fn: (t: T) => Result<U, Err>) => fn(value),
  isSuccess: true,
  isFailure: false,
});

export const failure = <Err extends Error>(value: Err): Failure<Err> => ({
  kind: 'result',
  value,
  map: () => failure(value),
  mapErr: <T>(fn: () => T) => success(fn()),
  flatMap: () => failure(value),
  isSuccess: false,
  isFailure: true,
  rethrow: () => {
    throw value;
  },
});
