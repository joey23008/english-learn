import React, { forwardRef, useCallback } from 'react';
import styles from './styles.module.scss';
import Popper from '../Popper';
import type { Props as PopperProps } from '../Popper';
import Fade from '../Fade';
import { useOutsideClick } from '@/hooks/useOutsideClick';

type Props = PopperProps & {
  onClose: () => void,
}

const Menu = forwardRef<any, Props>(({ className, anchorEl, children, onClose, ...props }, ref) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const listRef = useOutsideClick((e: React.MouseEvent<HTMLDivElement>) => {
    if (anchorEl && !(anchorEl as HTMLElement).contains(e.target as Node)) {
      onClose();
    }
  });
  // 開いた際にリストの最初の要素にフォーカスする
  const setListRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      (node.getElementsByClassName('menu-list-item')[0] as HTMLDivElement).focus();
      listRef.current = node;
    }
  }, [listRef]);
  // タブ送りでフォーカスがリストから外れたら参照要素にフォーカスする
  const handleOnDammyFocus = useCallback(() => {
    if (anchorEl) {
      (anchorEl as HTMLElement).focus();
      onClose();
    }
  }, [anchorEl, onClose]);

  return (
    <Popper
      className={className}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        }
      ]}
      anchorEl={anchorEl}
      transition
      ref={ref}
      {...props}
    >
      {
        ({ TransitionProps  }) => (
          <Fade {...TransitionProps } timeout={350}>
            <div className={styles.list} ref={setListRef}>
              <div tabIndex={0} onFocus={handleOnDammyFocus}></div>
              {children as unknown as React.ReactElement}
              <div tabIndex={0} onFocus={handleOnDammyFocus}></div>
            </div>
          </Fade>
        )
      }
    </Popper>
  );
});
Menu.displayName = 'Menu';
export default Menu;