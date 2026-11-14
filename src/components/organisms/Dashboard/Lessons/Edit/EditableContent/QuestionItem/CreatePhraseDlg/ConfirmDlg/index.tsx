import { memo, useCallback, useState } from 'react';
import Dialog from '@/components/molecules/Dialog/Index';
import DialogContent from '@/components/molecules/Dialog/DialogContent';
import DialogActions from '@/components/molecules/Dialog/DialogActions';
import Button from '@/components/atoms/Button';
import Row, { HeaderRow } from '@/components/molecules/FormLayout/Row';
import Col from '@/components/molecules/FormLayout/Col';

type Props = {
  open: boolean,
  onClose: () => void,
  onSubmit: () => void,
  data: {
    phraseId?: number,
    en: string,
    jp: string,
    priority: number,
  }
}

const ConfirmDlg = memo(({ open, onClose, onSubmit, data: { phraseId, en, jp, priority} }: Props) => {
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
        <Row>
          <Col>下記データとの関連付けを行います。問題なければOKをクリックしてください。</Col>
        </Row>
        <HeaderRow>
          <Col>
            <label>英文</label>
          </Col>
        </HeaderRow>
        <Row>
          <Col>{en}</Col>
        </Row>
        <HeaderRow>
          <Col>
            <label>和訳文</label>
          </Col>
        </HeaderRow>
        <Row>
          <Col>{jp}</Col>
        </Row>
        <HeaderRow>
          <Col>
            <label>優先度</label>
          </Col>
        </HeaderRow>
        <Row>
          <Col>{priority}</Col>
        </Row>
        <HeaderRow>
          <Col>
            <label>フレーズマスタへの新規追加</label>
          </Col>
        </HeaderRow>
        <Row>
          <Col>{phraseId ? '無し' : '有り'}</Col>
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
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
});

ConfirmDlg.displayName = 'ConfirmDlg';
export default ConfirmDlg;

export function useConfirmDlg() {
  const [dlgOpen, setDlgOpen] = useState(false); // 新規追加ダイアログオープンフラグ
  const handleOnOpen = useCallback(() => setDlgOpen(true), [setDlgOpen]); // 新規追加ダイアログオープン時の処理
  const handleOnClose = useCallback(() => setDlgOpen(false), [setDlgOpen]); // 新規追加ダイアログクローズ時の処理
  return {
    dlgOpen,
    handleOnOpen,
    handleOnClose,
  };
};