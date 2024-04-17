import { Either, left, right } from '../either';

export const attempt = <T, Err extends Error>(fn: () => T): Either<T, Err> => {
  try {
    return left(fn());
  } catch (err: unknown) {
    const mappedErr = (
      err instanceof Error
        ? err
        : {
            name: 'An error occurred',
            message: `Value was thrown: ${JSON.stringify(err, null, 2)}`,
          }
    ) as Err;

    return right(mappedErr);
  }
};
