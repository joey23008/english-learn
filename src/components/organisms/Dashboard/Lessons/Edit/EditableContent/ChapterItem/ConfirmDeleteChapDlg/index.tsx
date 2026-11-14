import { memo, useCallback, useState } from 'react';
import Dialog from '@/components/molecules/Dialog/Index';
import DialogContent from '@/components/molecules/Dialog/DialogContent';
import DialogActions from '@/components/molecules/Dialog/DialogActions';
import Button from '@/components/atoms/Button';
import Txt from '@/components/atoms/Txt';
import Row, { HeaderRow } from '@/components/molecules/FormLayout/Row';
import Col from '@/components/molecules/FormLayout/Col';

type Props = {
  open: boolean,
  data: {
    name: string,
  },
  onClose: () => void,
  onSubmit: () => void,
}

const ConfirmDeleteChapDlg = memo(({ open, data: { name }, onClose, onSubmit }: Props) => {
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
        <Txt>チャプターデータを削除すると紐づくクエスチョンデータも全て削除されます。</Txt>
        <Txt>よろしいですか？</Txt>
        <HeaderRow>
          <Col>
            <label htmlFor="name">チャプター名</label>
          </Col>
        </HeaderRow>
        <Row>
          <Col>{name}</Col>
        </Row>
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

ConfirmDeleteChapDlg.displayName = 'ConfirmDeleteChapDlg';
export default ConfirmDeleteChapDlg;

export function useConfirmDeleteChapDlg() {
  const [dlgOpen, setDlgOpen] = useState(false); // 新規追加ダイアログオープンフラグ
  const handleOnOpen = useCallback(() => setDlgOpen(true), [setDlgOpen]); // 新規追加ダイアログオープン時の処理
  const handleOnClose = useCallback(() => setDlgOpen(false), [setDlgOpen]); // 新規追加ダイアログクローズ時の処理
  return {
    dlgOpen,
    handleOnOpen,
    handleOnClose,
  };
};