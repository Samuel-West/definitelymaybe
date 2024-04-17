import * as z from 'zod';
import {
  eitherBoolSchema,
  eitherNumberSchema,
  eitherSchema,
  eitherStringSchema,
} from './eitherZod';

describe('eitherZod', () => {
  it('parses null into a none', () => {
    expect(eitherStringSchema.parse(null).isErr).toEqual(true);
  });

  it('parses undefined into a none', () => {
    expect(eitherStringSchema.parse(undefined).isErr).toEqual(true);
  });

  it('uses default error', () => {
    const res = eitherStringSchema.parse(null);
    expect(res.value).toEqual({
      name: 'Missing Field Error',
      message: 'Field was null or undefined',
    });
  });

  it('uses custom error', () => {
    const customErr = { name: 'CustomError', message: 'Uh-oh' };
    const res = eitherSchema(z.string(), customErr).parse(null);
    expect(res.value).toEqual(customErr);
  });

  it('parses non nullish values into a some', () => {
    const res = eitherStringSchema.parse('foo');
    expect(res.value).toEqual('foo');
  });

  it('works with booleans', () => {
    const res = eitherBoolSchema.parse(true);
    expect(res.value).toEqual(true);
  });

  it('works with numbers', () => {
    const res = eitherNumberSchema.parse(10);
    expect(res.value).toEqual(10);
  });
});
