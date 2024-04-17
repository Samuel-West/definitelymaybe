import * as z from 'zod';
import { left, right } from './either';

const defaultError: Error = {
  name: 'Missing Field Error',
  message: 'Field was null or undefined',
};

export const eitherSchema = <T, Err extends Error>(
  schema: z.ZodSchema<T>,
  err: Err = defaultError as Err
) =>
  schema.nullish().transform((val) => (val === undefined || val === null ? right(err) : left(val)));

export const eitherStringSchema = eitherSchema(z.string());
export const eitherNumberSchema = eitherSchema(z.number());
export const eitherBoolSchema = eitherSchema(z.boolean());
