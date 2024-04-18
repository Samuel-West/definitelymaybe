import { Result, success, failure } from '../result';
import { Maybe } from '../maybe';
import { Validated } from '../validated/validated';

type TransformInput<T, Err extends Error> = Validated<T, Err> | Maybe<T>;

export const toResult = <T, Err extends Error>(input: TransformInput<T, Err>): Result<T, Err> => {
  switch (input.kind) {
    case 'validated':
      return input.valid ? success(input.value) : failure(mergeErrors(input.errors) as Err);
    case 'maybe':
      return input.isPresent ? success(input.value) : failure(nullishValueError as Err);
  }
};

const mergeErrors = (errors: Error[]): Error => ({
  name: 'Validation Error',
  message: errors.map((e) => `${e.name}: ${e.message}`).join('\n'),
});

const nullishValueError: Error = {
  name: 'Nullish Value Error',
  message: 'Value was null or undefined',
};
