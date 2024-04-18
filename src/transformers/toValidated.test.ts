import { success, failure } from '../result';
import { none, some } from '../maybe';
import { toValidated } from './toValidated';
import { testErr } from './testUtils';

describe('toValidated', () => {
  describe('result', () => {
    it('converts a success to a valid', () => {
      const validated = toValidated(success(5), 0);
      const contents = validated.valid ? validated.value : -1;

      expect(validated.valid).toEqual(true);
      expect(contents).toEqual(5);
    });

    it('converts a failure to an invalid', () => {
      const validated = toValidated(failure(testErr), 'Foo');
      const contents = validated.invalid ? validated.errors : [];

      expect(validated.valid).toEqual(false);
      expect(contents).toEqual([testErr]);
    });
  });

  describe('maybe', () => {
    it('converts a some to a valid', () => {
      const validated = toValidated(some(5), 0);
      const contents = validated.valid ? validated.value : -1;

      expect(validated.valid).toEqual(true);
      expect(contents).toEqual(5);
    });

    it('converts a none to an invalid', () => {
      const validated = toValidated(none, 'Foo');
      const contents = validated.invalid ? validated.errors : ['Foo', 'Bar', 'Baz'];

      expect(validated.valid).toEqual(false);
      expect(contents).toEqual([]);
    });
  });
});
