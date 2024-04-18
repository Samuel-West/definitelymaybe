import { invalid, Invalid, valid, Valid } from '../validated/validated';
import { none, None, some, Some } from '../maybe';

export type Result<T, Err extends Error> = Success<T> | Failure<Err>;

export type Success<T> = {
  // Fields
  kind: 'result';
  value: T;
  isSuccess: true;
  isFailure: false;

  // Operations
  map: <U>(fn: (t: T) => U) => Success<U>;
  mapAsync: <U>(fn: (t: T) => Promise<U>) => Promise<Success<U>>;
  mapErr: <U>(fn: () => U) => Success<T>;
  flatMap: <U, Err extends Error>(fn: (t: T) => Result<U, Err>) => Result<U, Err>;
  flatMapAsync: <U, Err extends Error>(
    fn: (t: T) => Promise<Result<U, Err>>
  ) => Promise<Result<U, Err>>;

  // Transformations
  toValidated: () => Valid<T>;
  toMaybe: () => Some<T>;
};

export type Failure<Err extends Error> = {
  // Fields
  kind: 'result';
  value: Err;
  isFailure: true;
  isSuccess: false;

  // Operations
  map: () => Failure<Err>;
  mapAsync: () => Promise<Failure<Err>>;
  mapErr: <T>(fn: () => T) => Success<T>;
  flatMap: () => Failure<Err>;
  flatMapAsync: () => Promise<Failure<Err>>;
  rethrow: () => void;

  // Transformations
  toValidated: <T>(defaultValue: T) => Invalid<T, Err>;
  toMaybe: () => None;
};

export const success = <T>(value: T): Success<T> => ({
  // Fields
  kind: 'result',
  value,
  isSuccess: true,
  isFailure: false,

  // Operations
  map: <U>(fn: (t: T) => U) => success(fn(value)),
  mapAsync: async <U>(fn: (t: T) => Promise<U>) => {
    const res: U = await fn(value);
    return success(res);
  },
  mapErr: () => success(value),
  flatMap: <U, Err extends Error>(fn: (t: T) => Result<U, Err>) => fn(value),
  flatMapAsync: async <U, Err extends Error>(fn: (t: T) => Promise<Result<U, Err>>) =>
    await fn(value),

  // Transformations
  toValidated: () => valid(value),
  toMaybe: () => some(value),
});

export const failure = <Err extends Error>(value: Err): Failure<Err> => ({
  // Fields
  kind: 'result',
  value,
  isSuccess: false,
  isFailure: true,

  // Operations
  map: () => failure(value),
  mapAsync: () => new Promise((resolve) => resolve(failure(value))),
  mapErr: <T>(fn: () => T) => success(fn()),
  flatMap: () => failure(value),
  flatMapAsync: () => new Promise((resolve) => resolve(failure(value))),
  rethrow: () => {
    throw value;
  },

  // Transformations
  toValidated: <T>(defaultValue: T) => invalid(defaultValue, [value]),
  toMaybe: () => none,
});
