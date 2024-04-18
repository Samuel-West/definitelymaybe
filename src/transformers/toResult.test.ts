import { none, some } from '../maybe';
import { invalid, valid } from '../validated/validated';
import { testErr } from '../testUtils';
import { toResult } from './toResult';

describe('toResult', () => {
  describe('maybe', () => {
    it('converts some to success', () => {
      const result = toResult(some(5));

      expect(result.isSuccess).toEqual(true);
      expect(result.value).toEqual(5);
    });

    it('converts none to failure', () => {
      const result = toResult(none);

      expect(result.isFailure).toEqual(true);
      expect(result.value).toEqual({
        name: 'Nullish Value Error',
        message: 'Value was null or undefined',
      });
    });
  });

  describe('validated', () => {
    it('converts valid to success', () => {
      const result = toResult(valid(5));

      expect(result.isSuccess).toEqual(true);
      expect(result.value).toEqual(5);
    });

    it('converts invalid to failure', () => {
      const result = toResult(invalid('Foo', [testErr]));

      expect(result.isFailure).toEqual(true);
      expect(result.value).toEqual({
        name: 'Validation Error',
        message: `${testErr.name}: ${testErr.message}`,
      });
    });
  });
});
