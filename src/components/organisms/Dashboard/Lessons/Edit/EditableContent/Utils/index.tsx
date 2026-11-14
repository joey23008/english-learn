import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@/components/molecules/Menu';
import MenuItem from '@/components/molecules/Menu/Item';
import { useCallback, useState } from 'react';

type Props = {
  className?: string,
  onClickEdit: () => void,
  onClickDelete: () => void,
  anchorElUser: HTMLElement | null,
  handleOnClickIcon: (e: React.MouseEvent<HTMLElement>) => void,
  handleOnClose: () => void,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const Utils = ({
  className,
  onClickEdit,
  onClickDelete,
  anchorElUser,
  handleOnClickIcon,
  handleOnClose,
  ...props
}: Props) => {
  
  const handleOnClickEdit = useCallback(() => {
    handleOnClose();
    onClickEdit();
  }, [onClickEdit, handleOnClose]);
  
  const handleOnClickDelete = useCallback(() => {
    handleOnClose();
    onClickDelete();
  }, [onClickDelete, handleOnClose]);

  return (
    <>
      <IconButton
        className={className}
        onClick={handleOnClickIcon}
        sx={{ p: 0, color: 'inherit' }}
        {...props}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleOnClose}
        placement='left-start'
      >
        <MenuItem onClick={handleOnClickEdit}>
          編集する
        </MenuItem>
        <MenuItem className="danger" onClick={handleOnClickDelete}>
          削除する
        </MenuItem>
      </Menu>
    </>
  );
};
Utils.displayName = 'Utils';
export default Utils;

export function useUtilIcon() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOnClickIcon = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(anchorElUser ? null : event.currentTarget);
  };
  const handleOnClose = () => {
    setAnchorElUser(null);
  };

  return {
    anchorElUser,
    handleOnClickIcon,
    handleOnClose,
  };
}