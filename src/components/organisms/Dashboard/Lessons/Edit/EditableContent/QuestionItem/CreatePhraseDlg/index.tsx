import { memo, useCallback, useEffect, useState } from 'react';
import { MSG_ERR } from '@/consts';
import { msgFormat, noCtrlChar } from '@/utils';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import styles from './styles.module.scss';
import Dialog from '@/components/molecules/Dialog/Index';
import DialogTitle from '@/components/molecules/Dialog/DialogTitle';
import DialogContent from '@/components/molecules/Dialog/DialogContent';
import DialogActions from '@/components/molecules/Dialog/DialogActions';
import Button from '@/components/atoms/Button';
import Row, { ErrorRow, HeaderRow } from '@/components/molecules/FormLayout/Row';
import Col from '@/components/molecules/FormLayout/Col';
import TextField from '@/components/atoms/TextField';
import { ErrorTxt } from '@/components/atoms/Txt';
import List from "@/components/molecules/List/Base/Index";
import ListItem from "@/components/molecules/List/Base/ListItem/Index";
import { Phrase } from 'ApiDataTypes';
import { Radio } from '@/components/molecules/Radio';
import classNames from 'classnames';
import { Tooltip } from '@/components/molecules/Tooltip';
import NumberInput from '@/components/molecules/NumberInput';
import ConfirmDlg, { useConfirmDlg } from './ConfirmDlg';

type OnSubmitParams = {
  phraseId?: number,
  en?: string,
  jp?: string,
  priority: number,
};

type Props = {
  open: boolean,
  onClickClose: () => void,
  onSubmit: (params: OnSubmitParams) => void,
  matches: Phrase[],
  onEnChange: (en: string) => Promise<void>,
}

type FormValues = {
  phraseId: string,
  en: string,
  jp: string,
  priority: number,
};

const INIT_CONF_DLG_DATA = {
  phraseId: 0,
  en: '',
  jp: '',
  priority: 0,
} as const;

const CreatePhraseDlg = memo(({ open, onClickClose, onSubmit, matches, onEnChange }: Props) => {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue, control } = useForm<FormValues>({
    defaultValues: {
      phraseId: '',
      en: '',
      jp: '',
      priority: 0,
    }
  });

  const { en, jp, phraseId, priority }  = watch();
  const setInputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.focus();
    }
  }, []);

  // 英文入力時の処理
  useEffect(() => {
    setValue('phraseId', '');
    onEnChange(en);
  }, [en, setValue, onEnChange]);

  // ラジオボタンを再度クリックした際に選択解除する
  const handleOnClickRadio = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if ((e.target as HTMLButtonElement).value === phraseId) {
      setValue('phraseId', '');
    }
  }, [phraseId, setValue]);

  // ダイアログオープン時に状態を初期化する
  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const { dlgOpen: confDlgOpen, handleOnOpen: handleOnConfDlgOpen, handleOnClose: handleOnConfDlgClose } = useConfirmDlg();
  type ConfDlgData = {
    phraseId?: number,
    en: string,
    jp: string,
    priority: number,
  }
  const [confDlgData, setConfDlgData] = useState<ConfDlgData>(JSON.parse(JSON.stringify(INIT_CONF_DLG_DATA)));
  const handleOnConfDlgSubmit = useCallback(() => {
    handleOnConfDlgClose();
    onSubmit({
      en,
      jp,
      phraseId: phraseId ? Number(phraseId) : undefined,
      priority,
    });
  }, [onSubmit, en, jp, phraseId, priority, handleOnConfDlgClose]);

  const handleOnSubmit: SubmitHandler<FormValues> = useCallback(async (data) => {
    const dlgData = {
      phraseId: Number(data.phraseId),
      en: data.en,
      jp: data.jp,
      priority: data.priority,
    };
    if (data.phraseId) {
      const idx = matches.findIndex(v => v.id === Number(data.phraseId));
      const phrase = matches[idx];
      dlgData.en = phrase.en;
      dlgData.jp = phrase.jp;
    }
    setConfDlgData(dlgData);
    handleOnConfDlgOpen();
  }, [matches, setConfDlgData, handleOnConfDlgOpen]);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClickClose}
        maxWidth={false}
      >
        <DialogTitle>成句表現を追加</DialogTitle>
        <DialogContent className='min-w-[700px]'>
          <Row>
            <Col>英文・和訳文を入力するか、関連する正規表現を選択してください。</Col>
          </Row>
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
                      maxLength: 255,
                      validate: {
                        noCtrlChar: v => noCtrlChar(v),
                        required: v => !phraseId? Boolean(v) : true,
                      },
                  })
                }
                error={Boolean(errors.en)}
                inputRef={setInputRef}
              />
            </Col>
          </Row>
          {
            errors.en ? (
              <ErrorRow spacing={10}>
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
                      maxLength: 255,
                      validate: {
                        noCtrlChar: v => noCtrlChar(v),
                        required: v => !phraseId? Boolean(v) : true,
                      },
                  })
                }
                error={Boolean(errors.jp)}
              />
            </Col>
          </Row>
          {
            errors.jp ? (
              <ErrorRow spacing={10}>
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
                    e: React.FocusEvent | React.PointerEvent | React.KeyboardEvent,
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
          <HeaderRow>
            <Col>
              <label>関連する成句表現</label>
            </Col>
          </HeaderRow>
          <Row>
            <Col>
              <List className={styles['match-list']}>
                {
                  matches.length > 0 ? (
                    matches.map(mt => (
                      <ListItem className={styles['match-list-item']} key={mt.id}>
                        <label className="flex items-center font-normal cursor-pointer" htmlFor={String(mt.id)}>
                          <div
                            className={styles.col}
                          >
                            <Radio
                              {
                                ...register("phraseId")
                              }
                              checked={Number(phraseId) === mt.id}
                              value={mt.id}
                              id={String(mt.id)}
                              onClick={handleOnClickRadio}
                            />
                          </div>
                          <Tooltip
                            title={mt.en}
                          >
                            <div
                              className={classNames(styles.col, 'ellipsis')}
                            >
                              {mt.en}
                            </div>
                          </Tooltip>
                          <Tooltip title={mt.jp}>
                            <div
                              className={classNames(styles.col, 'ellipsis')}
                            >
                              {mt.jp}
                            </div>
                          </Tooltip>
                        </label>
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>関連なし</ListItem>
                  )
                }
              </List>
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
            作成
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDlg
        open={confDlgOpen}
        onClose={handleOnConfDlgClose}
        onSubmit={handleOnConfDlgSubmit}
        data={confDlgData}
      />
    </>
  );
});

CreatePhraseDlg.displayName = 'CreatePhraseDlg';
export default CreatePhraseDlg;

export function useCreatePhraseDlg() {
  const [dlgOpen, setDlgOpen] = useState(false); // 新規追加ダイアログオープンフラグ
  const handleOnOpen = useCallback(() => setDlgOpen(true), [setDlgOpen]); // 新規追加ダイアログオープン時の処理
  const handleOnClose = useCallback(() => setDlgOpen(false), [setDlgOpen]); // 新規追加ダイアログクローズ時の処理
  return [
    dlgOpen,
    handleOnOpen,
    handleOnClose,
  ] as const;
}