import { Result } from '../result';
import { Maybe, none, some } from '../maybe';
import { Validated } from '../validated/validated';

type TransformInput<T, Err extends Error> = Validated<T, Err> | Result<T, Err>;

export const toMaybe = <T, Err extends Error>(input: TransformInput<T, Err>): Maybe<T> => {
  switch (input.kind) {
    case 'validated':
      return input.valid ? some(input.value) : none;
    case 'result':
      return input.isSuccess ? some(input.value) : none;
  }
};
