import { IDX_DASH_PAGE, IDX_FRONT_PAGE, PAGE_TYPES, PAGE_TYPES_NM } from "@/consts";
import styles from './styles.module.scss';
import BuildIcon from '@mui/icons-material/Build';
import Menu from "@/components/molecules/Menu";
import MenuItem from "@/components/molecules/Menu/Item";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";

type Props = {
  pageType: typeof PAGE_TYPES[number],
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const PageTypeChip = ({ pageType, ...props }: Props) => {
  const router = useRouter();
  const isDashPage = pageType === PAGE_TYPES[IDX_DASH_PAGE];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleOnOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  }, [setAnchorEl]);
  const handleOnClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleOnClickMenu = () => {
    router.push(`/${isDashPage ? PAGE_TYPES[IDX_FRONT_PAGE] : PAGE_TYPES[IDX_DASH_PAGE]}`);
  };

  return (
    <div {...props}>
      <a
        onClick={handleOnOpen}
        className={styles['toggler-page-type']}
      >
        <div className="flex">
          <div className={styles['icon']}>
            {
              isDashPage ? (
                <BuildIcon className="w-[14px] h-[14px]" />
              ) : (
                <span className="inline-block">&lt;/&gt;</span>
              )
            }
          </div>
          <div className={styles['label']}>
            {
              isDashPage ? (
                <span>{PAGE_TYPES_NM[IDX_DASH_PAGE]}</span>
              ) : (
                <span>{PAGE_TYPES_NM[IDX_FRONT_PAGE]}</span>
              )
            }
          </div>
        </div>
      </a>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleOnClose}
        placement='left-start'
      >
        <MenuItem onClick={handleOnClickMenu}>
          { isDashPage ? PAGE_TYPES_NM[IDX_FRONT_PAGE] : PAGE_TYPES_NM[IDX_DASH_PAGE] }に移動する
        </MenuItem>
      </Menu>
    </div>
  );
};
PageTypeChip.displayName = 'PageTypeChip';

export default PageTypeChip;