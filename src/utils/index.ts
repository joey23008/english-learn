export * from './date';
export * from './validations';

export function debug (this: any, ...args: any[]) { // eslint-disable-line @typescript-eslint/no-explicit-any
  args.unshift(((new Date()).toLocaleString()));
  console.log.apply(this, args);
};

export function mapParts(elems: JSX.Element[], partTypes: string[]) {
  const parts: JSX.Element[][] = [];
  partTypes.forEach((_type, idx) => parts[idx] = []);
  elems.map((elem) => {
    const idx = partTypes.indexOf(elem.type.displayName);
    if (!~idx) return;
    parts[idx].push(elem.props.children);
  });
  return parts;
};

export const msgFormat = (str: string, ...args: unknown[]): string => {
  for (const [i, arg] of args.entries()) {
    const regExp = new RegExp(`\\{${i}\\}`, 'g');
    str = str.replace(regExp, arg as string);
  }
  return str;
};

// dom要素のCSSプロパティを取得する
export function getComputedStyle (elem: HTMLElement, prop: string, pseudoElt?: string) {
  return window.getComputedStyle(elem, pseudoElt).getPropertyValue(prop).trim();
};