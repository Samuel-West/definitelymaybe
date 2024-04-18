export type Validated<T, Err extends Error> = Valid<T> | Invalid<Err>;

export type Valid<T> = {
  kind: 'validated';
  value: T;
  valid: true;
  invalid: false;
  map: <U>(fn: (t: T) => U) => Valid<U>;
  flatMap: <U, Err extends Error>(fn: (t: T) => Validated<U, Err>) => Validated<U, Err>;
  validate: <U, Err extends Error>(fn: () => Validated<U, Err>) => Validated<U, Err>;
};

export type Invalid<Err extends Error> = {
  kind: 'validated';
  errors: Err[];
  valid: false;
  invalid: true;
  map: () => Invalid<Err>;
  flatMap: () => Invalid<Err>;
  validate: <T>(fn: () => Validated<T, Err>) => Invalid<Err>;
};

export const valid = <T>(value: T): Valid<T> => ({
  kind: 'validated',
  value,
  valid: true,
  invalid: false,
  map: <U>(fn: (t: T) => U) => valid(fn(value)),
  flatMap: <U, Err extends Error>(fn: (t: T) => Validated<U, Err>) => fn(value),
  validate: <U, Err extends Error>(fn: () => Validated<U, Err>) => fn(),
});

export const invalid = <Err extends Error>(errors: Err[]): Invalid<Err> => ({
  kind: 'validated',
  errors,
  valid: false,
  invalid: true,
  map: () => invalid([...errors]),
  flatMap: () => invalid([...errors]),
  validate: <T>(fn: () => Validated<T, Err>) => {
    const res = fn();
    const errs = res.valid ? [...errors] : [...errors, ...res.errors];
    return invalid(errs);
  },
});
