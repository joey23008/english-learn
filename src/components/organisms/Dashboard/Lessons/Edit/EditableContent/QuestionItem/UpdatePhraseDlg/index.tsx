import { memo, useCallback, useEffect, useState } from 'react';
import { MSG_ERR } from '@/consts';
import { msgFormat, noCtrlChar } from '@/utils';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import Dialog from '@/components/molecules/Dialog/Index';
import DialogTitle from '@/components/molecules/Dialog/DialogTitle';
import DialogContent from '@/components/molecules/Dialog/DialogContent';
import DialogActions from '@/components/molecules/Dialog/DialogActions';
import Button from '@/components/atoms/Button';
import Row, { ErrorRow, HeaderRow } from '@/components/molecules/FormLayout/Row';
import Col from '@/components/molecules/FormLayout/Col';
import TextField from '@/components/atoms/TextField';
import { ErrorTxt } from '@/components/atoms/Txt';
import NumberInput from '@/components/molecules/NumberInput';
import { OrderedSentences } from 'ApiDataTypes';

type SubmitParams = {
  id: number,
  phraseId: number,
  en: string,
  jp: string,
  priority: number,
}

type Props = {
  data?: OrderedSentences['phrases'][number],
  open: boolean,
  onClickClose: () => void,
  onSubmit: (params: SubmitParams) => void,
}

type FormValues = {
  en: string,
  jp: string,
  priority: number,
};

const UpdatePhraseDlg = memo(({ data, open, onClickClose, onSubmit }: Props) => {
  const { register, handleSubmit, formState: { errors }, setValue, reset, control } = useForm<FormValues>({
    defaultValues: {
      en: data?.en,
      jp: data?.jp,
      priority: data?.priority ?? 0,
    }
  });
  // ダイアログを開いたら英文入力にフォーカスする
  const setEnRef = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.focus();
    }
  }, []);

  // ダイアログを開いた際の処理
  useEffect(() => {
    if (open) {
      reset(); // エラーの初期化
      setValue('en', data?.en ?? '');
      setValue('jp', data?.jp ?? '');
      setValue('priority', data?.priority ?? 0);
    }
  }, [open, data, setValue, reset]);

  const handleOnSubmit: SubmitHandler<FormValues> = useCallback(async (formData) => {
    onSubmit({
      ...formData,
      id: data?.qs_ph_id as number,
      phraseId: data?.id as number,
    });
  }, [onSubmit, data]);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClickClose}
        maxWidth={false}
      >
        <DialogTitle>成句表現を更新</DialogTitle>
        <DialogContent className='min-w-[700px]'>
          <HeaderRow>
            <Col>
              <label htmlFor="name">英文</label>
            </Col>
          </HeaderRow>
          <Row>
            <Col>
              <TextField
                id="en"
                className="w-full"
                {
                  ...register("en", {
                      required: true,
                      maxLength: 255,
                      validate: {
                        noCtrlChar: v => noCtrlChar(v),
                      },
                  })
                }
                inputRef={setEnRef}
                error={Boolean(errors.en)}
              />
            </Col>
          </Row>
          {
            errors.en ? (
              <ErrorRow>
                <Col>
                  {
                    errors?.en?.type === 'required' && <ErrorTxt size='s'>{MSG_ERR.REQUIRED_VALUE}</ErrorTxt>
                  }
                  {
                    errors?.en?.type === 'maxLength' && <ErrorTxt size='s'>{msgFormat(MSG_ERR.EXCESSIVE_NUMBER_OF_DIGITS, 255)}</ErrorTxt>
                  }
                  {
                    errors?.en?.type === 'noCtrlChar' && <ErrorTxt size='s'>{MSG_ERR.NO_CTRL_CHAR}</ErrorTxt>
                  }
                </Col>
              </ErrorRow>
            ) : null
          }
          <HeaderRow>
            <Col>
              <label htmlFor="name">和訳文</label>
            </Col>
          </HeaderRow>
          <Row>
            <Col>
              <TextField
                id="jp"
                className="w-full"
                {
                  ...register("jp", {
                      required: true,
                      maxLength: 255,
                      validate: {
                        noCtrlChar: v => noCtrlChar(v),
                      },
                  })
                }
                error={Boolean(errors.jp)}
              />
            </Col>
          </Row>
          {
            errors.jp ? (
              <ErrorRow>
                <Col>
                  {
                    errors?.jp?.type === 'required' && <ErrorTxt size='s'>{MSG_ERR.REQUIRED_VALUE}</ErrorTxt>
                  }
                  {
                    errors?.jp?.type === 'maxLength' && <ErrorTxt size='s'>{msgFormat(MSG_ERR.EXCESSIVE_NUMBER_OF_DIGITS, 255)}</ErrorTxt>
                  }
                  {
                    errors?.jp?.type === 'noCtrlChar' && <ErrorTxt size='s'>{MSG_ERR.NO_CTRL_CHAR}</ErrorTxt>
                  }
                </Col>
              </ErrorRow>
            ) : null
          }
          <HeaderRow>
            <Col>
              <label htmlFor="name">優先度</label>
            </Col>
          </HeaderRow>
          <Row>
            <Col>
              <Controller
                control={control}
                name="priority"
                render={({
                  field: { onChange, value, ref },
                }) => {
                  const handleOnChange = (
                    _e: React.FocusEvent | React.PointerEvent | React.KeyboardEvent,
                    newValue: number | null
                  ) => {
                    onChange(newValue);
                  };
                  const numValue = Number(value);
                  return (
                    <NumberInput
                      onChange={handleOnChange} // send value to hook form
                      value={numValue}
                      min={0}
                      max={2}
                      ref={ref}
                    />
                  );
                }}
              />
            </Col>
          </Row>
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
            更新
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

UpdatePhraseDlg.displayName = 'UpdatePhraseDlg';
export default UpdatePhraseDlg;

export function useUpdatePhraseDlg() {
  const [dlgOpen, setDlgOpen] = useState(false); // 新規追加ダイアログオープンフラグ
  const handleOnOpen = useCallback(() => setDlgOpen(true), [setDlgOpen]); // 新規追加ダイアログオープン時の処理
  const handleOnClose = useCallback(() => setDlgOpen(false), [setDlgOpen]); // 新規追加ダイアログクローズ時の処理
  return [
    dlgOpen,
    handleOnOpen,
    handleOnClose,
  ] as const;
}