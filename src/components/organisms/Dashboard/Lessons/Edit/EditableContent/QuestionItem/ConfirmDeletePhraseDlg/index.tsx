import { memo, useCallback, useState } from 'react';
import Dialog from '@/components/molecules/Dialog/Index';
import DialogContent from '@/components/molecules/Dialog/DialogContent';
import DialogActions from '@/components/molecules/Dialog/DialogActions';
import Button from '@/components/atoms/Button';
import Txt from '@/components/atoms/Txt';

type Props = {
  open: boolean,
  onClose: () => void,
  onDontDeleteTogether: () => void,
  onDeleteTogether: () => void,
}

const ConfirmDeletePhraseDlg = memo(({ open, onClose, onDontDeleteTogether, onDeleteTogether }: Props) => {
  const setDontDeleteTogetherRef = useCallback((node: HTMLButtonElement | null) => {
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
        <Txt>選択された成句表現との関連付けを解除します。</Txt>
        <Txt>フレーズマスタからも削除しますか？</Txt>
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
          onClick={onDontDeleteTogether}
          ref={setDontDeleteTogetherRef}
        >
          いいえ、マスタからは削除しない
        </Button>
        <Button
          variant="contained"
          onClick={onDeleteTogether}
        >
          はい、マスタからも削除する
        </Button>
      </DialogActions>
    </Dialog>
  );
});

ConfirmDeletePhraseDlg.displayName = 'ConfirmDeletePhraseDlg';
export default ConfirmDeletePhraseDlg;

export function useConfirmDeletePhraseDlg() {
  const [dlgOpen, setDlgOpen] = useState(false); // 新規追加ダイアログオープンフラグ
  const handleOnOpen = useCallback(() => setDlgOpen(true), [setDlgOpen]); // 新規追加ダイアログオープン時の処理
  const handleOnClose = useCallback(() => setDlgOpen(false), [setDlgOpen]); // 新規追加ダイアログクローズ時の処理
  return {
    dlgOpen,
    handleOnOpen,
    handleOnClose,
  };
};