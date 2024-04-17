import { none, some } from '../maybe';
import { toEither } from './toEither';

describe('toEither', () => {
  const err = {
    name: 'Test Error',
    message: 'Uh-oh',
  };

  it('converts none to right', () => {
    const either = toEither(none, err);
    expect(either.value).toEqual(err);
  });

  it('converts some to left', () => {
    const either = toEither(some(5), err);
    expect(either.value).toEqual(5);
  });
});
