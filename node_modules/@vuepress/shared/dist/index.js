// src/utils/index.ts
import { isArray, isFunction, isString } from "@vue/shared";

// src/utils/resolveHeadIdentifier.ts
var resolveHeadIdentifier = ([
  tag,
  attrs,
  content
]) => {
  if (tag === "meta" && attrs.name) {
    return `${tag}.${attrs.name}`;
  }
  if (["title", "base"].includes(tag)) {
    return tag;
  }
  if (tag === "template" && attrs.id) {
    return `${tag}.${attrs.id}`;
  }
  return JSON.stringify([tag, attrs, content]);
};

// src/utils/dedupeHead.ts
var dedupeHead = (head) => {
  const identifierSet = /* @__PURE__ */ new Set();
  const result = [];
  head.forEach((item) => {
    const identifier = resolveHeadIdentifier(item);
    if (!identifierSet.has(identifier)) {
      identifierSet.add(identifier);
      result.push(item);
    }
  });
  return result;
};

// src/utils/ensureLeadingSlash.ts
var ensureLeadingSlash = (str) => str.replace(/^\/?/, "/");

// src/utils/ensureEndingSlash.ts
var ensureEndingSlash = (str) => /(\.html|\/)$/.test(str) ? str : str + "/";

// src/utils/formatDateString.ts
var formatDateString = (str, defaultDateString = "") => {
  const dateMatch = str.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);
  if (dateMatch === null) {
    return defaultDateString;
  }
  const [, yearStr, monthStr, dayStr] = dateMatch;
  return [yearStr, monthStr.padStart(2, "0"), dayStr.padStart(2, "0")].join("-");
};

// src/utils/isLinkFtp.ts
var isLinkFtp = (link) => link.startsWith("ftp://");

// src/utils/isLinkHttp.ts
var isLinkHttp = (link) => /^(https?:)?\/\//.test(link);

// src/utils/isLinkExternal.ts
var markdownLinkRegexp = /.md((\?|#).*)?$/;
var isLinkExternal = (link, base = "/") => {
  if (isLinkHttp(link) || isLinkFtp(link)) {
    return true;
  }
  if (link.startsWith("/") && !link.startsWith(base) && !markdownLinkRegexp.test(link)) {
    return true;
  }
  return false;
};

// src/utils/isLinkMailto.ts
var isLinkMailto = (link) => /^mailto:/.test(link);

// src/utils/isLinkTel.ts
var isLinkTel = (link) => /^tel:/.test(link);

// src/utils/isPlainObject.ts
var isPlainObject = (val) => Object.prototype.toString.call(val) === "[object Object]";

// src/utils/removeEndingSlash.ts
var removeEndingSlash = (str) => str.replace(/\/$/, "");

// src/utils/removeLeadingSlash.ts
var removeLeadingSlash = (str) => str.replace(/^\//, "");

// src/utils/resolveLocalePath.ts
var resolveLocalePath = (locales, routePath) => {
  const localePaths = Object.keys(locales).sort((a, b) => {
    const levelDelta = b.split("/").length - a.split("/").length;
    if (levelDelta !== 0) {
      return levelDelta;
    }
    return b.length - a.length;
  });
  for (const localePath of localePaths) {
    if (routePath.startsWith(localePath)) {
      return localePath;
    }
  }
  return "/";
};

// src/utils/resolveRoutePathFromUrl.ts
var resolveRoutePathFromUrl = (url, base = "/") => url.replace(/^(https?:)?\/\/[^/]*/, "").replace(new RegExp(`^${base}`), "/");
export {
  dedupeHead,
  ensureEndingSlash,
  ensureLeadingSlash,
  formatDateString,
  isArray,
  isFunction,
  isLinkExternal,
  isLinkFtp,
  isLinkHttp,
  isLinkMailto,
  isLinkTel,
  isPlainObject,
  isString,
  removeEndingSlash,
  removeLeadingSlash,
  resolveHeadIdentifier,
  resolveLocalePath,
  resolveRoutePathFromUrl
};
