import classNames from 'classnames';
import styles from './styles.module.scss';

export type Props = {
  className?: string,
  children: React.ReactNode,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
};

const Chip = ({ className, children, ...props }: Props) => {
  return (
    <div
      className={classNames(styles.chip, className)}
      {...props}
    >
      {children}
    </div>
  );
};
Chip.displayName = 'Chip';

export default Chip;