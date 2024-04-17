import { left, right } from '../either';
import { toMaybe } from './toMaybe';

describe('toMaybe', () => {
  const err = {
    name: 'Test Error',
    message: 'Uh-oh',
  };

  it('converts right to none', () => {
    const maybe = toMaybe(right(err));
    expect(maybe.isEmpty).toEqual(true);
  });

  it('converts left to some', () => {
    const maybe = toMaybe(left(5));
    expect(maybe.isEmpty ? -1 : maybe.value).toEqual(5);
  });
});
