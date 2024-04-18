# probably-maybe

### A tiny functional library for TypeScript

### Either

A simple implementation of the `Either` type (similar to `Result` types in other languages).
`Either` either contains a value, `T`, in the `Left`, or an `Error` in the Right.

```typescript
const readFromFile = (path: string): Either<string, CannotReadFromFileError> =>
  fs.existsSync(path)
    ? left(fs.readFileSync(path, 'utf8'))
    : right(new CannotReadFromFileError(path));

const occurencesInFile = ({ path, text }: { path: string; text: string }): number =>
  readFromFile(path)
    .map((file) => file.match(new RegExp(text) || []).length)
    .orElse(0);
```

The `Right` side can additionally be remapped back to a `Left` using `errMap` (note this is not bidirectional, there is
no way to convert a `Left` to a `Right`).

```typescript
const apiError: Right<unknown, Error> = right(new Error('404 - Not Found'));

const userFriendlyError: Left<string, unknown> = apiError.mapErr(
  () => 'Oops something went wrong!'
);
```

When working with Promises there are also `async` equivalents of `map` and `flatMap`

```typescript
const fetchUserId = async (username: string): Promise<Result<ID, Error>> =>
  fetchUser(username).then((user) => user.id);

const fetchHighScore = async (userId: ID): Promise<Result<string, Error>> =>
  fetchHighscore(userId).then((score) =>
    !!score ? success(score) : failure(new Error('Failed to fetch highscore'))
  );

const userScore = left(username).mapAsync(fetchUserId).flatMapAsync(fetchHighScore);
```

### Maybe

Replacing `T | null` as an intermediary for a true `Optional` type. Like `Either` supports mapping and flatMapping
operations.

```typescript
const [str, setStr] = useState<Maybe<string>>(none<string>());

const appendStrCallback = (tail: string) => {
  const newStrVal = str.map((s) => `${s.value}${tail}`).orElse(tail);

  setStr(newStrVal);
};
```

As with `Result` there are async versions of `map` and `flatMap` for `Maybe`.

```typescript
const fetchUserId = async (username: string): Promise<Maybe<ID>> =>
  fetchUser(username).then((user) => user.id);

const fetchHighScore = async (userId: ID): Promise<Result<string, Error>> =>
  fetchHighscore(userId).then((score) => (!!score ? some(score) : none));

const userScore = some(username).mapAsync(fetchUserId).flatMapAsync(fetchHighScore);
```

### Validated

Similar to `Either` except with the ability to chain multiple evaluations together, producing either a `Valid<T>` or
an `Invalid<Err[]>` containing a list of all validation errors.

```typescript
const usernamePresent = (user: User): Validated<User, InvalidUsernameError> =>
  !!user.name ? valid(user) : invalid(user, new InvalidUsernameError(user));

const validatedUser = valid(user).validate(usernamePresent);
```

### Attempt

Similar to `Try` in other languages, wraps an otherwise exception throwing function and returns an `Either` when thrown.

An async version also exists with the same signature for working with Promises.

```typescript
const highScore = attemptAsync(() => fetchHighScoreFromApi(playerId)).map(
  (score) => `Your highscore is ${score}`
);
```

## ** Todo **

- mapN equivalent
