import { Regex } from "@/consts";

export const noCtrlChar = (value: string | number | null) => {
  if (typeof value !== 'string') {
    return true;
  }
  return !Regex.CTRL_CHAR.test(value);
};