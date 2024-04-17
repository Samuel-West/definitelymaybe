import { left, right } from './either';

describe('either', () => {
  const myErr: Error = {
    name: 'My Error',
    message: 'Kablooey',
  };

  it('maps a left', () => {
    const maybeFive = left(5);
    const mapped = maybeFive.map((n) => n * 2);
    expect(mapped.value).toEqual(10);
  });

  it('flatmaps a left', () => {
    const maybeFive = left(5);
    const flatMapped = maybeFive.flatMap((n) => left(n * 2));
    expect(flatMapped.isErr).toEqual(false);
    expect(flatMapped.isErr ? -1 : flatMapped.value).toEqual(10);
  });

  it('is not err on a left', () => {
    const someValue = left(0);
    expect(someValue.isErr).toEqual(false);
  });

  it('is err on a right', () => {
    const errVal = right(myErr);
    expect(errVal.value).toEqual(myErr);
  });

  it('handles chaining', () => {
    const res = left(5)
      .map((n) => n * 10)
      .map((n) => n.toString())
      .flatMap((s) => (s === '50' ? left('Success!') : right(myErr)));

    expect(res.value).toEqual('Success!');
  });

  it('maps err on right', () => {
    const errVal = right(myErr).mapErr(() => 'No longer an err');

    expect(errVal.isErr).toEqual(false);
    expect(errVal.value).toEqual('No longer an err');
  });

  it('does nothing when mapping err on left', () => {
    const errVal = left(10).mapErr(() => 'No longer an err');

    expect(errVal.isErr).toEqual(false);
    expect(errVal.value).toEqual(10);
  });
});
