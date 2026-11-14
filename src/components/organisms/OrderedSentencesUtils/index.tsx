import { useState } from "react";
import classNames from "classnames";
import styles from './styles.module.scss';
import Icon from "./Icon";
import Menu from "@/components/molecules/Menu";
import MenuItem from "@/components/molecules/Menu/Item";
import { Checkbox } from "@/components/molecules/Checkbox";
import { PRIORITIES } from "@/consts";
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

export type Props = {
  className?: string,
  meta: {
    toggle: {
      isExpanded: boolean,
    },
    answer?: {
      active: boolean,
    },
    phrase?: {
      priorities: number[],
    },
  },
  onClickToggle: () => void,
  onClickAnswer?: (e: React.MouseEvent<HTMLElement>) => void,
  onCheckAllPhr?: () => void,
  unSetPhr?: () => void,
  onClickPriority?: (priority: number) => void,
  [kay: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const OrderedSentencesUtils = ({
  className,
  meta: {
    toggle,
    answer,
    phrase,
  },
  onClickToggle,
  onClickAnswer,
  onCheckAllPhr,
  unSetPhr,
  onClickPriority,
  ...props
}: Props) => {
  // フレーズセッティングの状態値
  const isPhrActive = Boolean(phrase && phrase.priorities.length > 0);
  const [phrIcoEl, setPhrIcoEl] = useState<null | HTMLElement>(null);
  const handleOnClickPhr = (event: React.MouseEvent<HTMLElement>) => {
    setPhrIcoEl(phrIcoEl ? null : event.currentTarget);
  };
  const handleOnClosePhrMenu = () => setPhrIcoEl(null);

  return (
    <div className={classNames('flex items-center items-stretch', className)} {...props}>
      <Icon
        className={styles.icon}
        description={
          toggle.isExpanded ? 'チャプターを全てクローズする' : 'チャプターを全てオープンする'
        }
        label={
          toggle.isExpanded ? (
            <UnfoldLessIcon />
          ) : (
            <UnfoldMoreIcon />
          )
        }
        onClick={onClickToggle}
      />
      {
        answer ? (
          <Icon
            className={styles.icon}
            description="全ての答えを表示する"
            label={<span>ans</span>}
            active={Boolean(answer && answer.active)}
            onClick={(e: React.MouseEvent<HTMLElement>) => onClickAnswer ? onClickAnswer(e) : null}
          />
        ) : null
      }
      {
        phrase ? (
          <Icon
            className={styles.icon}
            description="全てのフレーズを表示する"
            label={<span>phr</span>}
            active={isPhrActive}
            onClick={handleOnClickPhr}
          />
        ) : null
      }
      {
        phrase ? (
          <Menu
            anchorEl={phrIcoEl}
            open={Boolean(phrIcoEl)}
            onClose={handleOnClosePhrMenu}
            placement='right-start'
          >
            <MenuItem
              onClick={onCheckAllPhr}
            >
              <p>全て選択</p>
            </MenuItem>
            {
              PRIORITIES.map(priority => (
                <div key={priority} className={classNames('flex', styles['menu-item'])}>
                  <Checkbox
                    id={`priority-${priority}`}
                    checked={phrase.priorities?.includes(priority)}
                    onChange={() => onClickPriority ? onClickPriority(priority) : null}
                  />
                  <label htmlFor={`priority-${priority}`} className={styles['label']}>{priority}</label>
                </div>
              ))
            }
            <MenuItem
              onClick={unSetPhr}
              disabled={!isPhrActive}
            >
              <p>クリア</p>
            </MenuItem>
          </Menu>
        ) : null
      }
    </div>
  );
};
OrderedSentencesUtils.displayName = 'OrderedSentencesUtils';
export default OrderedSentencesUtils;