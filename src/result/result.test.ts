import { success, failure } from './result';

describe('result', () => {
  const myErr: Error = {
    name: 'My Error',
    message: 'Kablooey',
  };

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
    const errVal = failure(myErr);
    expect(errVal.value).toEqual(myErr);
  });

  it('handles chaining', () => {
    const res = success(5)
      .map((n) => n * 10)
      .map((n) => n.toString())
      .flatMap((s) => (s === '50' ? success('Success!') : failure(myErr)));

    expect(res.value).toEqual('Success!');
  });

  it('maps err on failure', () => {
    const errVal = failure(myErr).mapErr(() => 'No longer an err');

    expect(errVal.isFailure).toEqual(false);
    expect(errVal.value).toEqual('No longer an err');
  });

  it('does nothing when mapping err on success', () => {
    const errVal = success(10).mapErr(() => 'No longer an err');

    expect(errVal.isFailure).toEqual(false);
    expect(errVal.value).toEqual(10);
  });
});
