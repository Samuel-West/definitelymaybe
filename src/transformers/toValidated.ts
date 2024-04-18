import { invalid, valid, Validated } from '../validated/validated';
import { Result } from '../result';
import { Maybe } from '../maybe';

export type TransformInput<T, Err extends Error> = Result<T, Err> | Maybe<T>;

export const toValidated = <T, Err extends Error>(
  input: TransformInput<T, Err>
): Validated<T, Err> => {
  switch (input.kind) {
    case 'result':
      return input.isSuccess ? valid(input.value) : invalid([input.value]);
    case 'maybe':
      return input.isPresent ? valid(input.value) : invalid([] as Err[]);
  }
};
