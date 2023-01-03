# bcrypt-ts

Optimized bcrypt written in typescript. Working in both Node.js and browser.

> Heavily inspired by [bcrypt.js](https://github.com/dcodeIO/bcrypt.js).

## Security considerations

Besides incorporating a salt to protect against rainbow table attacks, bcrypt is an adaptive function: over time, the
iteration count can be increased to make it slower, so it remains resistant to brute-force search attacks even with
increasing computation power. ([see](http://en.wikipedia.org/wiki/Bcrypt))

While bcrypt-ts is compatible to the C++ bcrypt binding, it is providing pure JavaScript and thus slower about 30%, effectively reducing the number of iterations that can be processed in an equal time span.

The maximum input length is 72 bytes (note that UTF8 encoded characters use up to 4 bytes) and the length of generated
hashes is 60 characters.

## Highlights

- 0 dependencies, with ONLY 8KB Gzip size
- Written in typescript
- Provide tree-shakable ES module

## Usage

### Node.js

On Node.js, the inbuilt [crypto module](http://nodejs.org/api/crypto.html)'s randomBytes interface is used to obtain secure random numbers.

### Browser

In the browser, bcrypt.js relies on [Web Crypto API](http://www.w3.org/TR/WebCryptoAPI)'s getRandomValues interface to obtain secure random numbers. If no cryptographically secure source of randomness is available, the package will **throw an error**.

### How to choose between them

- If you are using this package in pure Node.js environment, then you will probably use the node bundle.

- If you are using bundler like webpack and vite, then you will probably use the client bundle.

- If you meet any issues that a incorrect bundle is used, you can use `bcrypt-ts/node` and `bcrypt-ts/client` to force the correct bundle.

## Usage - Sync

To hash a password:

```js
import { genSaltSync, hashSync } from "bcrypt-ts";

const salt = genSaltSync(10);
const hash = hashSync("B4c0//", salt);
// Store hash in your password DB.
```

To check a password:

```js
import { compareSync } from "bcrypt-ts";

// Load hash from your password DB.
compareSync("B4c0//", hash); // true
compareSync("not_bacon", hash); // false
```

Auto-gen a salt and hash at the same time:

```js
import { hashSync } from "bcrypt-ts";

const hash = hashSync("bacon", 8);
```

## Usage - Async

To hash a password:

```js
import { genSalt, hash } from "bcrypt-ts";

genSalt(10)
  .then((salt) => hash("B4c0//", salt))
  .then((hash) => {
    // Store hash in your password DB.
  });
```

To check a password:

```js
import { compare } from "bcrypt-ts";

// Load hash from your password DB.
const hash = "xxxxxx";

compare("B4c0//", hash).then((result) => {
  // result is `true`
});
compare("not_bacon", hash).then((result) => {
  // result is `false`
});
```

Auto-gen a salt and hash:

```js
import { hash } from "bcrypt-ts";

hash("bacon").then((hash) => {
  // do something with hash
});
```

**Note:** Under the hood, asynchronisation splits a crypto operation into small chunks. After the completion of a chunk, the execution of the next chunk is placed on the back of [JS event loop queue](https://developer.mozilla.org/en/docs/Web/JavaScript/EventLoop), thus efficiently sharing the computational resources with the other operations in the queue.

## API

```ts
/**
 * Synchronously tests a string against a hash.
 *
 * @param content String to compare
 * @param hash Hash to test against
 */
export const compareSync: (content: string, hash: string) => boolean;
/**
 * Asynchronously compares the given data against the given hash.
 *
 * @param content Data to compare
 * @param hash Data to be compared to
 * @param progressCallback Callback successively called with the percentage of rounds completed
 *  (0.0 - 1.0), maximally once per `MAX_EXECUTION_TIME = 100` ms.
 */
export const compare: (
  content: string,
  hash: string,
  progressCallback?: ((percent: number) => void) | undefined
) => Promise<boolean>;

/**
 * Synchronously generates a hash for the given string.
 *
 * @param contentString String to hash
 * @param salt Salt length to generate or salt to use, default to 10
 * @returns Resulting hash
 */
export const hashSync: (
  contentString: string,
  salt?: string | number
) => string;
/**
 * Asynchronously generates a hash for the given string.
 *
 * @param contentString String to hash
 * @param salt Salt length to generate or salt to use
 * @param progressCallback Callback successively called with the percentage of rounds completed
 *  (0.0 - 1.0), maximally once per `MAX_EXECUTION_TIME = 100` ms.
 */
export const hash: (
  contentString: string,
  salt: number | string,
  progressCallback?: ((progress: number) => void) | undefined
) => Promise<string>;

/**
 * Gets the number of rounds used to encrypt the specified hash.
 *
 * @param hash Hash to extract the used number of rounds from
 * @returns Number of rounds used
 * @throws {Error} If `hash` is not a string
 */
export const getRounds: (hash: string) => number;
/**
 * Gets the salt portion from a hash. Does not validate the hash.
 *
 * @param hash Hash to extract the salt from
 * @returns Extracted salt part
 * @throws {Error} If `hash` is not a string or otherwise invalid
 */
export const getSalt: (hash: string) => string;

/**
 * Synchronously generates a salt.
 *
 * @param rounds Number of rounds to use, defaults to 10 if omitted
 * @returns Resulting salt
 * @throws {Error} If a random fallback is required but not set
 */
export const genSaltSync: (rounds?: number) => string;
/**
 * Asynchronously generates a salt.
 *
 * @param rounds Number of rounds to use, defaults to 10 if omitted
 */
export const genSalt: (rounds?: number) => Promise<string>;
```

## License

New-BSD / MIT ([see](https://github.com/Mister-Hope/bcrypt-ts/blob/main/LICENSE))
