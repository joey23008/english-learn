import { memo, useCallback, useEffect, useState } from "react";
import styles from './styles.module.scss';
import classNames from "classnames";
import { QsData } from "@/pages/frontend/lessons/[id]";
import { Controller, useForm } from "react-hook-form";
import Row, { ErrorRow } from "@/components/molecules/FormLayout/Row";
import Col from "@/components/molecules/FormLayout/Col";
import Txt, { ErrorTxt } from "@/components/atoms/Txt";
import { noCtrlChar } from "@/utils";
import { MSG_ERR } from "@/consts";
import Accordion from "@/components/molecules/Accordion/Index";
import Toggler from "@/components/molecules/Accordion/Toggler/Index";
import Content from "@/components/molecules/Accordion/Content/Index";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useFirstRender } from "@/hooks/FirstRender";
import SubmitOnEnter from "@/components/atoms/Textarea/SubmitOnEnter/Index";

export type OnUpdateParams = {
  content: string,
  lessonId: number,
  sentenceId: number,
}

type Props = {
  className?: string,
  data: QsData[number]['sentences'][number],
  onUpdate: (props: OnUpdateParams) => void,
  openAns: boolean,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

type FormValues = {
  response: string,
};

const SentenceItem = memo((
  {
    className,
    data,
    onUpdate,
    openAns: parentOpenAns,
    ...props
  }: Props
) => {
  const isFirst = useFirstRender();
  const { handleSubmit, formState: { errors }, setValue, watch, control } = useForm<FormValues>({
    shouldFocusError: false,
  });
  useEffect(() => setValue('response', data.response ?? ''), [data, setValue]);
  const watchVal = watch();
    
  const handleOnSubmit = useCallback(({ response }: FormValues) => {
    if (data.response !== response) {
      onUpdate({
        sentenceId: data.id,
        content: response,
        lessonId: data.lesson_id
      });
    }
  }, [onUpdate, data]);

  // 正答の表示設定値
  const [openAns, setOpenAns] = useState(false);
  const handleOnClickDispAns = useCallback(() => {
    setOpenAns(prev => !prev);
  }, [setOpenAns]);
  useEffect(() => {
    setOpenAns(parentOpenAns);
  }, [parentOpenAns]);

  const notEqual = Boolean(watchVal.response) && data.answer !== watchVal.response;

  return (
    <div
      className={
        classNames(
          className,
          'card p-[20px]'
        )
      }
      {...props}
    >
      <Row widthOptimization={false} style={{ justifyContent: 'start'}}>
        <Col>
          Q&nbsp;:&nbsp;
        </Col>
        <Col>
          <Txt>{data.content}</Txt>
        </Col>
      </Row>
      <Accordion
        open={openAns}
      >
        <Toggler>
          <Row className={classNames('mt-[10px]', styles['disp-ans'])}>
            <Col>
              <a onClick={handleOnClickDispAns} tabIndex={0}>
                <KeyboardArrowDownIcon
                  className={
                    classNames({
                      [styles['icon']]: true,
                      [styles['rotate-up']]: !isFirst && openAns,
                      [styles['rotate-down']]: !isFirst && !openAns,
                    })
                  }
                />
                <span>正答を{openAns ? '隠す' : '表示する'}</span>
              </a>
            </Col>
          </Row>
        </Toggler>
        <Content>
          <Row className={classNames({'mt-[10px]': openAns})} widthOptimization={false} style={{ justifyContent: 'start'}}>
            <Col>
              <label htmlFor="content">A&nbsp;:&nbsp;</label>
            </Col>
            <Col>
              <Txt className="font-bold">{data.answer}</Txt>
            </Col>
          </Row>
        </Content>
      </Accordion>
      <Row className="mt-[10px]">
        <Col>
          <Controller
            control={control}
            name="response"
            rules={{
              validate: {
                noCtrlChar: v => noCtrlChar(v),
              },
            }}
            render={({
              field: { value, ref },
            }) => {
              return (
                <SubmitOnEnter
                  value={value}
                  onInput={(e: React.FormEvent<HTMLTextAreaElement>) => setValue('response', (e.target as HTMLTextAreaElement).value)}
                  id="response"
                  onSubmit={handleSubmit(handleOnSubmit)}
                  onBlur={handleSubmit(handleOnSubmit)}
                  error={Boolean(errors.response) || notEqual}
                  ref={ref}
                />
              );
            }}
          />
        </Col>
      </Row>
      {
        errors.response ? (
          <ErrorRow>
            <Col>
              {
                errors?.response?.type === 'noCtrlChar' && <ErrorTxt size='s'>{MSG_ERR.NO_CTRL_CHAR}</ErrorTxt>
              }
            </Col>
          </ErrorRow>
        ) : null
      }
    </div>
  );
});
SentenceItem.displayName = 'SentenceItem';
export default SentenceItem;