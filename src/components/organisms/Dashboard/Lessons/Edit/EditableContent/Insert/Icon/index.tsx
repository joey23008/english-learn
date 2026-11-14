import classNames from 'classnames';
import styles from './styles.module.scss';
import AddIcon from '@mui/icons-material/Add';

type Props = {
  className?: string,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const InsertIcon = ({ className, ...props }: Props) => {
  return (
    <AddIcon className={classNames(styles['insert-ico'], className)} {...props} />
  );
};
InsertIcon.displayName = 'InsertIcon';
export default InsertIcon;