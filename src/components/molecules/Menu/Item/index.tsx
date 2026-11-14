import { KeyboardEventHandler, useCallback } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';

type Props = {
  disabled?: boolean,
} & DammyComponentType

const MenuItem = ({ children, className, onClick, disabled, ...props}: Props) => {
  const handleOnClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      onClick(e);
    }
  }, [onClick, disabled]);

  const handleOnKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback((e) => {
    if (e.key === 'Enter' && onClick) {
      e.preventDefault();
      handleOnClick(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
  }, [onClick, handleOnClick]);
  
  return (
    <div
      className={
        classNames(
          className,
          styles['list-item'],
          'menu-list-item',
          {
            [styles.disabled]: disabled,
          }
        )
      }
      tabIndex={ !disabled ? 0: -1 }
      onClick={handleOnClick}
      onKeyDown={handleOnKeyDown}
      {...props}
    >
      {children}
    </div>
  );
};
MenuItem.displayName = 'MenuItem';
export default MenuItem;