import { failure, Failure, success, Success } from '../result';
import { none, None, some, Some } from '../maybe';

export type Validated<T, Err extends Error> = Valid<T> | Invalid<T, Err>;

export type Valid<T> = {
  // Fields
  kind: 'validated';
  value: T;
  valid: true;
  invalid: false;

  // Operations
  map: <U>(fn: (t: T) => U) => Valid<U>;
  flatMap: <U, Err extends Error>(fn: (t: T) => Validated<U, Err>) => Validated<U, Err>;
  validate: <Err extends Error>(fn: (self: T) => Validated<T, Err>) => Validated<T, Err>;

  // Transformations
  toResult: () => Success<T>;
  toMaybe: () => Some<T>;
};

export type Invalid<T, Err extends Error> = {
  // Fields
  kind: 'validated';
  value: T;
  errors: Err[];
  valid: false;
  invalid: true;

  // Operations
  map: () => Invalid<T, Err>;
  flatMap: () => Invalid<T, Err>;
  validate: (fn: (self: T) => Validated<T, Err>) => Invalid<T, Err>;

  // Transformations
  toResult: () => Failure<Err>;
  toMaybe: () => None;
};

export const valid = <T>(value: T): Valid<T> => ({
  // Fields
  kind: 'validated',
  value,
  valid: true,
  invalid: false,

  // Operations
  map: <U>(fn: (t: T) => U) => valid(fn(value)),
  flatMap: <U, Err extends Error>(fn: (self: T) => Validated<U, Err>) => fn(value),
  validate: <Err extends Error>(fn: (self: T) => Validated<T, Err>) => fn(value),

  // Transformations
  toResult: () => success(value),
  toMaybe: () => some(value),
});

export const invalid = <T, Err extends Error>(value: T, errors: Err[]): Invalid<T, Err> => ({
  // Fields
  kind: 'validated',
  value,
  errors,
  valid: false,
  invalid: true,

  // Operations
  map: () => invalid(value, [...errors]),
  flatMap: () => invalid(value, [...errors]),
  validate: (fn: (self: T) => Validated<T, Err>) => {
    const res = fn(value);
    const errs = res.valid ? [...errors] : [...errors, ...res.errors];
    return invalid(value, errs);
  },

  // Transformations
  toResult: () => failure(mergeErrors(errors) as Err),
  toMaybe: () => none,
});

const mergeErrors = (errors: Error[]): Error => ({
  name: 'Validation Error',
  message: errors.map((e) => `${e.name}: ${e.message}`).join('\n'),
});
