import { failure, Result, success } from '../result';

export const attempt = <T, Err extends Error>(fn: () => T): Result<T, Err> => {
  try {
    return success(fn());
  } catch (err: unknown) {
    const mappedErr = (
      err instanceof Error
        ? err
        : {
            name: 'An error occurred',
            message: `Value was thrown: ${JSON.stringify(err, null, 2)}`,
          }
    ) as Err;

    return failure(mappedErr);
  }
};

export const attemptAsync = async <T, Err extends Error>(
  fn: () => Promise<T>
): Promise<Result<T, Err>> => {
  try {
    const res: T = await fn();
    return success(res);
  } catch (err: unknown) {
    const mappedErr = (
      err instanceof Error
        ? err
        : {
            name: 'An error occurred',
            message: `Value was thrown: ${JSON.stringify(err, null, 2)}`,
          }
    ) as Err;

    return failure(mappedErr);
  }
};
