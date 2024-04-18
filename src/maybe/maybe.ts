import { failure, Failure, success, Success } from '../result';
import { invalid, Invalid, valid, Valid } from '../validated/validated';

export type Maybe<T> = Some<T> | None;

export type Some<T> = {
  // Fields
  kind: 'maybe';
  value: T;
  isPresent: true;
  isEmpty: false;

  // Operations
  map: <U>(fn: (t: T) => U) => Some<U>;
  mapAsync: <U>(fn: (t: T) => Promise<U>) => Promise<Some<U>>;
  flatMap: <U>(fn: (t: T) => Maybe<U>) => Maybe<U>;
  flatMapAsync: <U>(fn: (t: T) => Promise<Maybe<U>>) => Promise<Maybe<U>>;
  orElse: (elseVal: T) => T;

  // Transformations
  toResult: () => Success<T>;
  toValidated: (defaultValue: T) => Valid<T>;
};

export type None = {
  // Fields
  kind: 'maybe';
  isPresent: false;
  isEmpty: true;

  // Operations
  map: () => None;
  mapAsync: () => Promise<None>;
  flatMap: () => None;
  flatMapAsync: () => Promise<None>;
  orElse: <T>(elseVal: T) => T;

  // Transformations
  toResult: () => Failure<Error>;
  toValidated: <T>(defaultValue: T) => Invalid<T, Error>;
};

export const some = <T>(value: T): Some<T> => ({
  // Fields
  kind: 'maybe',
  value,
  isPresent: true,
  isEmpty: false,

  // Operations
  map: <U>(fn: (t: T) => U) => some(fn(value)),
  mapAsync: async <U>(fn: (t: T) => Promise<U>) => {
    const res: U = await fn(value);
    return some(res);
  },
  flatMap: <U>(fn: (t: T) => Maybe<U>) => fn(value),
  flatMapAsync: async <U>(fn: (t: T) => Promise<Maybe<U>>) => await fn(value),
  orElse: () => value,

  // Transformations
  toResult: () => success(value),
  toValidated: () => valid(value),
});

export const none: None = {
  // Fields
  kind: 'maybe',
  isPresent: false,
  isEmpty: true,

  // Operations
  map: () => none,
  mapAsync: () => new Promise((resolve) => resolve(none)),
  flatMap: () => none,
  flatMapAsync: () => new Promise((resolve) => resolve(none)),
  orElse: <T>(elseVal: T) => elseVal,

  // Transformations
  toResult: () => failure(nullishValueError),
  toValidated: <T>(defaultValue: T) => invalid(defaultValue, [] as Error[]),
};

const nullishValueError: Error = {
  name: 'Nullish Value Error',
  message: 'Value was null or undefined',
};
