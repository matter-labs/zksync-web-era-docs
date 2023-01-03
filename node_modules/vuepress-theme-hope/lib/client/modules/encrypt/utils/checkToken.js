import { compareSync } from "bcrypt-ts/browser";
export const checkToken = (token = "", hash) => Boolean(token) && compareSync(token, hash);
//# sourceMappingURL=checkToken.js.map