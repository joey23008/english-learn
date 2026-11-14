import React, { forwardRef } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@/components/molecules/Menu';

type BasicDTMenuProps = {
  children: React.ReactNode,
  open: boolean,
  onMenuIconClick: () => void,
  onClose: (event: object, reason: string) => void,
  menuIconRender?: React.ReactNode,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const DF_MENU_ICO = <IconButton><MoreVertIcon /></IconButton>;
const BasicDTMenu = forwardRef<any, BasicDTMenuProps>(({ // eslint-disable-line @typescript-eslint/no-explicit-any
  className, children, open, onMenuIconClick, onClose, menuIconRender=DF_MENU_ICO, ...props
}, ref) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onMenuIconClick();
  };

  return (
    <div className={classNames(className, styles['util-menu'])} {...props} ref={ref}>
      <div
        className="inline-block"
        onClick={handleClick}
      >
        {menuIconRender}
      </div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        placement='left-start'
      >
        {children}
      </Menu>
    </div>
  );
});
BasicDTMenu.displayName = 'BasicDTMenu';
export default BasicDTMenu;