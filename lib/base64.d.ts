/**
 * encode string to base64
 *
 * @param input
 */
declare const encode: (input?: string) => string;
/**
 * decode base64 to string
 *
 * @param input base64 string
 */
declare const decode: (input: string) => string;
export { encode, decode };
