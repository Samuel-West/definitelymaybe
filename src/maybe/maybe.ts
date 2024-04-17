export type Maybe<T> = Some<T> | None;

export type Some<T> = {
  value: T;
  map: <U>(fn: (t: T) => U) => Some<U>;
  flatMap: <U>(fn: (t: T) => Maybe<U>) => Maybe<U>;
  isPresent: true;
  isEmpty: false;
  orElse: (elseVal: T) => T;
};

export type None = {
  map: () => None;
  flatMap: () => None;
  isPresent: false;
  isEmpty: true;
  orElse: <T>(elseVal: T) => T;
};

export const some = <T>(value: T): Some<T> => ({
  value,
  map: <U>(fn: (t: T) => U) => some(fn(value)),
  flatMap: <U>(fn: (t: T) => Maybe<U>) => fn(value),
  isPresent: true,
  isEmpty: false,
  orElse: () => value,
});

export const none: None = {
  map: () => none,
  flatMap: () => none,
  isPresent: false,
  isEmpty: true,
  orElse: <T>(elseVal: T) => elseVal,
};
