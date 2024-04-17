import { none, some } from './maybe';

describe('maybe', () => {
  it('maps a some', () => {
    const maybeFive = some(5);
    const mapped = maybeFive.map((n) => n * 2);
    expect(mapped.value).toEqual(10);
  });

  it('flatmaps a some', () => {
    const maybeFive = some(5);
    const flatMapped = maybeFive.flatMap((n) => some(n * 2));
    expect(flatMapped.isEmpty).toEqual(false);
    expect(flatMapped.isEmpty ? -1 : flatMapped.value).toEqual(10);
  });

  it('is not empty on a some', () => {
    const someValue = some(0);
    expect(someValue.isEmpty).toEqual(false);
  });

  it('is empty on a none', () => {
    const someValue = none();
    expect(someValue.isEmpty).toEqual(true);
  });

  it('returns value on a some', () => {
    const someFoo = some('foo');
    expect(someFoo.orElse('bar')).toEqual('foo');
  });

  it('returns else on a none', () => {
    const someFoo = none();
    expect(someFoo.orElse('bar')).toEqual('bar');
  });

  it('handles chaining', () => {
    const res = some(5)
      .map((n) => n * 10)
      .map((n) => n.toString())
      .flatMap((s) => (s === '50' ? some('Success!') : none<string>()));

    expect(res.orElse('Fail')).toEqual('Success!');
  });
});