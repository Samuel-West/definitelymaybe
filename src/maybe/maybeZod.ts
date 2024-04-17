import * as z from 'zod';
import { none, some } from './maybe';

export const maybeSchema = <T>(schema: z.ZodSchema<T>) =>
  schema.nullish().transform((val) => (val === undefined || val === null ? none() : some(val)));

export const maybeStringSchema = maybeSchema(z.string());
export const maybeNumberSchema = maybeSchema(z.number());
export const maybeBoolSchema = maybeSchema(z.boolean());
