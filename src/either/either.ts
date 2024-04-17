export type Either<T, Err extends Error> = Left<T> | Right<Err>;

export type Left<T> = {
  value: T;
  map: <U>(fn: (t: T) => U) => Left<U>;
  flatMap: <U, Err extends Error>(fn: (t: T) => Either<U, Err>) => Either<U, Err>;
  isErr: false;
};

export type Right<Err extends Error> = {
  value: Err;
  map: () => Right<Err>;
  flatMap: () => Right<Err>;
  isErr: true;
  rethrow: () => void;
};

export const left = <T>(value: T): Left<T> => ({
  value,
  map: <U>(fn: (t: T) => U) => left(fn(value)),
  flatMap: <U, Err extends Error>(fn: (t: T) => Either<U, Err>) => fn(value),
  isErr: false,
});

export const right = <Err extends Error>(value: Err): Right<Err> => ({
  value,
  map: () => right(value),
  flatMap: () => right(value),
  isErr: true,
  rethrow: () => {
    throw value;
  },
});
