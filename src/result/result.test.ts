import { sleep, sleepResolve, testErr } from '../testUtils';
import { success, failure } from './result';

describe('result', () => {
  describe('sync', () => {
    it('maps a success', () => {
      const maybeFive = success(5);
      const mapped = maybeFive.map((n) => n * 2);
      expect(mapped.value).toEqual(10);
    });

    it('flatmaps a success', () => {
      const maybeFive = success(5);
      const flatMapped = maybeFive.flatMap((n) => success(n * 2));
      expect(flatMapped.isFailure).toEqual(false);
      expect(flatMapped.isFailure ? -1 : flatMapped.value).toEqual(10);
    });

    it('is not err on a success', () => {
      const someValue = success(0);
      expect(someValue.isFailure).toEqual(false);
    });

    it('is err on a failure', () => {
      const errVal = failure(testErr);
      expect(errVal.value).toEqual(testErr);
    });

    it('handles chaining', () => {
      const res = success(5)
        .map((n) => n * 10)
        .map((n) => n.toString())
        .flatMap((s) => (s === '50' ? success('Success!') : failure(testErr)));

      expect(res.value).toEqual('Success!');
    });

    it('maps err on failure', () => {
      const errVal = failure(testErr).mapErr(() => 'No longer an err');

      expect(errVal.isFailure).toEqual(false);
      expect(errVal.value).toEqual('No longer an err');
    });

    it('does nothing when mapping err on success', () => {
      const errVal = success(10).mapErr(() => 'No longer an err');

      expect(errVal.isFailure).toEqual(false);
      expect(errVal.value).toEqual(10);
    });
  });

  describe('async', () => {
    it('maps a success', async () => {
      const res = await success(5).mapAsync((n) => sleep(100).then(() => n * 2));

      expect(res.value).toEqual(10);
    });

    it('flatmaps a success', async () => {
      const res = await success(5).flatMapAsync((n) => sleep(100).then(() => success(n * 2)));

      expect(res.value).toEqual(10);
    });

    it('handles async chaining', async () => {
      const res = await success(5)
        .mapAsync((n) => sleepResolve(50, n * 10))
        .then((_) => _.mapAsync((n) => sleepResolve(50, n.toString())))
        .then((_) =>
          _.flatMapAsync((s) =>
            sleepResolve(50, s === '50' ? success('Success!') : failure(testErr))
          )
        );

      expect(res.value).toEqual('Success!');
    });
  });

  describe('transforms', () => {
    describe('toValidated', () => {
      it('converts a success to a valid', () => {
        const validated = success(5).toValidated();
        const contents = validated.valid ? validated.value : -1;

        expect(validated.valid).toEqual(true);
        expect(contents).toEqual(5);
      });

      it('converts a failure to an invalid', () => {
        const validated = failure(testErr).toValidated('Foo');
        const contents = validated.invalid ? validated.errors : [];

        expect(validated.valid).toEqual(false);
        expect(contents).toEqual([testErr]);
      });
    });

    describe('toMaybe', () => {
      it('converts success to some', () => {
        const maybe = success(5).toMaybe();

        expect(maybe.isPresent).toEqual(true);
        expect(maybe.orElse(-1)).toEqual(5);
      });

      it('converts failure to none', () => {
        const maybe = failure(testErr).toMaybe();

        expect(maybe.isEmpty).toEqual(true);
      });
    });
  });
});
