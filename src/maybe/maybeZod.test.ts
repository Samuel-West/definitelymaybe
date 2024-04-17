import { maybeBoolSchema, maybeNumberSchema, maybeStringSchema } from './maybeZod';

describe('maybeZod', () => {
  it('parses null into a none', () => {
    expect(maybeStringSchema.parse(null).isEmpty).toEqual(true);
  });

  it('parses undefined into a none', () => {
    expect(maybeStringSchema.parse(undefined).isEmpty).toEqual(true);
  });

  it('parses non nullish values into a some', () => {
    const res = maybeStringSchema.parse('foo');
    expect(res.orElse('baz')).toEqual('foo');
  });

  it('works with booleans', () => {
    const res = maybeBoolSchema.parse(true);
    expect(res.orElse(false)).toEqual(true);
  });

  it('works with numbers', () => {
    const res = maybeNumberSchema.parse(10);
    expect(res.orElse(-1)).toEqual(10);
  });
});
