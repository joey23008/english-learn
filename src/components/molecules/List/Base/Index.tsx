import classNames from "classnames";
import { memo } from "react";

type Props = {
  className?: string,
  children: JSX.Element | JSX.Element[],
}
const List = memo(({ className, children }: Props) => {
  return (
    <div className={classNames('flex flex-col', className)}>{children}</div>
  );
});
List.displayName = 'BaseList';

export default List;