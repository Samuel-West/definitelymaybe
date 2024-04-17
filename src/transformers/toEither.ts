import { Either, left, right } from '../either';
import { Maybe } from '../maybe';

export const toEither = <T, Err extends Error>(maybe: Maybe<T>, err: Err): Either<T, Err> =>
  maybe.isEmpty ? right(err) : left(maybe.value);
