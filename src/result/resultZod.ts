import * as z from 'zod';
import { success, failure } from './result';

const defaultError: Error = {
  name: 'Missing Field Error',
  message: 'Field was null or undefined',
};

export const resultSchema = <T, Err extends Error>(
  schema: z.ZodSchema<T>,
  err: Err = defaultError as Err
) =>
  schema
    .nullish()
    .transform((val) => (val === undefined || val === null ? failure(err) : success(val)));

export const resultStringSchema = resultSchema(z.string());
export const resultNumberSchema = resultSchema(z.number());
export const resultBoolSchema = resultSchema(z.boolean());
