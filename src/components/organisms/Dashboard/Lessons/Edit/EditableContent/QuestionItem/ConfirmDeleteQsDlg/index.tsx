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
    userNumber: string,
  },
  onClose: () => void,
  onSubmit: () => void,
}

const ConfirmDeleteQsDlg = memo(({ open, data: { userNumber }, onClose, onSubmit }: Props) => {
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
        <Txt>下記のクエスチョンを削除します。よろしいですか？</Txt>
        <HeaderRow>
          <Col>
            <label htmlFor="name">問題番号</label>
          </Col>
        </HeaderRow>
        <Row>
          <Col>{userNumber}</Col>
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

ConfirmDeleteQsDlg.displayName = 'ConfirmDeleteQsDlg';
export default ConfirmDeleteQsDlg;

export function useConfirmDeleteQsDlg() {
  const [dlgOpen, setDlgOpen] = useState(false); // 新規追加ダイアログオープンフラグ
  const handleOnOpen = useCallback(() => setDlgOpen(true), [setDlgOpen]); // 新規追加ダイアログオープン時の処理
  const handleOnClose = useCallback(() => setDlgOpen(false), [setDlgOpen]); // 新規追加ダイアログクローズ時の処理
  return {
    dlgOpen,
    handleOnOpen,
    handleOnClose,
  };
};