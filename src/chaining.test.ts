import { some } from './maybe';
import { sleepResolve } from './testUtils';
import { invalid, valid, Validated } from './validated';

describe('chaining', () => {
  it('can convert and chain between different types', async () => {
    const validateEven = (n: number): Validated<number, Error> =>
      n % 2 === 0 ? valid(n) : invalid(n, [new Error('Number was not divisible by 2')]);

    const res = await some(5)
      .mapAsync((n) => sleepResolve(50, n * 3))
      .then((_) => _.toValidated(0).validate(validateEven).toResult());

    expect(res.value).toEqual({
      name: 'Validation Error',
      message: 'Error: Number was not divisible by 2',
    });
  });
});
