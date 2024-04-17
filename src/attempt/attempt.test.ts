import { attempt, attemptAsync } from './attempt';

describe('attempt', () => {
  it('returns right when an exception is thrown', () => {
    const res = attempt(() => {
      throw new Error('Whoops');
    });

    expect(res.isErr).toEqual(true);
    expect(res.value).toEqual(new Error('Whoops'));
  });

  it('returns right with generic error if something else is thrown', () => {
    const res = attempt(() => {
      throw 'foo';
    });

    expect(res.isErr).toEqual(true);
    expect(res.value).toEqual({
      name: 'An error occurred',
      message: `Value was thrown: "foo"`,
    });
  });

  it('returns left when no exception is thrown', () => {
    const res = attempt(() => 5);
    expect(res.isErr).toEqual(false);
    expect(res.value).toEqual(5);
  });
});

describe('attemptAsync', () => {
  const timeout = (duration: number) =>
    new Promise(function (resolve) {
      setTimeout(resolve, duration);
    });

  it('returns right when an exception is thrown', async () => {
    const sleep = () =>
      timeout(100).then(() => {
        throw new Error('Whoops');
      });

    const res = await attemptAsync(sleep);

    expect(res.isErr).toEqual(true);
    expect(res.value).toEqual(new Error('Whoops'));
  });

  it('returns right with generic error if something else is thrown', async () => {
    const sleep = () =>
      timeout(100).then(() => {
        throw 'Foo';
      });

    const res = await attemptAsync(sleep);

    expect(res.isErr).toEqual(true);
    expect(res.value).toEqual({
      name: 'An error occurred',
      message: `Value was thrown: "Foo"`,
    });
  });

  it('returns left when no exception is thrown', async () => {
    const sleep = () => timeout(100).then(() => 5);

    const res = await attemptAsync(sleep);

    expect(res.isErr).toEqual(false);
    expect(res.value).toEqual(5);
  });
});
