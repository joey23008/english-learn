import { memo, useCallback, useEffect, useState } from 'react';
import { MSG_ERR } from '@/consts';
import { msgFormat, noCtrlChar } from '@/utils';
import { useForm, SubmitHandler } from 'react-hook-form';
import Dialog from '@/components/molecules/Dialog/Index';
import DialogTitle from '@/components/molecules/Dialog/DialogTitle';
import DialogContent from '@/components/molecules/Dialog/DialogContent';
import DialogActions from '@/components/molecules/Dialog/DialogActions';
import Button from '@/components/atoms/Button';
import Row, { ErrorRow, HeaderRow } from '@/components/molecules/FormLayout/Row';
import Col from '@/components/molecules/FormLayout/Col';
import TextField from '@/components/atoms/TextField';
import { ErrorTxt } from '@/components/atoms/Txt';

type Props = {
  open: boolean,
  onClickClose: () => void,
  onSubmit: (params: FormValues) => void,
}

type FormValues = {
  name: string,
};

const LessonCreateDlg = memo(({ open, onClickClose, onSubmit }: Props) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    defaultValues: {
      name: '',
    }
  });
  const handleOnSubmit: SubmitHandler<FormValues> = useCallback(async (data) => {
    onSubmit(data);
  }, [onSubmit]);

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog
      open={open}
      onClose={onClickClose}
    >
      <DialogTitle>レッスンを追加</DialogTitle>
      <DialogContent className='min-w-[500px]'>
        <HeaderRow style={{ marginTop: 0 }}>
          <Col>
            <label htmlFor="name">名前</label>
          </Col>
        </HeaderRow>
        <Row spacing={10}>
          <Col>
            <TextField
              id="name"
              className="w-full"
              {
                ...register("name", {
                    required: true,
                    maxLength: 255,
                    validate: {
                      noCtrlChar: v => noCtrlChar(v)
                    },
                })
              }
              error={Boolean(errors.name)}
            />
          </Col>
        </Row>
        {
          errors.name ? (
            <ErrorRow spacing={10}>
              <Col>
                {
                  errors?.name?.type === 'required' && <ErrorTxt size='s'>{MSG_ERR.REQUIRED_VALUE}</ErrorTxt>
                }
                {
                  errors?.name?.type === 'maxLength' && <ErrorTxt size='s'>{msgFormat(MSG_ERR.EXCESSIVE_NUMBER_OF_DIGITS, 255)}</ErrorTxt>
                }
                {
                  errors?.name?.type === 'noCtrlChar' && <ErrorTxt size='s'>{MSG_ERR.NO_CTRL_CHAR}</ErrorTxt>
                }
              </Col>
            </ErrorRow>
          ) : null
        }
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClickClose}
          variant="outlined"
        >
          キャンセル
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(handleOnSubmit)}
        >
          作成
        </Button>
      </DialogActions>
    </Dialog>
  );
});

LessonCreateDlg.displayName = 'LessonCreateDlg';
export default LessonCreateDlg;

export function useCreateDlg() {
  const [dlgOpen, setDlgOpen] = useState(false); // 新規追加ダイアログオープンフラグ
  const handleOnOpen = useCallback(() => setDlgOpen(true), [setDlgOpen]); // 新規追加ダイアログオープン時の処理
  const handleOnClose = useCallback(() => setDlgOpen(false), [setDlgOpen]); // 新規追加ダイアログクローズ時の処理
  return [
    dlgOpen,
    handleOnOpen,
    handleOnClose,
  ] as const;
}