export const testErr = {
  name: 'Test Err',
  message: 'Whoops',
};

export const sleep = (duration: number) =>
  new Promise(function (resolve) {
    setTimeout(resolve, duration);
  });

export const sleepResolve = <T>(duration: number, resolved: T) =>
  sleep(duration).then(() => resolved);

export const sleepThrow = <T>(duration: number, thrown: T) =>
  sleep(duration).then(() => {
    throw thrown;
  });
