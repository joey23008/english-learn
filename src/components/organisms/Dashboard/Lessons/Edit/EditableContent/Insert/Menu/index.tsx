import { memo, useCallback, useState } from "react";
import Menu from "@/components/molecules/Menu";
import MenuItem from "@/components/molecules/Menu/Item";
import TypeSelect from "./TypeSelect";

export const EL_TYPE = [
  'chapter',
  'question',
] as const;
export const TYPE_CHAP_IDX = 0;
export const TYPE_QS_IDX = 1;

type Props = {
  insertIconEl: HTMLElement | null,
  onCloseInsertMenu: () => void,
  isChapter: boolean,
  onAddNext: (type: (typeof EL_TYPE)[number]) => void,
  onAddFirst?: (type: (typeof EL_TYPE)[number]) => void,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const InsertMenu = memo(({ insertIconEl, onCloseInsertMenu, isChapter, onAddNext, onAddFirst, ...props }: Props) => {
  // 追加要素タイプ選択メニュー状態値の初期化
  const [listItemEl, setListItemEl] = useState<HTMLElement | null>(null);
  const handleOpenTypeMenu = useCallback((event: React.MouseEvent<HTMLElement>) => { // リストアイテムクリック時にメニューを開く
    setListItemEl(listItemEl ? null : event.currentTarget);
  }, [setListItemEl, listItemEl]);
  const handleCloseTypeMenu = useCallback(() => {
    setListItemEl(null);
    onCloseInsertMenu();
  }, [setListItemEl, onCloseInsertMenu]);
  const handleOnClickType = useCallback((type: (typeof EL_TYPE)[number]) => {
    if (listItemEl) {
      if (listItemEl.dataset.listName === 'add-first' && onAddFirst) {
        onAddFirst(type);
      } else {
        onAddNext(type);
      }
      handleCloseTypeMenu();
    }
  }, [listItemEl, handleCloseTypeMenu, onAddFirst, onAddNext]);

  const handleOnCloseInsertMenu = useCallback(() => {
    if (!listItemEl) {
      onCloseInsertMenu();
    }
  }, [onCloseInsertMenu, listItemEl]);
  
  return (
    <Menu
      anchorEl={insertIconEl}
      open={Boolean(insertIconEl)}
      onClose={handleOnCloseInsertMenu}
      placement='right-start'
      {...props}
    >
      {
        isChapter ? (
          <MenuItem
            data-list-name="add-first"
            onClick={handleOpenTypeMenu}
          >
            <p>リストの先頭に要素を追加</p>
          </MenuItem>
        ) : null
      }
      <MenuItem
        data-list-name="add-next"
        onClick={handleOpenTypeMenu}
      >
        <p>次に要素を追加</p>
      </MenuItem>
      <TypeSelect
        anchorEl={listItemEl}
        onClose={handleCloseTypeMenu}
        onClickType={handleOnClickType}
      />
    </Menu>
  );
});
InsertMenu.displayName = 'InsertMenu';
export default InsertMenu;