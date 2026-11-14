import { memo } from "react";
import Menu from "@/components/molecules/Menu";
import MenuItem from "@/components/molecules/Menu/Item";

export const EL_TYPE = [
  'chapter',
  'question',
] as const;
export const TYPE_CHAP_IDX = 0;
export const TYPE_QS_IDX = 1;

type Props = {
  anchorEl: HTMLElement | null,
  onClose: () => void,
  onClickType: (type: (typeof EL_TYPE)[number]) => void,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const TypeSelect = memo(({ anchorEl, onClose, onClickType, ...props }: Props) => {  
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      placement='right-start'
      {...props}
    >
      <MenuItem
        onClick={() => onClickType(EL_TYPE[TYPE_CHAP_IDX])}
      >
        <p>チャプターを追加する</p>
      </MenuItem>
      <MenuItem
        onClick={() => onClickType(EL_TYPE[TYPE_QS_IDX])}
      >
        <p>クエスチョンを追加する</p>
      </MenuItem>
    </Menu>
  );
});
TypeSelect.displayName = 'TypeSelect';
export default TypeSelect;