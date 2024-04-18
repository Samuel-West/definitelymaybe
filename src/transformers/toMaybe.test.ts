import { success, failure } from '../result';
import { none } from '../maybe';
import { invalid, valid } from '../validated/validated';
import { testErr } from '../testUtils';
import { toMaybe } from './toMaybe';

describe('toMaybe', () => {
  describe('result', () => {
    it('converts success to some', () => {
      const maybe = toMaybe(success(5));

      expect(maybe.isPresent).toEqual(true);
      expect(maybe.orElse(-1)).toEqual(5);
    });

    it('converts failure to none', () => {
      const maybe = toMaybe(failure(testErr));

      expect(maybe).toEqual(none);
    });
  });

  describe('validated', () => {
    it('converts valid to some', () => {
      const maybe = toMaybe(valid(5));

      expect(maybe.isPresent).toEqual(true);
      expect(maybe.orElse(-1)).toEqual(5);
    });

    it('converts invalid to none', () => {
      const maybe = toMaybe(invalid('Foo', [testErr]));

      expect(maybe).toEqual(none);
    });
  });
});
