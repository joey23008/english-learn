import { memo, useCallback, useState } from "react";
import InsertIcon from "../Insert/Icon";
import InsertMenu from "./Menu";
import { EL_TYPE } from "./Menu";

type Props = {
  iconProps?: {
    className?: string,
    [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  }
  isChapter?: boolean,
  onAddNext: (type: (typeof EL_TYPE)[number]) => void,
  onAddFirst?: (type: (typeof EL_TYPE)[number]) => void,
  menunProps?: {
    [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  },
  insertIconEl: HTMLElement | null,
  handleOpenInsertMenu: (e: React.MouseEvent<HTMLElement>) => void,
  handleCloseInsertMenu: () => void,
}

const Insert = memo(({
  iconProps: tmpIconProps,
  isChapter=true,
  menunProps,
  onAddNext,
  onAddFirst,
  insertIconEl,
  handleOpenInsertMenu,
  handleCloseInsertMenu,
}: Props) => {
  const { className: icoClssNm, ...iconProps } = tmpIconProps ? tmpIconProps : {};

  return (
    <>
      <InsertIcon
        className={icoClssNm}
        onClick={handleOpenInsertMenu}
        {...iconProps}
      />
      <InsertMenu
        insertIconEl={insertIconEl}
        onCloseInsertMenu={handleCloseInsertMenu}
        isChapter={isChapter}
        onAddNext={onAddNext}
        onAddFirst={onAddFirst}
        {...menunProps}
      />
    </>
  );
});
Insert.displayName = 'Insert';
export default Insert;

export function useInsertIcon() {
  const [insertIconEl, setInsertIconEl] = useState<HTMLElement | null>(null);
  const handleOpenInsertMenu = useCallback((event: React.MouseEvent<HTMLElement>) => { // アイコンクリック時にメニューを開く
    setInsertIconEl(insertIconEl ? null : event.currentTarget);
  }, [setInsertIconEl, insertIconEl]);
  const handleCloseInsertMenu = useCallback(() => {
    setInsertIconEl(null);
  }, [setInsertIconEl]);

  return {
    insertIconEl,
    handleOpenInsertMenu,
    handleCloseInsertMenu,
  };
}