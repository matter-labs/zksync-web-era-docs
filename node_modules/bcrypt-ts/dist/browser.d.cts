/**
 * Synchronously tests a string against a hash.
 *
 * @param content String to compare
 * @param hash Hash to test against
 */
declare const compareSync: (content: string, hash: string) => boolean;
/**
 * Asynchronously compares the given data against the given hash.
 *
 * @param content Data to compare
 * @param hash Data to be compared to
 * @param progressCallback Callback successively called with the percentage of rounds completed
 *  (0.0 - 1.0), maximally once per `MAX_EXECUTION_TIME = 100` ms.
 */
declare const compare: (content: string, hash: string, progressCallback?: ((percent: number) => void) | undefined) => Promise<boolean>;

/**
 * Synchronously generates a hash for the given string.
 *
 * @param contentString String to hash
 * @param salt Salt length to generate or salt to use, default to 10
 * @returns Resulting hash
 */
declare const hashSync: (contentString: string, salt?: string | number) => string;
/**
 * Asynchronously generates a hash for the given string.
 *
 * @param contentString String to hash
 * @param salt Salt length to generate or salt to use
 * @param progressCallback Callback successively called with the percentage of rounds completed
 *  (0.0 - 1.0), maximally once per `MAX_EXECUTION_TIME = 100` ms.
 */
declare const hash: (contentString: string, salt: number | string, progressCallback?: ((progress: number) => void) | undefined) => Promise<string>;

/**
 * Gets the number of rounds used to encrypt the specified hash.
 *
 * @param hash Hash to extract the used number of rounds from
 * @returns Number of rounds used
 * @throws {Error} If `hash` is not a string
 */
declare const getRounds: (hash: string) => number;
/**
 * Gets the salt portion from a hash. Does not validate the hash.
 *
 * @param hash Hash to extract the salt from
 * @returns Extracted salt part
 * @throws {Error} If `hash` is not a string or otherwise invalid
 */
declare const getSalt: (hash: string) => string;

/**
 * Synchronously generates a salt.
 *
 * @param rounds Number of rounds to use, defaults to 10 if omitted
 * @returns Resulting salt
 * @throws {Error} If a random fallback is required but not set
 */
declare const genSaltSync: (rounds?: number) => string;
/**
 * Asynchronously generates a salt.
 *
 * @param rounds Number of rounds to use, defaults to 10 if omitted
 */
declare const genSalt: (rounds?: number) => Promise<string>;

export { compare, compareSync, genSalt, genSaltSync, getRounds, getSalt, hash, hashSync };
