import { invalid, valid, Validated } from './validated';

describe('validated', () => {
  type User = {
    phoneNumber: string;
    firstName: string | undefined;
    lastName: string | undefined;
  };

  const validatePhoneNumber = (user: User): Validated<User, Error> =>
    user.phoneNumber.length === 11
      ? valid(user)
      : invalid(user, [new Error('Phone number wrong length')]);

  const validateName = (user: User): Validated<User, Error> =>
    !!user.firstName && !!user.lastName
      ? valid(user)
      : invalid(user, [new Error('User must have first and last name')]);

  it('produces a valid when chaining passing validations', () => {
    const validUser: User = {
      phoneNumber: '07777570717',
      firstName: 'Jane',
      lastName: 'Doe',
    };

    const res = valid(validUser).validate(validatePhoneNumber).validate(validateName);

    expect(res.valid).toEqual(true);
    expect(res.invalid).toEqual(false);
    expect(res.value).toEqual(validUser);
  });

  it('produces an invalid when chaining failing validations', () => {
    const invalidUser: User = {
      phoneNumber: '077',
      firstName: undefined,
      lastName: 'Doe',
    };

    const res = valid(invalidUser).validate(validatePhoneNumber).validate(validateName);

    expect(res.valid).toEqual(false);
    expect(res.invalid).toEqual(true);
    expect(res.value).toEqual(invalidUser);
    expect(res.invalid ? res.errors : []).toEqual([
      new Error('Phone number wrong length'),
      new Error('User must have first and last name'),
    ]);
  });
});
