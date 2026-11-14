import classNames from "classnames";
import styles from './styles.module.scss';
import { Tooltip } from "@/components/molecules/Tooltip";

export type Props = {
  className?: string,
  label: JSX.Element,
  description: string,
  active?: boolean,
  onClick: (e: React.MouseEvent<HTMLElement>) => void,
  [kay: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const Icon = ({
  className,
  label,
  description,
  active,
  onClick,
  ...props
}: Props) => {

  return (
    <Tooltip
      title={description}
      placement="top-end"
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 0],
              },
            },
          ],
        },
        tooltip: {
          style: {
            marginBottom: '3px'
          }
        }
      }}
    >
      <a
        className={
          classNames(
            className, styles['icon'],
            {
              [styles['active']]: active,
            }
          )
        }
        onClick={onClick}
        {...props}
      >
        {label}
      </a>
    </Tooltip>
  );
};
Icon.displayName = 'Icon';
export default Icon;