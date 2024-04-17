# definitelymaybe

### A tiny functional library for TypeScript

### Either

A simple implementation of the `Either` type (similar to `Result` types in other languages).
`Either` either contains a value, `T` in the `Left`, or an `Error` in the Right.

```typescript
const readFromFile = (path: string): Either<string, CannotReadFromFileError> =>
  fs.existsSync(path) ?
    left(fs.readFileSync(path, 'utf8')) :
    right(new CannotReadFromFileError(path));

const occurencesInFile = ({ path, text }: { path: string, text: string }): number =>
  readFromFile(path)
    .map((file) => (file.match(new RegExp(text) || []).length))
    .orElse(0);
``` 

### Maybe

Replacing `T | null` as an intermediary for a true `Optional` type. Like `Either` supports mapping and flatMapping
operations.

```typescript
const [str, setStr] = useState<Maybe<string>>(none<string>());

const appendStrCallback = (tail: string) => {
  const newStrVal = str
    .map(s => `${s.value}${tail}`)
    .orElse(tail);

  setStr(newStrVal);
}

```

### Attempt

Similar to `Try` in other languages, wraps an otherwise exception throwing function and returns an `Either` when thrown.

```typescript

const highScore = attempt(fetchHighScoreFromApi)
  .map((score) => `Your highscore is ${score}`)

```

## ** Todo **

- Async Attempt
- ErrMap support on Either
- Merging Eithers (or Validated, or both)