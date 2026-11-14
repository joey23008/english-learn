import React, { forwardRef, KeyboardEventHandler, useCallback, useState } from 'react';
import Textarea from '../Index';
import type { Props as TextareaProps } from '../Index';
import classNames from 'classnames';
import styles from './styles.module.scss';

export type Props = TextareaProps & {
  onSubmit?: (e: React.MouseEvent<HTMLTextAreaElement>) => void,
  error?: boolean,
}

const SubmitOnEnter = forwardRef(({ className, onSubmit, error, ...props }: Props, ref: React.ForwardedRef<any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any

  const [composing, setComposing] = useState(false);
  const handleOnKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    if (e.key === 'Enter' && !composing && onSubmit) {
      e.preventDefault();
      onSubmit(e as unknown as React.MouseEvent<HTMLTextAreaElement>);
    }
  }, [onSubmit, composing]);
  
  return (
    <Textarea
      className={classNames(
        'w-full',
        className,
        {
          [styles['error']]: error,
        }
      )}
      ref={ref}
      onKeyDown={handleOnKeyDown}
      onCompositionStart={() => {
        setComposing(true);
      }}
      onCompositionEnd={() => {
        setComposing(false);
      }}
      {...props}
    />
  );
});
SubmitOnEnter.displayName = 'TextareaSubmitOnEnter';

export default SubmitOnEnter;