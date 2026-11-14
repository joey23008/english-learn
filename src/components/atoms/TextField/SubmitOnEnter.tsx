import React, { FormEventHandler, forwardRef, MutableRefObject, useCallback, useEffect, useRef } from 'react';
import TextField from './index';

export type Props = {
  className?: string,
  onSubmit?: () => FormEventHandler<HTMLFormElement>,
  inputRef?: MutableRefObject<HTMLInputElement | null> | ((elm: HTMLInputElement | null) => void),
  focusOnMounted?: boolean,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const SubmitOnEnter = forwardRef(({ className, onSubmit, inputRef: currentInputRef, focusOnMounted=true, ...props }: Props, ref: React.ForwardedRef<any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const inputRef = useRef<HTMLInputElement | null>(null); // テキストフィールドの参照
  const setInputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      inputRef.current = node;
      if (currentInputRef) {
        if (typeof currentInputRef === 'function') {
          currentInputRef(node);
        } else {
          currentInputRef.current = node;
        }
      }
    }
  }, [currentInputRef, inputRef]);

  // マウント後にフォーカスする
  useEffect(() => {
    if (inputRef.current && focusOnMounted) {
      inputRef.current.focus();
    }
  }, [inputRef, focusOnMounted]);
  
  return (
    <form className={className} onSubmit={onSubmit}>
      <TextField
        className='w-full'
        ref={ref}
        inputRef={setInputRef}
        {...props}
      />
    </form>
  );
});
SubmitOnEnter.displayName = 'SubmitOnEnter';

export default SubmitOnEnter;