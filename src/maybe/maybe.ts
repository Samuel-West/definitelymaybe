export type Maybe<T> = Some<T> | None<T>;

export type Some<T> = {
  value: T;
  map: <U>(fn: (t: T) => U) => Some<U>;
  flatMap: <U>(fn: (t: T) => Maybe<U>) => Maybe<U>;
  isEmpty: false;
  orElse: (elseVal: T) => T;
};

export type None<T> = {
  map: () => None<T>;
  flatMap: () => None<T>;
  isEmpty: true;
  orElse: (elseVal: T) => T;
};

export const some = <T>(value: T): Some<T> => ({
  value,
  map: <U>(fn: (t: T) => U) => some(fn(value)),
  flatMap: <U>(fn: (t: T) => Maybe<U>) => fn(value),
  isEmpty: false,
  orElse: () => value,
});

export const none = <T>(): None<T> => ({
  map: () => none(),
  flatMap: () => none(),
  isEmpty: true,
  orElse: (elseVal: T) => elseVal,
});
