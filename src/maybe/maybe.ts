export type Maybe<T> = Some<T> | None;

export type Some<T> = {
  kind: 'maybe';
  value: T;
  map: <U>(fn: (t: T) => U) => Some<U>;
  mapAsync: <U>(fn: (t: T) => Promise<U>) => Promise<Some<U>>;
  flatMap: <U>(fn: (t: T) => Maybe<U>) => Maybe<U>;
  flatMapAsync: <U>(fn: (t: T) => Promise<Maybe<U>>) => Promise<Maybe<U>>;
  isPresent: true;
  isEmpty: false;
  orElse: (elseVal: T) => T;
};

export type None = {
  kind: 'maybe';
  map: () => None;
  mapAsync: () => Promise<None>;
  flatMap: () => None;
  flatMapAsync: () => Promise<None>;
  isPresent: false;
  isEmpty: true;
  orElse: <T>(elseVal: T) => T;
};

export const some = <T>(value: T): Some<T> => ({
  kind: 'maybe',
  value,
  map: <U>(fn: (t: T) => U) => some(fn(value)),
  mapAsync: async <U>(fn: (t: T) => Promise<U>) => {
    const res: U = await fn(value);
    return some(res);
  },
  flatMap: <U>(fn: (t: T) => Maybe<U>) => fn(value),
  flatMapAsync: async <U>(fn: (t: T) => Promise<Maybe<U>>) => await fn(value),
  isPresent: true,
  isEmpty: false,
  orElse: () => value,
});

export const none: None = {
  kind: 'maybe',
  map: () => none,
  mapAsync: () => new Promise((resolve) => resolve(none)),
  flatMap: () => none,
  flatMapAsync: () => new Promise((resolve) => resolve(none)),
  isPresent: false,
  isEmpty: true,
  orElse: <T>(elseVal: T) => elseVal,
};
