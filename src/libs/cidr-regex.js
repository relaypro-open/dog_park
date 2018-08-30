import ipRegex from "./ip-regex";

const v4 = ipRegex.v4().source + "\\/(3[0-2]|[12]?[0-9])";
const v6 = ipRegex.v6().source + `\\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])`;

const cidrRegex = opts => opts && opts.exact ?
  new RegExp(`(?:^${v4}$)|(?:^${v6}$)`) :
  new RegExp(`(?:${v4})|(?:${v6})`, "g");

cidrRegex.v4 = opts => opts && opts.exact ? new RegExp(`^${v4}$`) : new RegExp(v4, "g");
cidrRegex.v6 = opts => opts && opts.exact ? new RegExp(`^${v6}$`) : new RegExp(v6, "g");

export default cidrRegex;
