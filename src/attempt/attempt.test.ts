import { sleepResolve, sleepThrow } from '../testUtils';
import { attempt, attemptAsync } from './attempt';

describe('attempt', () => {
  it('returns failure when an exception is thrown', () => {
    const res = attempt(() => {
      throw new Error('Whoops');
    });

    expect(res.isFailure).toEqual(true);
    expect(res.value).toEqual(new Error('Whoops'));
  });

  it('returns failure with generic error if something else is thrown', () => {
    const res = attempt(() => {
      throw 'foo';
    });

    expect(res.isFailure).toEqual(true);
    expect(res.value).toEqual({
      name: 'An error occurred',
      message: `Value was thrown: "foo"`,
    });
  });

  it('returns success when no exception is thrown', () => {
    const res = attempt(() => 5);
    expect(res.isFailure).toEqual(false);
    expect(res.value).toEqual(5);
  });
});

describe('attemptAsync', () => {
  it('returns failure when an exception is thrown', async () => {
    const sleep = () => sleepThrow(100, new Error('Whoops'));

    const res = await attemptAsync(sleep);

    expect(res.isFailure).toEqual(true);
    expect(res.value).toEqual(new Error('Whoops'));
  });

  it('returns failure with generic error if something else is thrown', async () => {
    const sleep = () => sleepThrow(100, 'Foo');

    const res = await attemptAsync(sleep);

    expect(res.isFailure).toEqual(true);
    expect(res.value).toEqual({
      name: 'An error occurred',
      message: `Value was thrown: "Foo"`,
    });
  });

  it('returns success when no exception is thrown', async () => {
    const sleep = () => sleepResolve(100, 5);

    const res = await attemptAsync(sleep);

    expect(res.isFailure).toEqual(false);
    expect(res.value).toEqual(5);
  });
});
