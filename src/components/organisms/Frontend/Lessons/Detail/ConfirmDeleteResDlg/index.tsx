import { memo, useCallback, useState } from 'react';
import Dialog from '@/components/molecules/Dialog/Index';
import DialogContent from '@/components/molecules/Dialog/DialogContent';
import DialogActions from '@/components/molecules/Dialog/DialogActions';
import Button from '@/components/atoms/Button';
import Txt from '@/components/atoms/Txt';

type Props = {
  open: boolean,
  onClose: () => void,
  onSubmit: () => void,
}

const ConfirmDeleteRespDlg = memo(({ open, onClose, onSubmit }: Props) => {
  const setSubmitBtnRef = useCallback((node: HTMLButtonElement | null) => {
    if (node) {
      node.focus();
    }
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
    >
      <DialogContent className='min-w-[400px]'>
        <Txt>レッスンに紐づく回答情報を全て削除します。</Txt>
        <Txt>よろしいですか？</Txt>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
        >
          キャンセル
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          ref={setSubmitBtnRef}
        >
          削除する
        </Button>
      </DialogActions>
    </Dialog>
  );
});

ConfirmDeleteRespDlg.displayName = 'ConfirmDeleteRespDlg';
export default ConfirmDeleteRespDlg;

export function useConfirmDeleteRespDlg() {
  const [dlgOpen, setDlgOpen] = useState(false); // 新規追加ダイアログオープンフラグ
  const handleOnOpen = useCallback(() => setDlgOpen(true), [setDlgOpen]); // 新規追加ダイアログオープン時の処理
  const handleOnClose = useCallback(() => setDlgOpen(false), [setDlgOpen]); // 新規追加ダイアログクローズ時の処理
  return {
    dlgOpen,
    handleOnOpen,
    handleOnClose,
  };
};