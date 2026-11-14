import { memo } from "react";
import styles from './styles.module.scss';
import classNames from "classnames";

type Props = {
  className?: string,
  children: React.ReactNode,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}
const ListItem = memo(({ className, children, ...props }: Props) => {
  return (
    <div className={classNames(styles['list-item'], className)} {...props}>{children}</div>
  );
});
ListItem.displayName = 'BaseListItem';

export default ListItem;