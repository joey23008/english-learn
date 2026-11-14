import { useMemo } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { mapParts } from '@/utils';

type Props = {
  spacing?: number,
  children: JSX.Element | JSX.Element[],
  widthOptimization?: boolean,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const rowFactory = (role: string) => {
  return function Row({ spacing=0, children, className, widthOptimization=true, ...props }: Props) {
    const [colEl] = mapParts(Array.isArray(children) ? children : [children], ['Col']);
    const width = useMemo(() => {
      if (widthOptimization) {
        const colLenth = colEl.length;
        const padding = spacing * (colLenth - 1);
        return `calc((100% - ${padding}px) / ${colEl.length})`;
      } else {
        return 'auto';
      }
    }, [colEl, spacing, widthOptimization]);
  
    return (
      <div
        className={classNames(className, styles.row, styles[role])}
        {...props}
      >
        {
          colEl.map((el, idx) => (
            <div
              key={idx}
              style={{
                width
              }}
            >
              {el}
            </div>
          ))
        }
      </div>
    );
  };
};

export default rowFactory('default');

export const ErrorRow = rowFactory('error');

Object.assign(ErrorRow, { displayName: 'ErrorRow' });

export const HeaderRow = rowFactory('header');

Object.assign(HeaderRow, { displayName: 'HeaderRow' });