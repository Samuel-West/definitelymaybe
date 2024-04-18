export type Validated<T, Err extends Error> = Valid<T> | Invalid<T, Err>;

export type Valid<T> = {
  kind: 'validated';
  value: T;
  valid: true;
  invalid: false;
  map: <U>(fn: (t: T) => U) => Valid<U>;
  flatMap: <U, Err extends Error>(fn: (t: T) => Validated<U, Err>) => Validated<U, Err>;
  validate: <Err extends Error>(fn: (self: T) => Validated<T, Err>) => Validated<T, Err>;
};

export type Invalid<T, Err extends Error> = {
  kind: 'validated';
  value: T;
  errors: Err[];
  valid: false;
  invalid: true;
  map: () => Invalid<T, Err>;
  flatMap: () => Invalid<T, Err>;
  validate: (fn: (self: T) => Validated<T, Err>) => Invalid<T, Err>;
};

export const valid = <T>(value: T): Valid<T> => ({
  kind: 'validated',
  value,
  valid: true,
  invalid: false,
  map: <U>(fn: (t: T) => U) => valid(fn(value)),
  flatMap: <U, Err extends Error>(fn: (self: T) => Validated<U, Err>) => fn(value),
  validate: <Err extends Error>(fn: (self: T) => Validated<T, Err>) => fn(value),
});

export const invalid = <T, Err extends Error>(value: T, errors: Err[]): Invalid<T, Err> => ({
  kind: 'validated',
  value,
  errors,
  valid: false,
  invalid: true,
  map: () => invalid(value, [...errors]),
  flatMap: () => invalid(value, [...errors]),
  validate: (fn: (self: T) => Validated<T, Err>) => {
    const res = fn(value);
    const errs = res.valid ? [...errors] : [...errors, ...res.errors];
    return invalid(value, errs);
  },
});
