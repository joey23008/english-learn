export const Regex = {
  CTRL_CHAR: /[\x00-\x1F\x7F-\x9F]/,
  EMAIL: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9_+-]+\.[a-zA-Z0-9_+-]+$/,
  PASS: /^[\w\d\.-_@]{8,16}$/,
} as const;