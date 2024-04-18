import { sleep, sleepResolve } from '../testUtils';
import { none, some } from './maybe';

describe('maybe', () => {
  describe('sync', () => {
    it('maps a some', () => {
      const maybeFive = some(5);
      const mapped = maybeFive.map((n) => n * 2);

      expect(mapped.value).toEqual(10);
    });

    it('flatmaps a some', () => {
      const maybeFive = some(5);
      const flatMapped = maybeFive.flatMap((n) => some(n * 2));

      expect(flatMapped.isEmpty ? -1 : flatMapped.value).toEqual(10);
    });

    it('is not empty on a some', () => {
      const someValue = some(0);

      expect(someValue.isEmpty).toEqual(false);
      expect(someValue.isPresent).toEqual(true);
    });

    it('is empty on a none', () => {
      expect(none.isEmpty).toEqual(true);
      expect(none.isPresent).toEqual(false);
    });

    it('returns value on a some', () => {
      const someFoo = some('foo');
      expect(someFoo.orElse('bar')).toEqual('foo');
    });

    it('returns else on a none', () => {
      expect(none.orElse('bar')).toEqual('bar');
    });

    it('handles chaining', () => {
      const res = some(5)
        .map((n) => n * 10)
        .map((n) => n.toString())
        .flatMap((s) => (s === '50' ? some('Success!') : none));

      expect(res.orElse('Fail')).toEqual('Success!');
    });
  });

  describe('async', () => {
    it('maps a some', async () => {
      const res = await some(5).mapAsync(async (n) => await sleep(100).then(() => n * 2));

      expect(res.value).toEqual(10);
    });

    it('flatmaps a some', async () => {
      const res = await some(5).flatMapAsync(async (n) => await sleep(100).then(() => some(n * 2)));

      expect(res.orElse(0)).toEqual(10);
    });

    it('handles async chaining', async () => {
      const res = await some(5)
        .mapAsync((n) => sleepResolve(50, n * 10))
        .then((_) => _.mapAsync((n) => sleepResolve(50, n.toString())))
        .then((_) => _.flatMapAsync((s) => sleepResolve(50, s === '50' ? some('Success!') : none)));

      expect(res.orElse('Fail')).toEqual('Success!');
    });
  });

  describe('transforms', () => {
    describe('toResult', () => {
      it('converts some to success', () => {
        const result = some(5).toResult();

        expect(result.isSuccess).toEqual(true);
        expect(result.value).toEqual(5);
      });

      it('converts none to failure', () => {
        const result = none.toResult();

        expect(result.isFailure).toEqual(true);
        expect(result.value).toEqual({
          name: 'Nullish Value Error',
          message: 'Value was null or undefined',
        });
      });
    });

    describe('toValidated', () => {
      it('converts a some to a valid', () => {
        const validated = some(5).toValidated(0);
        const contents = validated.valid ? validated.value : -1;

        expect(validated.valid).toEqual(true);
        expect(contents).toEqual(5);
      });

      it('converts a none to an invalid', () => {
        const validated = none.toValidated('Foo');
        const contents = validated.invalid ? validated.errors : ['Foo', 'Bar', 'Baz'];

        expect(validated.valid).toEqual(false);
        expect(contents).toEqual([]);
      });
    });
  });
});
