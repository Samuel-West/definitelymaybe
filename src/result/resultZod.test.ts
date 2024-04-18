import * as z from 'zod';
import {
  resultBoolSchema,
  resultNumberSchema,
  resultSchema,
  resultStringSchema,
} from './resultZod';

describe('resultZod', () => {
  it('parses null into a none', () => {
    expect(resultStringSchema.parse(null).isFailure).toEqual(true);
  });

  it('parses undefined into a none', () => {
    expect(resultStringSchema.parse(undefined).isFailure).toEqual(true);
  });

  it('uses default error', () => {
    const res = resultStringSchema.parse(null);
    expect(res.value).toEqual({
      name: 'Missing Field Error',
      message: 'Field was null or undefined',
    });
  });

  it('uses custom error', () => {
    const customErr = { name: 'CustomError', message: 'Uh-oh' };
    const res = resultSchema(z.string(), customErr).parse(null);
    expect(res.value).toEqual(customErr);
  });

  it('parses non nullish values into a some', () => {
    const res = resultStringSchema.parse('foo');
    expect(res.value).toEqual('foo');
  });

  it('works with booleans', () => {
    const res = resultBoolSchema.parse(true);
    expect(res.value).toEqual(true);
  });

  it('works with numbers', () => {
    const res = resultNumberSchema.parse(10);
    expect(res.value).toEqual(10);
  });
});
