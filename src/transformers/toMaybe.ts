import { Either } from '../either';
import { Maybe, none, some } from '../maybe';

export const toMaybe = <T, Err extends Error>(either: Either<T, Err>): Maybe<T> =>
  either.isErr ? none : some(either.value);
